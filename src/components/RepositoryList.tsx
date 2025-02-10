import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Repository {
  name: string;
  description: string;
}

export const RepositoryList: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      const orgName = await window.electron.store.get("orgName");
      const token = await window.electron.store.get("token");
      try {
        const repos = await window.electron.github.getRepositories(
          orgName,
          token
        );
        setRepositories(repos);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };
    fetchRepos();
  }, []);

  const handleAnalyze = async () => {
    if (selectedRepos.length === 0) {
      alert("Please select at least one repository");
      return;
    }
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select date range");
      return;
    }

    await window.electron.store.set("analysis.repos", selectedRepos);
    await window.electron.store.set("analysis.dateRange", dateRange);
    navigate("/analysis");
  };

  return (
    <div className="repository-list">
      <h2>Select Repositories to Analyze</h2>
      <div className="date-range">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, startDate: e.target.value })
          }
        />
        <span>to</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, endDate: e.target.value })
          }
        />
      </div>
      <div className="repos-grid">
        {repositories.map((repo) => (
          <div
            key={repo.name}
            className={`repo-item ${
              selectedRepos.includes(repo.name) ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedRepos((prev) =>
                prev.includes(repo.name)
                  ? prev.filter((r) => r !== repo.name)
                  : [...prev, repo.name]
              );
            }}
          >
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
          </div>
        ))}
      </div>
      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={
          selectedRepos.length === 0 ||
          !dateRange.startDate ||
          !dateRange.endDate
        }
      >
        Analyze Selected Repositories
      </button>
    </div>
  );
};
