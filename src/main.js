const { app, BrowserWindow, ipcMain } = require('electron');

const Bank = require('./structure/bank');
const Department = require('./structure/department');
const Employee = require('./structure/employee');

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

    await mainWindow.loadFile('./views/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', async function () {
    if (mainWindow === null)  await createWindow();
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
