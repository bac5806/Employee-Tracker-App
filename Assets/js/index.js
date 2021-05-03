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
        choices: ['View All Employees', 'Add Employee', 'View Roles', 'Add Role', 'View Departments', 'Add Department', 'Update Employee Role', 'Remove Employee', 'Exit'],
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
        else if (answer.options === 'Add Department') {
            add_dept();
        }
        else if (answer.options === 'View Departments') {
            view_depts();
        }
        else if (answer.options === 'View Roles') {
            view_roles();
        }
        else if (answer.options === 'Add Role') {
            add_role();
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
  let roles = [];
  let index;
  connection.query(`SELECT emp_title FROM emp_role`,
  (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; ++i) {
        roles[i] = res[i].emp_title;
    }

    // Log all results of the SELECT statement
    console.log('\n');
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
            choices: roles,
        },
      ])
      .then((answer) => {
        for (let i = 0; i < roles.length; ++i) {
          if (answer.role === res[i].emp_title) {
            index = i + 1;
            break;
          }
        }
        connection.query(`INSERT INTO employee SET ?`,
        {
            first_name: answer.fname,
            last_name: answer.lname,
            role_id: index,
        }, 
        (err, res) => {
            if (err) throw err;
            start();
      })})
  })};

// function to remove an employee
let remove_employee = function() {
    connection.query('SELECT emp_id, first_name, last_name FROM employee', (err, res) => {
    if (err) throw err;
    let emps = [];
    for (let i = 0; i < res.length; ++i) {
        emps[i] = '(' + res[i].emp_id + ') ' + ' ' + res[i].first_name + ' ' + res[i].last_name;
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

// add new departments
let add_dept = function() {
  inquirer
      .prompt(
        {
            name: 'new_dept',
            type: 'input',
            message: 'What is the new department to you would like to add?',
        })
        .then((answer) => { 
          connection.query(`INSERT INTO department SET ?`, 
          {
            dept_name: answer.new_dept,
          },
          (err, res) => { 
            if (err) throw err;
            start();
        })})
      
};

// view departments
let view_depts = function() {
  connection.query(`SELECT department.dept_name FROM department`,
  (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log('\n');
    console.table(res);
    start();
  
})};

// view roles
let view_roles = function() {
  connection.query(`SELECT emp_role.emp_title FROM emp_role`,
  (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log('\n');
    console.table(res);
    start();
  
})};

// add new role
let add_role = function() {
  let index;
  let depts = [];
  connection.query(`SELECT dept_name FROM department`,
  (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; ++i) {
      depts[i] = res[i].dept_name;
    }

  inquirer
      .prompt([
        {
            name: 'new_role',
            type: 'input',
            message: 'What is the new role to you would like to add?',
        },
        {
          name: 'new_sal',
          type: 'input',
          message: 'What is the salary of the new role to you would like to add?',
        },
        {
          name: 'dept',
          type: 'list',
          message: 'What department does the new role fall under?',
          choices: depts,
        },
        ])
        .then((answer) => { 

          for (let i = 0; i < depts.length; ++i) {
            if (depts[i] === answer.dept) {
              index = i +1;
              break;
            }
          }

          connection.query(`INSERT INTO emp_role SET ?`, 
          {
            emp_title: answer.new_role,
            emp_salary: answer.new_sal,
            dept_id: index,
          },
          (err, res) => { 
            if (err) throw err;
            start();
        })})
      
})};

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
