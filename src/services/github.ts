import { Octokit } from "@octokit/rest";
import { ipcMain } from "electron";
import ElectronStore from "electron-store";

const store = new ElectronStore();

interface PRAnalysisParams {
  repos: string[];
  startDate: string;
  endDate: string;
  token: string;
}

interface PRDetails {
  number: number;
  title: string;
  createdAt: string;
  mergedAt: string | null;
  author: string;
  url: string;
  repository: string;
  leadTime: number;
}

class GitHubService {
  private octokit: Octokit | null = null;

  private getClient(token: string) {
    if (!this.octokit) {
      this.octokit = new Octokit({ auth: token });
    }
    return this.octokit;
  }

  async getRepositories(orgName: string, token: string) {
    const octokit = this.getClient(token);
    const { data: repos } = await octokit.repos.listForOrg({
      org: orgName,
      per_page: 100,
      sort: "updated",
    });

    return repos.map((repo) => ({
      name: repo.name,
      description: repo.description,
    }));
  }

  async analyzePRs({
    repos,
    startDate,
    endDate,
    token,
    orgName,
  }: PRAnalysisParams & { orgName: string }) {
    const octokit = this.getClient(token);
    const stats = {
      totalPRs: 0,
      averageLeadTime: 0,
      averageChangedFiles: 0,
      averageChangedLines: 0,
      requestChangesCount: 0,
      pullRequests: [] as PRDetails[],
      authorStats: {} as Record<
        string,
        { prCount: number; avgLeadTime: number; avgChangedFiles: number }
      >,
    };

    for (const repo of repos) {
      const { data: prs } = await octokit.pulls.list({
        owner: orgName,
        repo,
        state: "all",
        sort: "updated",
        direction: "desc",
        per_page: 100,
      });

      const filteredPRs = prs.filter((pr) => {
        const createdAt = new Date(pr.created_at);
        return (
          createdAt >= new Date(startDate) && createdAt <= new Date(endDate)
        );
      });

      for (const pr of filteredPRs) {
        stats.totalPRs++;
        let leadTimeDays = 0;

        if (pr.merged_at) {
          const leadTimeMs =
            new Date(pr.merged_at).getTime() -
            new Date(pr.created_at).getTime();
          leadTimeDays = leadTimeMs / (1000 * 60 * 60 * 24);
          stats.averageLeadTime += leadTimeDays;
        }

        // Add PR details
        stats.pullRequests.push({
          number: pr.number,
          title: pr.title,
          createdAt: pr.created_at,
          mergedAt: pr.merged_at,
          author: pr.user?.login || "unknown",
          url: pr.html_url,
          repository: repo,
          leadTime: leadTimeDays,
        });

        // Changed files and lines
        const { data: files } = await octokit.pulls.listFiles({
          owner: orgName,
          repo,
          pull_number: pr.number,
        });

        stats.averageChangedFiles += files.length;
        stats.averageChangedLines += files.reduce(
          (acc, file) => acc + file.additions + file.deletions,
          0
        );

        // Review statistics
        const { data: reviews } = await octokit.pulls.listReviews({
          owner: orgName,
          repo,
          pull_number: pr.number,
        });

        stats.requestChangesCount += reviews.filter(
          (r) => r.state === "CHANGES_REQUESTED"
        ).length;

        // Author statistics
        const author = pr.user?.login || "unknown";
        if (!stats.authorStats[author]) {
          stats.authorStats[author] = {
            prCount: 0,
            avgLeadTime: 0,
            avgChangedFiles: 0,
          };
        }
        stats.authorStats[author].prCount++;
        if (pr.merged_at) {
          const leadTimeMs =
            new Date(pr.merged_at).getTime() -
            new Date(pr.created_at).getTime();
          const leadTimeDays = leadTimeMs / (1000 * 60 * 60 * 24); // Convert milliseconds to days
          stats.authorStats[author].avgLeadTime += leadTimeDays;
        }
        stats.authorStats[author].avgChangedFiles += files.length;
      }
    }

    // Sort PRs by creation date
    stats.pullRequests.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate averages
    if (stats.totalPRs > 0) {
      stats.averageLeadTime /= stats.totalPRs;
      stats.averageChangedFiles /= stats.totalPRs;
      stats.averageChangedLines /= stats.totalPRs;

      // Calculate author averages
      Object.values(stats.authorStats).forEach((authorStat) => {
        if (authorStat.prCount > 0) {
          authorStat.avgLeadTime /= authorStat.prCount;
          authorStat.avgChangedFiles /= authorStat.prCount;
        }
      });
    }

    return stats;
  }
}

const githubService = new GitHubService();

// IPC handlers
ipcMain.handle(
  "get-repositories",
  async (_event, orgName: string, token: string) => {
    return await githubService.getRepositories(orgName, token);
  }
);

ipcMain.handle("analyze-prs", async (_event, params: PRAnalysisParams) => {
  const orgName = store.get("orgName") as string;
  return await githubService.analyzePRs({ ...params, orgName });
});
