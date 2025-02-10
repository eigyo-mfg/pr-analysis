# GitHub PR 分析ツール

*他の言語で読む: [English](README.md)*

GitHubの組織内の複数リポジトリにまたがるプルリクエストを分析するための、Electronベースのデスクトップアプリケーションです。

## 主な機能

- 組織全体のリポジトリ管理
  - GitHubの組織内のリポジトリを閲覧・選択
  - リポジトリ名や説明による絞り込み
- 包括的なPR分析機能
  - PRの総数とマージ済みPRの数
  - 平均PR所要時間（作成からマージまで）
  - 変更ファイル数と修正行数の平均
  - レビューでの「要変更」指摘の数
  - 作成者ごとの詳細な統計
  - 各PRの詳細情報：
    - PRのタイトルと番号
    - 作成日とマージ日
    - 作成者情報
    - リポジトリのコンテキスト
    - PRへの直接リンク

## 動作要件

- Node.js 16以上
- npm 7以上
- GitHub Personal Access Token（`repo`スコープ必須）

## インストール方法

1. リポジトリのクローン
```bash
git clone [repository-url]
cd github-pr-analysis
```

2. 依存パッケージのインストール
```bash
npm install
```

## 開発方法

開発モードでアプリケーションを起動：
```bash
npm run dev
```

## ビルド方法

プロダクション用にアプリケーションをビルド：
```bash
npm run build
```

ビルドされたアプリケーションは`release`ディレクトリに出力されます。

## 設定

アプリケーションを使用する前に、以下の項目を設定する必要があります：

1. GitHubの組織名
2. GitHub Personal Access Token
3. 分析対象のリポジトリ選択
4. 分析期間の設定

これらの設定は electron-store を使用してセッション間で保持されます。

## 使用技術

- Electron - クロスプラットフォームデスクトップアプリケーションフレームワーク
- React - UIコンポーネントライブラリ
- TypeScript - 型安全な JavaScript スーパーセット
- Vite - 最新のフロントエンドビルドツール
- Octokit - GitHub API クライアント
- Recharts - データ可視化ライブラリ
- Electron Store - 設定の永続化

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。