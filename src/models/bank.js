// bank.js
const LinkedList = require('./linkedList');

class Bank {
    constructor(bankName) {
        this.bankName = bankName;
        this.departmentList = new LinkedList();
    }

    addDepartment(department) {
        this.departmentList.addNode(department);
    }

    removeDepartment() {
        return this.departmentList.removeNode();
    }

    removeDepartmentByName(departmentName) {
        let current = this.departmentList.head;
        let prev = null;

        while (current) {
            if (current.data.departmentName === departmentName) {
                if (prev) {
                    prev.next = current.next;
                } else {
                    this.departmentList.head = current.next;
                }

                current.next = null;
                return current.data;
            }

            prev = current;
            current = current.next;
        }

        return null; // Отдел с указанным именем не найден
    }

    findDepartmentByName(departmentName) {
        let current = this.departmentList.head;

        while (current) {
            if (current.data.departmentName === departmentName) {
                return current.data;
            }

            current = current.next;
        }

        return null; // Отдел с указанным именем не найден
    }
}

module.exports = Bank;
