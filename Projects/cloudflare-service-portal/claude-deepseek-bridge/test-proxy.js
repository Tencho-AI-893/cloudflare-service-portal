const axios = require('axios');
require('dotenv').config();

const PROXY_URL = `http://localhost:${process.env.PROXY_PORT || 3000}`;

async function runTests() {
  console.log('🧪 Claude-DeepSeek Bridge プロキシ テスト実行\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣  Health Check...');
    const healthRes = await axios.get(`${PROXY_URL}/health`);
    console.log(`   ✅ Status: ${healthRes.data.status}\n`);
    
    // 2. Ollama Status
    console.log('2️⃣  Ollama Status確認...');
    const ollamaRes = await axios.get(`${PROXY_URL}/ollama-status`);
    console.log(`   ✅ Status: ${ollamaRes.data.status}`);
    if (ollamaRes.data.models) {
      console.log(`   📦 Models: ${ollamaRes.data.models.length} 個\n`);
    } else {
      console.log();
    }
    
    // 3. Message Compression Test
    console.log('3️⃣  メッセージ圧縮テスト...');
    const testMessages = Array(20).fill(null).map((_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Test message ${i}: ${'x'.repeat(100)}`,
    }));
    
    const compressRes = await axios.post(`${PROXY_URL}/debug/compress-messages`, {
      messages: testMessages,
    });
    
    console.log(`   📊 圧縮前: ${compressRes.data.original_count} メッセージ (${compressRes.data.original_size} bytes)`);
    console.log(`   ✅ 圧縮後: ${compressRes.data.compressed_count} メッセージ (${compressRes.data.compressed_size} bytes)`);
    console.log(`   📉 削減率: ${((1 - compressRes.data.compressed_size / compressRes.data.original_size) * 100).toFixed(1)}%\n`);
    
    // 4. Prompt Conversion Test
    console.log('4️⃣  プロンプト変換テスト...');
    const testPromptRes = await axios.post(`${PROXY_URL}/debug/convert-prompt`, {
      messages: [
        { role: 'user', content: 'Write a simple Python function to add two numbers' },
      ],
    });
    
    console.log(`   📝 変換済みプロンプト長: ${testPromptRes.data.length} 文字`);
    console.log(`   ✅ 変換成功\n`);
    
    // 5. Full Claude API Simulation (Streaming)
    console.log('5️⃣  Claude API シミュレーション（ストリーミング）...');
    const testMessages2 = [
      { role: 'user', content: 'What is 2 + 2?' },
    ];
    
    const response = await axios.post(
      `${PROXY_URL}/v1/messages`,
      {
        messages: testMessages2,
        max_tokens: 100,
      },
      {
        timeout: 120000,
        responseType: 'stream',
      }
    );
    
    let fullText = '';
    await new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(l => l.startsWith('data: '));
        lines.forEach(line => {
          try {
            const json = JSON.parse(line.replace('data: ', ''));
            if (json.delta?.text) {
              fullText += json.delta.text;
              process.stdout.write(json.delta.text);
            }
          } catch (e) {}
        });
      });
      
      response.data.on('end', resolve);
      response.data.on('error', reject);
    });
    
    console.log(`\n\n   ✅ レスポンス: ${fullText.length} 文字生成\n`);
    
    console.log('🎉 すべてのテスト完了しました！\n');
    
  } catch (error) {
    console.error(`\n❌ テスト失敗: ${error.message}\n`);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 プロキシが起動していません。以下コマンドで起動してください:\n');
      console.log('   npm start\n');
    }
    process.exit(1);
  }
}

runTests();
