const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const Bank = require('./bank');
const Department = require('./department');
const Employee = require('./employee');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

let bank;

ipcMain.on('addDepartment', (event, departmentName) => {
    const department = new Department(departmentName);
    bank.addDepartment(department);
});

ipcMain.on('addEmployee', (event, { lastName, position }) => {
    const employee = new Employee(lastName, position);
    const lastDepartment = bank.departmentList[bank.departmentList.length - 1];
    lastDepartment.addEmployee(employee);
});

ipcMain.on('initBank', (event, { bankName }) => {
    bank = new Bank(bankName);
});

ipcMain.on('getBankStructure', (event) => {
    event.reply('bankStructure', bank);
});
