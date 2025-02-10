# GitHub PR Analysis Tool

An Electron-based desktop application for analyzing Pull Requests across multiple repositories in a GitHub organization.

## Features

- Display list of repositories under a GitHub organization
- Select multiple repositories for analysis
- Analyze PRs within a specified time period
- Analysis metrics include:
  - Total number of PRs
  - Files changed and lines modified per PR
  - PR lead time (creation to merge)
  - Number of "Request Changes" reviews
  - Statistics by PR author

## Setup

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Create a GitHub personal access token with repo access
4. Configure the application settings
5. Start the application:
```bash
npm start
```

## Configuration

- GitHub Organization name
- GitHub Personal Access Token
- Date range for analysis
- Repository selection
- Custom metrics configuration
