import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

interface PRMetrics {
  totalPRs: number;
  averageLeadTime: number;
  averageChangedFiles: number;
  averageChangedLines: number;
  requestChangesCount: number;
  authorStats: Record<
    string,
    {
      prCount: number;
      avgLeadTime: number;
      avgChangedFiles: number;
    }
  >;
}

export const Analysis: React.FC = () => {
  const [metrics, setMetrics] = useState<PRMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const analyzePRs = async () => {
      try {
        const selectedRepos = await window.electron.store.get("analysis.repos");
        const dateRange = await window.electron.store.get("analysis.dateRange");
        const token = await window.electron.store.get("token");

        if (!selectedRepos || !dateRange || !token) {
          setError("Missing required analysis parameters");
          setLoading(false);
          return;
        }

        const analysis = await window.electron.github.analyzePRs({
          repos: selectedRepos,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          token,
        });
        setMetrics(analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to analyze PRs");
      } finally {
        setLoading(false);
      }
    };

    analyzePRs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Analyzing Pull Requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/repos")}>
          Back to Repository Selection
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="error-container">
        <p>No analysis data available</p>
        <button onClick={() => navigate("/repos")}>
          Back to Repository Selection
        </button>
      </div>
    );
  }

  const authorChartData = Object.entries(metrics.authorStats)
    .map(([author, stats]) => ({
      author,
      PRs: stats.prCount,
      "Avg Lead Time (days)": Math.round(stats.avgLeadTime / (24 * 60 * 60)),
      "Avg Changed Files": Math.round(stats.avgChangedFiles),
    }))
    .sort((a, b) => b.PRs - a.PRs);

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>Pull Request Analysis Results</h2>
        <button className="back-button" onClick={() => navigate("/repos")}>
          Change Selection
        </button>
      </div>

      <div className="summary-metrics">
        <div className="metric-card">
          <h3>Total PRs</h3>
          <p>{metrics.totalPRs}</p>
        </div>
        <div className="metric-card">
          <h3>Average Lead Time</h3>
          <p>{Math.round(metrics.averageLeadTime / (24 * 60 * 60))} days</p>
        </div>
        <div className="metric-card">
          <h3>Average Changed Files</h3>
          <p>{Math.round(metrics.averageChangedFiles)}</p>
        </div>
        <div className="metric-card">
          <h3>Changes Requested</h3>
          <p>{metrics.requestChangesCount}</p>
        </div>
      </div>

      <div className="author-stats">
        <h3>Statistics by Author</h3>
        <BarChart width={800} height={400} data={authorChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="author" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="PRs" fill="#8884d8" />
          <Bar dataKey="Avg Lead Time (days)" fill="#82ca9d" />
          <Bar dataKey="Avg Changed Files" fill="#ffc658" />
        </BarChart>
      </div>
    </div>
  );
};
