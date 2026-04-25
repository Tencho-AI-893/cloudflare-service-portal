#!/bin/bash

# Claude-DeepSeek Bridge セットアップスクリプト (macOS/Linux)

set -e

# ================ ユーティリティ関数 ================

print_header() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "  $1"
    echo "════════════════════════════════════════════════════════════"
    echo ""
}

print_success() {
    echo "✅ $1"
}

print_warning() {
    echo "⚠️  $1"
}

print_error() {
    echo "❌ $1"
}

# ================ Ollama セットアップ ================

setup_ollama() {
    print_header "🤖 OLLAMA セットアップ"
    
    # Ollama インストール確認
    if ! command -v ollama &> /dev/null; then
        print_warning "Ollama がインストールされていません"
        echo "  📥 インストール中..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            curl -fsSL https://ollama.ai/install.sh | sh
        else
            # Linux
            curl -fsSL https://ollama.ai/install.sh | sh
        fi
        
        print_success "Ollama インストール完了"
    else
        print_success "Ollama インストール済み"
    fi
    
    # Ollama デーモン確認
    echo ""
    echo "1. Ollama デーモン起動確認..."
    
    if pgrep -x "ollama" > /dev/null; then
        print_success "Ollama デーモン実行中"
    else
        print_warning "Ollama デーモン未起動"
        echo "  💡 別のターミナルで以下を実行してください:"
        echo "     ollama serve"
        echo ""
        echo "  セットアップを続行しますか？ (y/n)"
        read -r response
        if [[ "$response" != "y" ]]; then
            exit 1
        fi
    fi
    
    # DeepSeek モデル確認
    echo ""
    echo "2. DeepSeek-Coder-V2 モデル確認..."
    
    if ollama list | grep -q "deepseek-coder-v2"; then
        print_success "DeepSeek-Coder-V2 インストール済み"
    else
        print_warning "DeepSeek-Coder-V2 未インストール"
        echo "  📥 ダウンロード中（初回: ~10GB）..."
        
        echo "  今すぐダウンロードしますか？ (y/n)"
        read -r response
        
        if [[ "$response" == "y" ]]; then
            ollama pull deepseek-coder-v2:16b
            print_success "モデルダウンロード完了"
        else
            echo "  💡 後ほど以下で手動ダウンロードしてください:"
            echo "     ollama pull deepseek-coder-v2:16b"
        fi
    fi
}

# ================ プロキシセットアップ ================

setup_proxy() {
    print_header "🔄 プロキシサーバー セットアップ"
    
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    
    # Node.js 確認
    echo "1. Node.js 確認..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js がインストールされていません"
        echo "  💾 以下から Node.js v18+ をダウンロード:"
        echo "     https://nodejs.org"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js インストール済み: $NODE_VERSION"
    
    # npm 依存関係インストール
    echo ""
    echo "2. npm 依存関係インストール..."
    
    cd "$SCRIPT_DIR"
    
    if [ ! -d "node_modules" ]; then
        npm install --silent
        print_success "npm パッケージインストール完了"
    else
        print_success "npm パッケージ既にインストール済み"
    fi
    
    # .env ファイル確認
    echo ""
    echo "3. 環境変数ファイル確認..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success ".env ファイル作成完了"
    else
        print_success ".env ファイル確認済み"
    fi
}

# ================ VS Code 設定 ================

setup_vscode() {
    print_header "🔧 VS Code 設定"
    
    echo "Claude Code 拡張を以下のように設定してください:"
    echo ""
    echo "1. VS Code を開く"
    echo "2. Cmd+, (macOS) / Ctrl+, (Linux) で設定を開く"
    echo "3. 以下の JSON を settings.json に追加:"
    echo ""
    echo '  {' 
    echo '    "copilot.advanced.debug.overrideApiUrl": "http://localhost:3000",'
    echo '    "copilot.advanced.debug.overrideApiKey": "unused"'
    echo '  }'
    echo ""
}

# ================ テスト実行 ================

run_tests() {
    print_header "🧪 接続テスト"
    
    echo "以下のコマンドで接続確認できます:"
    echo ""
    echo "1. Ollama 接続確認:"
    echo "   npm run check-ollama"
    echo ""
    echo "2. プロキシ機能テスト:"
    echo "   npm run test"
    echo ""
}

# ================ 起動手順 ================

print_startup() {
    print_header "🚀 起動手順"
    
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    
    echo "推奨: 3つのターミナルを開いて順番に実行してください"
    echo ""
    echo "【ターミナル 1】Ollama デーモン起動:"
    echo "  ollama serve"
    echo ""
    echo "【ターミナル 2】プロキシサーバー起動:"
    echo "  cd $SCRIPT_DIR"
    echo "  npm start"
    echo ""
    echo "【ターミナル 3】VS Code 起動:"
    echo "  code ."
    echo ""
    echo "これで Claude Code は自動的に DeepSeek 経由で動作します！✨"
}

# ================ メイン処理 ================

clear

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Claude-DeepSeek Bridge セットアップ (macOS/Linux)         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

setup_ollama
setup_proxy
setup_vscode
run_tests
print_startup

print_header "✅ セットアップ完了"

echo "問題が発生した場合は以下を確認してください:"
echo "  📖 README.md をご覧ください"
echo ""
