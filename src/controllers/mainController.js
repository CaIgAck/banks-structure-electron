const { ipcMain, dialog  } = require('electron');

const fs = require('fs');

const Bank = require('../models/bank');
const Department = require('../models/department');
const Employee = require('../models/employee');

let bank;
let isBankStructureCreated = false;
const {getMainWindow} = require('../services/mainWindowService');

ipcMain.on('addDepartment', (event, departmentName) => {
    const department = new Department(departmentName);
    bank.addDepartment(department);
});

ipcMain.on('removeDepartment', (event, departmentName) => {
    const removedDepartment = bank.removeDepartmentByName(departmentName);
    if (removedDepartment) {
        console.log(`Department "${departmentName}" removed.`);
    } else {
        console.log(`Department "${departmentName}" not found.`);
    }
});

ipcMain.on('findDepartment', (event, departmentName) => {
    const foundDepartment = bank.findDepartmentByName(departmentName);
    const mainWindow = getMainWindow();

    if (mainWindow) {
        mainWindow.webContents.send('bankStructure', foundDepartment);
    } else {
        console.error('Main window is not initialized.');
    }
});

ipcMain.on('addEmployee', (event, { lastName, position }) => {
    const employee = new Employee(lastName, position);
    const lastDepartment = bank.departmentList.removeNode(); // Извлекаем последний отдел
    if (lastDepartment) {
        lastDepartment.addEmployee(employee);
        bank.departmentList.addNode(lastDepartment); // Помещаем обратно в конец списка
    } else {
        console.error('No department available.');
    }
});

ipcMain.on('initBank', (event, { bankName }) => {
    bank = new Bank(bankName);
    isBankStructureCreated = true;
});

ipcMain.on('getBankStructure', (event) => {
    event.reply('bankStructure', bank);
});

ipcMain.on('loadData', async () => {
    const filePaths = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });
    if (!filePaths.canceled && filePaths.filePaths.length > 0) {
        const filePath = filePaths.filePaths[0];
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);

            bank = new Bank(jsonData.bankName);

            jsonData.departmentList.forEach(departmentData => {
                const department = new Department(departmentData.departmentName);
                departmentData.employeeList.forEach(employeeData => {
                    const employee = new Employee(employeeData.lastName, employeeData.position);
                    department.addEmployee(employee);
                });
                bank.addDepartment(department);
            });

            dialog.showMessageBoxSync({
                type: 'info',
                message: 'File loaded successfully!',
                title: 'Success',
                buttons: ['OK'],
            });
            const mainWindow = getMainWindow();

            if (mainWindow) {
                await mainWindow.webContents.send('bankStructure', bank);
            } else {
                console.error('Main window is not initialized.');
            }
        } catch (error) {
            console.error('Error reading or parsing the file:', error.message);
        }
    }
});

ipcMain.on('saveData', async () => {
    if (isBankStructureCreated) {
        const filePaths = await dialog.showSaveDialog({
            defaultPath: 'bank_data.json',
            filters: [{ name: 'JSON Files', extensions: ['json'] }]
        });

        if (!filePaths.canceled && filePaths.filePath) {
            const filePath = filePaths.filePath;
            const jsonData = {
                bankName: bank.bankName,
                departmentList: bank.departmentList.map(department => ({
                    departmentName: department.departmentName,
                    employeeList: department.employeeList.map(employee => ({
                        lastName: employee.lastName,
                        position: employee.position,
                    })),
                })),
            };

            try {
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
                // Показываем модальное окно об успешной выгрузке данных
                dialog.showMessageBoxSync({
                    type: 'info',
                    message: 'Data saved successfully!',
                    title: 'Success',
                    buttons: ['OK'],
                });
            } catch (error) {
                console.error('Error saving data:', error.message);
                // Показываем модальное окно об ошибке
                dialog.showMessageBoxSync({
                    type: 'error',
                    message: 'Error saving data:\n' + error.message,
                    title: 'Error',
                    buttons: ['OK'],
                });
            }
        }
    } else {
        // Если структура банка не создана, показываем сообщение
        dialog.showMessageBoxSync({
            type: 'warning',
            message: 'Please create the bank models before saving data.',
            title: 'Warning',
            buttons: ['OK'],
        });
    }
});
