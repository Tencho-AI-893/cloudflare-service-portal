# Claude-DeepSeek Bridge セットアップスクリプト (Windows PowerShell)
# このスクリプトは Ollama、プロキシサーバー、VS Code 設定を自動セットアップします

param(
    [switch]$SkipOllama,
    [switch]$SkipProxy
)

$ErrorActionPreference = "Stop"

# ================ ユーティリティ関数 ================

function Write-Header {
    param([string]$Text)
    Write-Host "`n" -NoNewline
    Write-Host "=" * 60 -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Invoke-Command-Safe {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "  📝 $Description..." -NoNewline
    try {
        Invoke-Expression $Command | Out-Null
        Write-Host " ✅" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "     エラー: $_"
        return $false
    }
}

# ================ Ollama セットアップ ================

function Setup-Ollama {
    Write-Header "🤖 OLLAMA セットアップ"
    
    if ($SkipOllama) {
        Write-Warning "Ollama セットアップをスキップします"
        return
    }
    
    # Ollama インストール確認
    Write-Host "`n1. Ollama インストール確認..." -ForegroundColor Cyan
    $ollamaPath = "C:\Program Files\Ollama"
    
    if (-not (Test-Path "$ollamaPath\ollama.exe")) {
        Write-Warning "Ollama がインストールされていません"
        Write-Host "  💾 以下から Ollama をダウンロードしてください:"
        Write-Host "     https://ollama.ai/download/windows"
        Write-Host "`n  インストール後、このスクリプトを再実行してください"
        
        $response = Read-Host "`n  今すぐ Ollama をダウンロードページに開きますか？ (y/n)"
        if ($response -eq 'y') {
            Start-Process "https://ollama.ai/download/windows"
        }
        
        exit 1
    }
    
    Write-Success "Ollama インストール確認済み"
    
    # Ollama デーモン起動確認
    Write-Host "`n2. Ollama デーモン起動確認..." -ForegroundColor Cyan
    $ollamaRunning = Get-Process ollama -ErrorAction SilentlyContinue
    
    if ($ollamaRunning) {
        Write-Success "Ollama デーモン実行中"
    }
    else {
        Write-Warning "Ollama デーモン未起動"
        Write-Host "  📝 起動中..." -NoNewline
        
        try {
            Start-Process "$ollamaPath\OllamaServe.exe" -WindowStyle Minimized
            Start-Sleep -Seconds 3
            Write-Host " ✅" -ForegroundColor Green
        }
        catch {
            Write-Host " ⚠️ (手動起動の可能性)" -ForegroundColor Yellow
            Write-Host "  💡 以下を実行してください:"
            Write-Host "     $ollamaPath\OllamaServe.exe"
        }
    }
    
    # DeepSeek モデルプル
    Write-Host "`n3. DeepSeek-Coder-V2 モデル確認..." -ForegroundColor Cyan
    
    $modelCheck = & "$ollamaPath\ollama.exe" list 2>&1 | Select-String "deepseek-coder-v2"
    
    if ($modelCheck) {
        Write-Success "DeepSeek-Coder-V2 インストール済み"
    }
    else {
        Write-Warning "DeepSeek-Coder-V2 未インストール"
        Write-Host "  📥 ダウンロード中（初回: ~10GB）..." -ForegroundColor Yellow
        Write-Host "     このプロセスは数分かかります。別のターミナルを推奨します。`n"
        
        $response = Read-Host "  今すぐダウンロードしますか？ (y/n)"
        
        if ($response -eq 'y') {
            & "$ollamaPath\ollama.exe" pull deepseek-coder-v2:16b
            Write-Success "モデルダウンロード完了"
        }
        else {
            Write-Host "`n  💡 以下のコマンドで後ほどダウンロードしてください:"
            Write-Host "     ollama pull deepseek-coder-v2:16b"
        }
    }
}

# ================ プロキシセットアップ ================

function Setup-Proxy {
    Write-Header "🔄 プロキシサーバー セットアップ"
    
    if ($SkipProxy) {
        Write-Warning "プロキシ セットアップをスキップします"
        return
    }
    
    $bridgeDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    
    # Node.js 確認
    Write-Host "`n1. Node.js 確認..." -ForegroundColor Cyan
    
    $nodeVersion = & node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Node.js インストール済み: $nodeVersion"
    }
    else {
        Write-Error-Custom "Node.js がインストールされていません"
        Write-Host "  💾 以下から Node.js v18+ をダウンロードしてください:"
        Write-Host "     https://nodejs.org"
        exit 1
    }
    
    # npm 依存関係インストール
    Write-Host "`n2. npm 依存関係インストール..." -ForegroundColor Cyan
    
    if (-not (Test-Path "$bridgeDir\node_modules")) {
        Write-Host "  📝 パッケージをインストール中..." -NoNewline
        Set-Location $bridgeDir
        npm install --silent
        Write-Host " ✅" -ForegroundColor Green
        Write-Success "npm パッケージインストール完了"
    }
    else {
        Write-Success "npm パッケージ既にインストール済み"
    }
    
    # .env ファイル確認
    Write-Host "`n3. 環境変数ファイル確認..." -ForegroundColor Cyan
    
    if (-not (Test-Path "$bridgeDir\.env")) {
        Write-Warning ".env ファイル未作成"
        Write-Host "  📝 作成中..." -NoNewline
        Copy-Item "$bridgeDir\.env.example" "$bridgeDir\.env"
        Write-Host " ✅" -ForegroundColor Green
        Write-Success ".env ファイル作成完了"
    }
    else {
        Write-Success ".env ファイル確認済み"
    }
}

