// dependencies
const mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');
const { read } = require('fs/promises');

// setup connection to mysql work bench
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'Mgoblue99!505',
    database: 'companyDB',
  });

  // manager options list
  const start = () => {
    inquirer
      .prompt({
        name: 'options',
        type: 'list',
        message: 'Would you like to do?',
        choices: ['View All Employees', 'View All Employees by Department', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
      })
      .then((answer) => {
        if (answer.options === 'Exit') {
          connection.end();
        }
        else if (answer.options === 'View All Employees') {
            view_all_emps();
        }
        else if (answer.options === 'Add Employee') {
            add_employee();
        }
        else if (answer.options === 'Remove Employee') {
            remove_employee();
        }
      });
  };  

// function to view all employees
let view_all_emps = function() {
        connection.query(`SELECT employee.emp_id, employee.first_name, employee.last_name, 
        emp_role.emp_title, department.dept_name, emp_role.emp_salary FROM employee 
        INNER JOIN 
        emp_role ON employee.role_id = emp_role.role_id
        INNER JOIN 
        department ON emp_role.dept_id = department.dept_id
        ORDER BY employee.emp_id`, 
        (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log('\n');
        console.table(res);
        console.log('\n');
        start();
})};

// function to add an employee
let add_employee = function() {
    inquirer
      .prompt([
        {
            name: 'fname',
            type: 'input',
            message: 'What is the new employees first name?',
        },
        {
            name: 'lname',
            type: 'input',
            message: 'What is the new employees last name?',
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is the new employees role?',
            choices: ['Human Resources', 'Sales', 'Engineering', 'Finance', 'Legal'],
        },
      ])
      .then((answer) => {
        let new_role;
        switch (answer.role)
        {
          case 'Human Resources':
            new_role = 1;
            break;
          case 'Sales':
            new_role = 2;
            break;
          case 'Engineering':
            new_role = 3;
            break;
          case 'Finance':
            new_role = 4;
            break;
          case 'Legal':
            new_role = 5;
            break;
        }
        connection.query(`INSERT INTO employee SET ?`,
        {
            first_name: answer.fname,
            last_name: answer.lname,
            role_id: new_role,
        }, 
        (err, res) => {
            if (err) throw err;
            start();
      })})
};

// function to remove an employee
let remove_employee = function() {
    connection.query('SELECT emp_id, first_name, last_name FROM employee', (err, res) => {
    if (err) throw err;
    let emps = [];
    for (let i = 0; i < res.length; ++i) {
        emps[i] = '(' + res[i].emp_id+ ') ' + ' ' + res[i].first_name + ' ' + res[i].last_name;
    }
    inquirer
      .prompt({
        name: 'remove',
        type: 'list',
        message: 'Which employee do you want to remove?',
        choices: emps, 
    })
    .then((answer) => { 
        console.table(answer.remove[0]);
        connection.query(`DELETE FROM employee WHERE emp_id = ${answer.remove[1]}`)
        start();
    })})
};  

  // connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

let printSign = function() {
console.log(`                |--------------------------|                 
                |                          |
                |     EMPLOYEE MANAGER     |
                |                          |
                |--------------------------|\n\n`);
};

printSign();
