const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron')
const path = require('path')
const fs = require('fs').promises
const ExifParser = require("./exif/ExifParser")

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            safeDialogs: true,
            sandbox: true,
            preload: path.join(__dirname, 'dist/preload.js'),
        }
    })
    win.loadFile('index.html')
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

let is_expand_from_exif = false;
let is_show_file_name = false;
let menu_template = [{
    label: "View",
    submenu: [
        {
            label: "被写体位置で拡大",
            type: "checkbox",
            click: () => {
                is_expand_from_exif = !is_expand_from_exif;
                win.webContents.send("set-expand-exif", is_expand_from_exif);
            },
            checked: is_expand_from_exif,
        },
        {
            label: "ファイル名を表示",
            type: "checkbox",
            click: () => {
                is_show_file_name = !is_show_file_name;
                win.webContents.send("set-show-file-name", is_show_file_name);
            },
            checked: is_show_file_name,
        },
        { type: 'separator' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
    ]
}]

app.on("ready", () => {
    const menu = Menu.buildFromTemplate(menu_template);
    Menu.setApplicationMenu(menu);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
async function readDirectory(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    return await Promise.all(dirents.map(async dirent => {
        const p = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            const list = await readDirectory(p);
            return list.reduce((pre, current) => {
                pre.push(...current);
                return pre;
            }, []);
        } else {
            return [p];
        }
    }));
}

async function getFiles(paths) {
    return await Promise.all(paths.map(async p => {
        const stats = await fs.stat(p);
        if (stats.isDirectory()) {
            const list = await readDirectory(p);
            return list.reduce((pre, current) => {
                pre.push(...current);
                return pre;
            }, []);
        } else {
            return [p];
        }
    }));
}
ipcMain.handle("get-image-list", async (_e, paths) => {
    const file_list = await getFiles(paths);
    const list = file_list.reduce((pre, current) => {
        pre.push(...current);
        return pre
    }, []);
    const image_list = list.filter((f) => {
        const ext = path.extname(f);
        return (ext.toLowerCase() === ".jpg") || (ext.toLowerCase() === ".png") || (ext.toLowerCase() === ".bmp");
    });
    return image_list;
});

ipcMain.handle("set-focus", async (_e) => {
    win.focus();
})

ipcMain.handle("get-exif", async (_e, filename) => {
    try {
        const location = await ExifParser.parse(filename);
        if (location === undefined) {
            return [undefined, undefined];
        }
        return [location[0], location[1]];
    } catch{
        return [undefined, undefined];
    }
})