# ================ VS Code 設定 ================

function Setup-VSCode {
    Write-Header "🔧 VS Code 設定"
    
    Write-Host "`n Claude Code 拡張を以下のように設定してください:`n" -ForegroundColor Cyan
    
    Write-Host "1. VS Code を開く" -ForegroundColor Yellow
    Write-Host "2. Ctrl+, (カンマ) で設定を開く" -ForegroundColor Yellow
    Write-Host "3. 以下の JSON を設定に追加:" -ForegroundColor Yellow
    
    Write-Host "`n{`n  ""copilot.advanced.debug.overrideApiUrl"": ""http://localhost:3000"",`n  ""copilot.advanced.debug.overrideApiKey"": ""unused""`n}`n" -ForegroundColor Green
    
    Write-Host "または、.vscode/settings.json に直接以下を追記:" -ForegroundColor Yellow
    Write-Host "`n  ""copilot.advanced.debug.overrideApiUrl"": ""http://localhost:3000""`n" -ForegroundColor Green
}

# ================ テスト実行 ================

function Run-Tests {
    Write-Header "🧪 接続テスト"
    
    Write-Host "`n以下のコマンドで接続確認できます:`n" -ForegroundColor Cyan
    
    Write-Host "1. Ollama 接続確認:" -ForegroundColor Yellow
    Write-Host "   npm run check-ollama`n" -ForegroundColor Green
    
    Write-Host "2. プロキシ機能テスト:" -ForegroundColor Yellow
    Write-Host "   npm run test`n" -ForegroundColor Green
}

# ================ 起動手順 ================

function Print-Startup {
    Write-Header "🚀 起動手順"
    
    Write-Host "`n推奨: 3つのターミナルを開いて順番に実行してください`n" -ForegroundColor Yellow
    
    Write-Host "【ターミナル 1】Ollama デーモン起動:" -ForegroundColor Cyan
    Write-Host "  ollama serve`n" -ForegroundColor Green
    
    Write-Host "【ターミナル 2】プロキシサーバー起動:" -ForegroundColor Cyan
    Write-Host "  cd $((Split-Path -Parent $MyInvocation.MyCommand.Path))" -ForegroundColor Green
    Write-Host "  npm start`n" -ForegroundColor Green
    
    Write-Host "【ターミナル 3】VS Code 起動:" -ForegroundColor Cyan
    Write-Host "  code .`n" -ForegroundColor Green
    
    Write-Host "これで Claude Code は自動的に DeepSeek 経由で動作します！✨" -ForegroundColor Cyan
}

# ================ メイン処理 ================

Clear-Host
Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     Claude-DeepSeek Bridge セットアップ (Windows)          ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta

Setup-Ollama
Setup-Proxy
Setup-VSCode
Run-Tests
Print-Startup

Write-Header "✅ セットアップ完了"
Write-Host "`n問題が発生した場合は以下を確認してください:" -ForegroundColor Yellow
Write-Host "  📖 README.md をご覧ください" -ForegroundColor Green
Write-Host "  🔗 https://github.com/yourusername/claude-deepseek-bridge`n" -ForegroundColor Green
