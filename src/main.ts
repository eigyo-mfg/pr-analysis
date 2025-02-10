import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import ElectronStore from "electron-store";
import "./services/github"; // 相対パスに変更

// Electron path handling
function getElectronPath() {
  const pathFile = join(__dirname, "path.txt");
  let executablePath;

  if (existsSync(pathFile)) {
    executablePath = readFileSync(pathFile, "utf-8");
  }

  if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
    return join(
      process.env.ELECTRON_OVERRIDE_DIST_PATH,
      executablePath || "electron"
    );
  }

  if (executablePath) {
    return join(__dirname, "dist", executablePath);
  }

  return null;
}

// Initialize store with types
const store = new ElectronStore<{
  orgName: string;
  token: string;
  analysis: {
    repos: string[];
    dateRange: {
      startDate: string;
      endDate: string;
    };
  };
}>();

// Ensure required store properties exist
if (!store.has("orgName")) {
  store.set("orgName", "");
}

// Handle IPC events for electron-store
ipcMain.handle("electron-store-get", (_event, key) => {
  return store.get(key);
});

ipcMain.handle("electron-store-set", (_event, key, val) => {
  store.set(key, val);
  return true;
});

// Add IPC handler for Electron path
ipcMain.handle("get-electron-path", () => {
  return getElectronPath();
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      preload: join(
        __dirname,
        process.env.NODE_ENV === "development"
          ? "../dist-electron/preload.js"
          : "preload.js"
      ),
    },
  });

  // In development mode, load from the dev server
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // In production mode, load the built files
    const path = join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(path).catch((err) => {
      console.error("Failed to load:", path, err);
      // フォールバックとして直接パスを試す
      const fallbackPath = join(__dirname, "..", "index.html");
      mainWindow.loadFile(fallbackPath).catch((err) => {
        console.error("Fallback also failed:", fallbackPath, err);
      });
    });
  }
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
