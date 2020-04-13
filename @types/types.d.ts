/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        ipcRenderer: Ipc;
    }
}

export interface Ipc {
    invoke(channel: string, ...args: any[]): Promise<any>;
    send(channel: string, ...args: any[]): void;
    on(
        channel: string,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ): void;
    removeListener(channel: string, listener: (...args: any[]) => void): void;
    removeAllListeners(channel: string): void;
}