DROP DATABASE IF EXISTS companyDB;
CREATE DATABASE companyDB;
USE companyDB;

CREATE TABLE department (
    dept_id INTEGER AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30) NOT NULL,  
    PRIMARY KEY (dept_id)
);

CREATE TABLE emp_role (
    role_id INTEGER AUTO_INCREMENT NOT NULL,
    emp_title VARCHAR(30) NOT NULL,
    emp_salary DECIMAL(10, 4) NOT NULL,
    dept_id INTEGER,
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE TABLE employee (
    emp_id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES emp_role(role_id),
    FOREIGN KEY (manager_id) REFERENCES  emp_role(role_id)
);

INSERT INTO department(dept_name)
VALUES("Human Resources");
INSERT INTO department(dept_name)
VALUES("Sales");
INSERT INTO department(dept_name)
VALUES("Engineering");
INSERT INTO department(dept_name)
VALUES("Finance");
INSERT INTO department(dept_name)
VALUES("Legal");

INSERT INTO emp_role(emp_title, emp_salary, dept_id)
VALUES("HR REP", 44123.76, 1);
INSERT INTO emp_role(emp_title, emp_salary, dept_id)
VALUES("Sales Person", 46143.88, 2);
INSERT INTO emp_role(emp_title, emp_salary, dept_id)
VALUES("Engineer", 78435.44, 3);
INSERT INTO emp_role(emp_title, emp_salary, dept_id)
VALUES("Accountant", 67237.79, 4);
INSERT INTO emp_role(emp_title, emp_salary, dept_id)
VALUES("Lawyer", 81095.34, 5);

INSERT INTO employee(first_name, last_name, role_id)
VALUES("Jim", "Beam", 1);
INSERT INTO employee(first_name, last_name, role_id)
VALUES("Johnny", "Walker", 2);
INSERT INTO employee(first_name, last_name, role_id)
VALUES("Jack", "Daniels", 3);
INSERT INTO employee(first_name, last_name, role_id)
VALUES("Jose", "Cuervo", 4);
INSERT INTO employee(first_name, last_name, role_id)
VALUES("Evan", "Williams", 5);