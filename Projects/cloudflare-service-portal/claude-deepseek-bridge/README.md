# 🚀 Claude-DeepSeek Bridge

**Claude Code × DeepSeek-Coder-V2 ハイブリッドプロキシシステム**

Claude Code の高度な計画力・ツール操作力を活かしながら、実際のコード生成・編集を **DeepSeek-Coder-V2（ローカル推論）** で行う完全オフライン・完全無料のシステムです。

---

## ✨ 特徴

✅ **完全オフライン**  
- すべてをローカルで処理  
- 機密コードを外部 API に送信しない  
- インターネット接続不要

✅ **完全無料**  
- API キー不要  
- Ollama（OSS）+ DeepSeek モデル（MIT ライセンス）で運用  
- ランニングコストゼロ

✅ **Claude Code 完全互換**  
- チャット・コード補完・ファイル操作・ターミナル実行がそのまま動作  
- Claude Code の設定変更だけで利用可能  
- 学習曲線ゼロ

✅ **高性能**  
- DeepSeek-Coder-V2 16B は高速コード生成に最適化  
- GPU サポートで推論時間を短縮  
- ストリーミング応答で UX を向上

---

## 📋 必要環境

### ハードウェア
| 項目 | 推奨スペック | 最小スペック |
|------|-----------|-----------|
| **CPU** | Intel i7/AMD Ryzen 5 以上 | Intel i5/AMD Ryzen 3 |
| **メモリ** | 32GB | 16GB |
| **GPU** | NVIDIA RTX 3070 以上 | なし（CPU 推論） |
| **ストレージ** | 20GB（モデル用） | 15GB |

### ソフトウェア
- **Windows 10/11** または **macOS/Linux**
- **Node.js 18+**
- **Ollama 最新版**

---

## 🛠️ セットアップ（Windows）

### 1️⃣ 自動セットアップ（推奨）

PowerShell を**管理者として**実行:

```powershell
cd c:\Users\tetsu\Projects\cloudflare-service-portal\claude-deepseek-bridge
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\setup.ps1
```

このスクリプトが自動的に以下を行います:
- ✅ Ollama インストール確認
- ✅ DeepSeek-Coder-V2 モデルプル
- ✅ npm 依存関係インストール
- ✅ .env ファイル設定
- ✅ VS Code 設定ガイド

### 2️⃣ 手動セットアップ

#### Step 1: Ollama インストール

```powershell
# 1. 以下からダウンロード
# https://ollama.ai/download/windows

# 2. インストール実行
# ウィザードに従ってインストール

# 3. Ollama デーモン起動
ollama serve

# 別ターミナルで確認
ollama list
```

#### Step 2: DeepSeek モデル導入

```powershell
# (Ollama デーモン実行中の別ターミナル)
ollama pull deepseek-coder-v2:16b

# 確認（10GB ダウンロード、数分かかります）
ollama list
```

#### Step 3: プロキシセットアップ

```powershell
cd claude-deepseek-bridge

# Node.js 依存関係インストール
npm install

# .env ファイルを作成
copy .env.example .env

# 確認: Ollama が起動しているか
npm run check-ollama

# プロキシサーバー起動
npm start
```

#### Step 4: VS Code 設定

VS Code の `settings.json` を開き、以下を追加:

```json
{
  "copilot.advanced.debug.overrideApiUrl": "http://localhost:3000",
  "copilot.advanced.debug.overrideApiKey": "unused"
}
```

または、設定 UI から:
1. `Ctrl+,` → 設定を開く
2. "copilot" で検索
3. `Advanced: Override Api Url` に `http://localhost:3000` を入力

---

## 🚀 起動手順

### 推奨: 3つのターミナルで実行

**ターミナル 1 - Ollama デーモン:**
```powershell
ollama serve
```

**ターミナル 2 - プロキシサーバー:**
```powershell
cd c:\Users\tetsu\Projects\cloudflare-service-portal\claude-deepseek-bridge
npm start
```

**ターミナル 3 - VS Code:**
```powershell
code .
```

> 💡 **初回実行時**は Ollama 推論が遅い場合があります（GPU キャッシング）。気長にお待ちください。

---

## 📊 動作確認

### Ollama 接続確認
```powershell
npm run check-ollama
```

出力例:
```
✅ 接続成功
📦 利用可能モデル: 1 個
• deepseek-coder-v2:16b ✨ (現在使用中)
✅ モデル確認済み
✅ 推論成功
```

### プロキシ機能テスト
```powershell
npm run test
```

出力例:
```
1️⃣  Health Check...
   ✅ Status: healthy
2️⃣  Ollama Status確認...
   ✅ Status: connected
...
🎉 すべてのテスト完了しました！
```

---

## 💻 使用例

### 例 1: コード補完

Claude Code チャットに:
```
Write a Python function to fetch data from an API
```

