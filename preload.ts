import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld(
  "ipcRenderer", // apiキー
  {
    invoke: (channel: string, ...args: any[]): Promise<any> => {
      return ipcRenderer.invoke(channel, ...args);
    },
    send: (channel: string, ...args: any[]) => {
      ipcRenderer.send(channel, ...args);
    },

    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on(channel, listener);
    },

    removeListener: (channel: string, listener: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, listener);
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
  }
);