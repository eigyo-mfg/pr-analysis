import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  store: {
    get: (key: string) => ipcRenderer.invoke("electron-store-get", key),
    set: (key: string, val: any) =>
      ipcRenderer.invoke("electron-store-set", key, val),
  },
  github: {
    getRepositories: (orgName: string, token: string) =>
      ipcRenderer.invoke("get-repositories", orgName, token),
    analyzePRs: (params: any) => ipcRenderer.invoke("analyze-prs", params),
  },
  app: {
    getElectronPath: () => ipcRenderer.invoke("get-electron-path"),
  },
});
