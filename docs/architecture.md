# Electron アプリケーション設計方針

## プロセス分離とセキュリティ

### レンダラープロセス（ブラウザ側）
- Node.js APIを直接使用しない
- `require`の使用を禁止
- ファイルシステム操作を直接行わない
- メインプロセスとの通信は全てcontextBridge経由のIPCを使用

### メインプロセス（Electron側）
- Node.js APIの使用を許可
- ファイルシステム操作を担当
- IPCハンドラーを通じてレンダラープロセスにサービスを提供

## 通信方式
- contextBridgeを使用したIPC通信のみを許可
- プリロードスクリプトで必要なAPIのみを公開
- レンダラープロセスはwindow.electronオブジェクト経由でAPIにアクセス

## セキュリティ設定
- nodeIntegration: false
- contextIsolation: true
- sandbox: true
- webSecurity: true

これらの方針は、Electronのセキュリティベストプラクティスに従っています。