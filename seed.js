const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Poopers2', // Replace with your MySQL password
  database: 'employee_db'
});

// Seed data to insert into department, role, and employee tables
const seedData = {
  departments: [
    { name: 'Human Resources' },
    { name: 'Finance' },
    { name: 'Marketing' }
  ],
  roles: [
    { title: 'Manager', salary: 60000.00, department_id: 1 },
    { title: 'Accountant', salary: 50000.00, department_id: 2 },
    { title: 'Marketing Coordinator', salary: 45000.00, department_id: 3 }
  ],
  employees: [
    { first_name: 'John', last_name: 'Doe', role_id: 1, manager_id: null },
    { first_name: 'Jane', last_name: 'Smith', role_id: 2, manager_id: 1 },
    { first_name: 'Mike', last_name: 'Johnson', role_id: 3, manager_id: 1 }
  ]
};

// Function to seed data into the database
const seedDatabase = () => {
  // Insert departments
  connection.query('INSERT INTO department (name) VALUES ?', [seedData.departments.map(department => [department.name])], (err, result) => {
    if (err) throw err;
    console.log(`Inserted ${result.affectedRows} departments into department table.`);
  });

  // Insert roles
  connection.query('INSERT INTO role (title, salary, department_id) VALUES ?', [seedData.roles.map(role => [role.title, role.salary, role.department_id])], (err, result) => {
    if (err) throw err;
    console.log(`Inserted ${result.affectedRows} roles into role table.`);
  });

  // Insert employees
  connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?', [seedData.employees.map(employee => [employee.first_name, employee.last_name, employee.role_id, employee.manager_id])], (err, result) => {
    if (err) throw err;
    console.log(`Inserted ${result.affectedRows} employees into employee table.`);
  });

  // Close the database connection
  connection.end();
};


seedDatabase();
