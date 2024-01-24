// department.js
const LinkedList = require('./linkedList');

class Department {
    constructor(departmentName) {
        this.departmentName = departmentName;
        this.employeeList = new LinkedList();
    }

    addEmployee(employee) {
        this.employeeList.addNode(employee);
    }

    extractEmployee() {
        return this.employeeList.removeNode();
    }

}

module.exports = Department;
