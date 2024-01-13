// bank.js

class Bank {
    constructor(bankName) {
        this.bankName = bankName;
        this.departmentList = [];
    }

    addDepartment(department) {
        this.departmentList.push(department);
    }

    removeDepartment() {
        return this.departmentList.length > 0 ? this.departmentList.shift() : null;
    }
}

module.exports = Bank;
