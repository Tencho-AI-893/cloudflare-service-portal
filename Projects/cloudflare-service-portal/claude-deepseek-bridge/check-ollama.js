const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'deepseek-coder-v2:16b';

async function checkOllama() {
  console.log('🔍 Ollama 接続確認中...\n');
  
  try {
    // 1. Ollama サーバー応答確認
    console.log(`1️⃣  サーバー確認: ${OLLAMA_URL}`);
    const tagsResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    console.log(`   ✅ 接続成功`);
    console.log(`   📦 利用可能モデル: ${tagsResponse.data.models?.length || 0} 個\n`);
    
    if (tagsResponse.data.models && tagsResponse.data.models.length > 0) {
      tagsResponse.data.models.forEach(m => {
        const isCurrent = m.name === MODEL;
        console.log(`   • ${m.name}${isCurrent ? ' ✨ (現在使用中)' : ''}`);
      });
      console.log();
    }
    
    // 2. 指定モデルの確認
    console.log(`2️⃣  モデル確認: ${MODEL}`);
    const modelFound = tagsResponse.data.models?.some(m => m.name === MODEL);
    
    if (!modelFound) {
      console.log(`   ❌ モデル未インストール`);
      console.log(`   💡 以下のコマンドで導入してください:\n`);
      console.log(`   ollama pull ${MODEL}\n`);
      process.exit(1);
    }
    
    console.log(`   ✅ モデル確認済み\n`);
    
    // 3. テスト推論
    console.log(`3️⃣  テスト推論実行中...`);
    const testPrompt = 'def hello():\n    print("Hello World")\n\nExplain this code in one line:';
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: MODEL,
        prompt: testPrompt,
        stream: false,
        temperature: 0.3,
      },
      { timeout: 120000 }
    );
    
    console.log(`   ✅ 推論成功\n`);
    console.log(`   📝 レスポンス: "${response.data.response.substring(0, 100)}..."\n`);
    
    // 4. パフォーマンス測定
    console.log(`4️⃣  パフォーマンス測定\n`);
    console.log(`   ⏱️  総処理時間: ${(response.data.total_duration / 1e9).toFixed(2)} 秒`);
    console.log(`   📊 推論時間: ${(response.data.eval_duration / 1e9).toFixed(2)} 秒`);
    console.log(`   🔢 生成トークン数: ${response.data.eval_count}\n`);
    
    console.log('🎉 すべてのチェック完了 - Ollama は正常に動作しています！\n');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ❌ 接続失敗: Ollama デーモンが起動していません\n');
      console.log('   💡 以下のコマンドで Ollama を起動してください:\n');
      console.log('   ollama serve\n');
    } else if (error.message.includes('timeout')) {
      console.log('   ❌ タイムアウト: Ollama が応答しません\n');
    } else {
      console.log(`   ❌ エラー: ${error.message}\n`);
    }
    process.exit(1);
  }
}

checkOllama();
