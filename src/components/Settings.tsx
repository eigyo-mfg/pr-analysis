import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SettingsData {
  orgName: string;
  token: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    orgName: "",
    token: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadSettings = async () => {
      const orgName = (await window.electron.store.get("orgName")) || "";
      const token = (await window.electron.store.get("token")) || "";
      setSettings({ orgName, token });
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electron.store.set("orgName", settings.orgName);
    await window.electron.store.set("token", settings.token);
    navigate("/repos");
  };

  return (
    <div className="settings-container">
      <h2>GitHub PR Analysis Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Organization Name</label>
          <input
            type="text"
            value={settings.orgName}
            onChange={(e) =>
              setSettings({ ...settings, orgName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>GitHub Personal Access Token</label>
          <input
            type="password"
            value={settings.token}
            onChange={(e) =>
              setSettings({ ...settings, token: e.target.value })
            }
            required
          />
        </div>
        <button type="submit">Save and Continue</button>
      </form>
    </div>
  );
};
