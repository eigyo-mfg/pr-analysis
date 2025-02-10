interface Window {
  electron: {
    store: {
      get: (key: string) => Promise<any>;
      set: (key: string, val: any) => Promise<void>;
    };
    github: {
      getRepositories: (orgName: string, token: string) => Promise<any[]>;
      analyzePRs: (params: any) => Promise<any>;
    };
    app: {
      getElectronPath: () => Promise<string | null>;
    };
  };
}

declare global {
  interface Window {
    electron: Window["electron"];
  }
}
