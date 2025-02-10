# GitHub PR Analysis Tool

*Read this in other languages: [日本語](README.ja.md)*

An Electron-based desktop application for analyzing Pull Requests across multiple repositories in a GitHub organization.

## Features

- Organization-wide repository management
  - Browse and select repositories from your GitHub organization
  - Filter repositories by name and description
- Comprehensive PR Analysis
  - Total number of PRs and merged PRs
  - Average PR lead time (time from creation to merge)
  - Average number of files changed and lines modified
  - Number of "Request Changes" reviews
  - Detailed PR author statistics
  - Individual PR details including:
    - PR title and number
    - Creation and merge dates
    - Author information
    - Repository context
    - Direct link to PR

## Requirements

- Node.js 16 or higher
- npm 7 or higher
- GitHub Personal Access Token with `repo` scope

## Installation

1. Clone this repository
```bash
git clone [repository-url]
cd github-pr-analysis
```

2. Install dependencies
```bash
npm install
```

## Development

Start the app in development mode:
```bash
npm run dev
```

## Building

Build the application for production:
```bash
npm run build
```

The built application will be available in the `release` directory.

## Configuration

Before using the application, you'll need to configure:

1. GitHub Organization name
2. GitHub Personal Access Token
3. Repository selection
4. Analysis date range

These settings are persisted between sessions using electron-store.

## Technologies

- Electron
- React
- TypeScript
- Vite
- Octokit (GitHub API)
- Recharts for data visualization
- Electron Store for configuration persistence
