// department.js

class Department {
    constructor(departmentName) {
        this.departmentName = departmentName;
        this.employeeList = [];
    }

    addEmployee(employee) {
        this.employeeList.push(employee);
    }

    extractEmployee() {
        return this.employeeList.length > 0 ? this.employeeList.shift() : null;
    }
}

module.exports = Department;
