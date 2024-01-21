// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// main.js
const mainWindowService = require('./services/mainWindowService');

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    await mainWindow.loadFile(path.join(__dirname, 'views', 'index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindowService.setMainWindow(mainWindow); // Установка mainWindow в службе
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', async function () {
    if (mainWindow === null) await createWindow();
});


require('./controllers/mainController');
