const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PROXY_PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'deepseek-coder-v2:16b';
const CONTEXT_LIMIT = parseInt(process.env.CONTEXT_WINDOW_LIMIT) || 12000;

// ログディレクトリ作成
const logDir = path.join(__dirname, process.env.LOG_DIR || 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));

// Request Logging
const requestLog = [];
function logRequest(method, endpoint, status, duration) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${method} ${endpoint} - Status: ${status} - Duration: ${duration}ms\n`;
  
  if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
    const logFile = path.join(logDir, `proxy-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logEntry);
  }
  
  console.log(logEntry.trim());
}

// ================== Core Functions ==================

/**
 * メッセージ圧縮（トークン削減）
 */
function compressMessages(messages) {
  if (!Array.isArray(messages)) return [];
  
  // 最新 N メッセージに限定
  const maxHistory = parseInt(process.env.MAX_HISTORY_MESSAGES) || 15;
  const compressed = messages.slice(-maxHistory);
  
  // テキスト長で制限
  let totalLength = 0;
  const filtered = [];
  
  for (const msg of compressed.reverse()) {
    const msgLength = JSON.stringify(msg).length;
    if (totalLength + msgLength < CONTEXT_LIMIT * 4) {
      filtered.push(msg);
      totalLength += msgLength;
    }
  }
  
  return filtered.reverse();
}

/**
 * Claude フォーマット → DeepSeek フォーマット変換
 */
function convertToDeepSeekFormat(messages) {
  let prompt = '';
  
  // システムコンテキストを構築
  prompt += 'You are an expert programming assistant for code generation, analysis, and debugging.\n';
  prompt += 'Provide clear, concise, and production-ready code solutions.\n';
  prompt += 'Use appropriate language idioms and best practices.\n\n';
  
  // メッセージ履歴を追加
  for (const msg of messages) {
    if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    }
  }
  
  prompt += 'Assistant: ';
  return prompt;
}

/**
 * Ollama 推論実行
 */
async function callOllama(prompt) {
  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: MODEL,
        prompt: prompt,
        stream: true,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.3,
        num_predict: parseInt(process.env.MAX_TOKENS) || 2000,
        top_p: 0.9,
        repeat_penalty: 1.1,
      },
      {
        timeout: parseInt(process.env.TIMEOUT_MS) || 60000,
        responseType: 'stream',
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ Ollama Error:', error.message);
    throw new Error(`Ollama 接続エラー: ${error.message}`);
  }
}

/**
 * Claude API 互換レスポンス生成
 */
function formatAsClaudeResponse(text) {
  return {
    type: 'content_block_delta',
    index: 0,
    delta: {
      type: 'text_delta',
      text: text,
    },
  };
}

// ================== API Endpoints ==================

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Ollama Status Check
 */
app.get('/ollama-status', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, {
      timeout: 5000,
    });
    
    res.json({
      status: 'connected',
      models: response.data.models || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Claude API v1/messages エンドポイント互換
 */
app.post('/v1/messages', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { messages = [], max_tokens = 2000, system = null } = req.body;
    
    console.log(`\n📨 リクエスト受信: ${messages.length} メッセージ`);
    
    // メッセージ圧縮
    const compressed = compressMessages(messages);
    console.log(`✅ 圧縮後: ${compressed.length} メッセージ`);
    
    // DeepSeek フォーマット変換
    const prompt = convertToDeepSeekFormat(compressed);
    console.log(`📝 プロンプト長: ${prompt.length} 文字`);
    
    // Ollama 呼び出し
    const ollamaStream = await callOllama(prompt);
    
    // ストリーミング応答
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    let fullResponse = '';
    
    ollamaStream.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          
          if (json.response) {
            fullResponse += json.response;
            
            // Claude 互換形式で送信
            const claudeFormat = formatAsClaudeResponse(json.response);
            res.write(`data: ${JSON.stringify(claudeFormat)}\n\n`);
          }
          
          if (json.done) {
            console.log(`✨ 推論完了: ${fullResponse.length} 文字`);
          }
        } catch (e) {
          // JSON パース失敗時はスキップ
        }
      }
    });
    
    ollamaStream.on('end', () => {
      const duration = Date.now() - startTime;
      res.write(`data: ${JSON.stringify({
        type: 'message_stop',
        index: 0,
      })}\n\n`);
      res.end();
      
      logRequest('POST', '/v1/messages', 200, duration);
    });
    
    ollamaStream.on('error', (error) => {
      console.error('❌ Stream Error:', error);
      const duration = Date.now() - startTime;
      logRequest('POST', '/v1/messages', 500, duration);
      
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logRequest('POST', '/v1/messages', 500, duration);
    
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * デバッグ用: プロンプト変換テスト
 */
app.post('/debug/convert-prompt', (req, res) => {
  try {
    const { messages = [] } = req.body;
    const converted = convertToDeepSeekFormat(messages);
    
    res.json({
      original: messages,
      converted: converted,
      length: converted.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * デバッグ用: メッセージ圧縮テスト
 */
app.post('/debug/compress-messages', (req, res) => {
  try {
    const { messages = [] } = req.body;
    const compressed = compressMessages(messages);
    
    res.json({
      original_count: messages.length,
      compressed_count: compressed.length,
      original_size: JSON.stringify(messages).length,
      compressed_size: JSON.stringify(compressed).length,
      messages: compressed,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ================== Error Handling ==================

app.use((err, req, res, next) => {
  console.error('🔴 Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// ================== Server Start ==================

app.listen(PORT, () => {
  console.log('\n🚀 Claude-DeepSeek Bridge プロキシ起動');
  console.log(`📌 Port: ${PORT}`);
  console.log(`🔗 Ollama: ${OLLAMA_URL}`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`📊 Context Limit: ${CONTEXT_LIMIT} tokens`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}\n`);
  
  // Ollama 接続確認
  axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 })
    .then(res => {
      console.log(`✅ Ollama 接続確認: ${res.data.models?.length || 0} モデル利用可能\n`);
    })
    .catch(err => {
      console.warn(`⚠️  Ollama 未起動の可能性: ${err.message}\n`);
    });
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 プロキシをシャットダウン...');
  process.exit(0);
});