**動作フロー:**
1. Claude Code がプロキシに `/v1/messages` リクエスト送信
2. プロキシが Ollama に変換後のプロンプト送信
3. DeepSeek-Coder-V2 が推論実行
4. プロキシが Claude 互換形式に整形して返却
5. VS Code に結果表示

**レスポンス例:**
```python
import requests

def fetch_data(url: str) -> dict:
    """Fetch data from the given URL."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return {}
```

### 例 2: ファイル編集

Claude Code で:
```
Refactor the login.py file to use async/await
```

**動作:**
- Claude Code が `login.py` を読込
- プロキシ経由で DeepSeek がリファクタリング実装
- 提案を VS Code に表示
- ワンクリックで適用

---

## 🔧 設定（.env）

| 変数 | デフォルト | 説明 |
|-----|---------|------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama サーバーアドレス |
| `OLLAMA_MODEL` | `deepseek-coder-v2:16b` | 使用するモデル |
| `PROXY_PORT` | `3000` | プロキシサーバーポート |
| `CONTEXT_WINDOW_LIMIT` | `12000` | トークン制限 |
| `MAX_HISTORY_MESSAGES` | `15` | 保持メッセージ履歴数 |
| `TEMPERATURE` | `0.3` | 推論温度（低いほど確定的） |
| `MAX_TOKENS` | `2000` | 最大生成トークン |

---

## ⚡ パフォーマンス最適化

### GPU 利用（推奨）

```powershell
# NVIDIA CUDA サポート確認
nvidia-smi

# 環境変数設定（.env）
OLLAMA_NUM_GPU=1
```

### CPU オンリー（低スペック対応）

```powershell
# Ollama は自動的に CPU フォールバック
# ただし推論時間が 5-10 倍になります
```

### モデルサイズ変更

```powershell
# より小さいモデル（高速）
ollama pull deepseek-coder:7b

# より大きいモデル（高精度、要 GPU 24GB+）
ollama pull deepseek-coder-v2:34b
```

---

## 🐛 トラブルシューティング

### Q: "接続エラー: Ollama デーモンが起動していません"

**A:** Ollama デーモンを起動してください:
```powershell
ollama serve
```

### Q: "モデル未インストール" エラー

**A:** モデルをプル:
```powershell
ollama pull deepseek-coder-v2:16b
```

### Q: VS Code から反応がない

**A:** 
1. プロキシが起動しているか確認: `http://localhost:3000/health`
2. logs フォルダで詳細ログ確認
3. Ollama が推論中の可能性（初回は遅い）

### Q: 推論が非常に遅い

**A:** 
- GPU を利用しているか確認: `nvidia-smi`
- CPU 推論の場合、より小さいモデルに切り替え

---

## 📁 プロジェクト構造

```
claude-deepseek-bridge/
├── proxy-server.js          # メイン プロキシサーバー
├── check-ollama.js          # Ollama 接続確認ツール
├── test-proxy.js            # 統合テストスクリプト
├── setup.ps1                # Windows セットアップスクリプト
├── package.json             # Node.js 依存関係
├── .env.example             # 環境変数テンプレート
├── .env                     # 環境変数（.gitignore で除外）
├── logs/                    # ログディレクトリ
├── README.md                # このファイル
└── node_modules/            # npm パッケージ（.gitignore で除外）
```

---

## 🔐 セキュリティ

✅ **ローカル推論**  
- 機密コード・データは外部に送信されない
- キーロギング対象外

✅ **API キーなし**  
- 認証情報が不要
- 盗難リスク なし

✅ **ネットワーク隔離**  
- デフォルトで localhost のみバインド
- インターネットアクセス不可

---

## 📈 スケーリング

### チーム運用

```
# Ollama を共有 Linux サーバーで実行
# 複数開発マシンから同一 Ollama に接続

# .env を編集:
OLLAMA_BASE_URL=http://team-server:11434
```

### より大規模なコンテキスト

```powershell
# 34B モデルに切り替え（要 VRAM 24GB+）
ollama pull deepseek-coder-v2:34b

# .env:
OLLAMA_MODEL=deepseek-coder-v2:34b
CONTEXT_WINDOW_LIMIT=32000
```

---

## 📚 関連リンク

- 📖 [Ollama 公式ドキュメント](https://github.com/ollama/ollama)
- 🤖 [DeepSeek-Coder GitHub](https://github.com/deepseek-ai/DeepSeek-Coder)
- 🔗 [Claude Code 公式](https://docs.anthropic.com/)

---

## 📝 ライセンス

MIT License

---

## 🤝 サポート

問題が発生した場合:

1. 📖 README.md の「トラブルシューティング」を確認
2. 📊 ログを確認: `logs/proxy-*.log`
3. 🧪 テストを実行: `npm run test`

---

**Happy Coding! 🎉**

このシステムで AI アシスタントの力を思いっきり活用してください。

*Claude × DeepSeek ハイブリッドの力で、あなたのコード品質を次のレベルへ。*
