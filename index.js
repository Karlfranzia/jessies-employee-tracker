const inquirer = require("inquirer");
const mysql = require("mysql2");


// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Poopers2", 
  database: "employee_db" 
},
console.log(`Connected to the employee_db database.`)
);



// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit"
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          console.log("Goodbye");
          connection.end(); 
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.log(res); 
    startApp(); 
  });
}

// Function to view all roles
function viewRoles() {
  
  const query = `
    SELECT * FROM role
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(res); 
    startApp(); 
  });
}

// Function to view all employees
function viewEmployees() {
  const query = `
    SELECT * FROM employee
    `;
connection.query(query, (err, res) => {
if (err) throw err;
console.log(res); 
startApp(); 
});
}

// Function to add a department
function addDepartment() {
    inquirer
    .prompt({
    name: "name",
    type: "input",
    message: "Enter the name of the department:"
    })
    .then(answer => {
    connection.query(
    "INSERT INTO department SET ?",
    { name: answer.name },
    err => {
    if (err) throw err;
    console.log(`Department "${answer.name}" added successfully!`);
    startApp(); // Continue to the next action
    }
    );
    });
    }
    
    // Function to add a role
    function addRole() {
    connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    const departments = res.map(department => ({
    value: department.id,
    name: department.name
    }));
    inquirer
    .prompt([
    {
    name: "title",
    type: "input",
    message: "Enter the title of the role:"
    },
    {
    name: "salary",
    type: "number",
    message: "Enter the salary for the role:"
    },
    {
    name: "department",
    type: "list",
    message: "Select the department for the role:",
    choices: departments
    }
    ])
    .then(answer => {
    connection.query(
    "INSERT INTO role SET ?",
    {
    title: answer.title,
    salary: answer.salary,
    department_id: answer.department
    },
    err => {
    if (err) throw err;
    console.log(`Role "${answer.title}" added successfully!`);
    startApp(); 
    }
    );
    });
    });
    }
    
    // Function to add an employee
    function addEmployee() {
    connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    const roles = res.map(role => ({ value: role.id, name: role.title }));
    connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.map(employee => ({
    value: employee.id,
    name: `${employee.first_name} ${employee.last_name}`
    }));
    inquirer
    .prompt([
    {
    name: "first_name",
    type: "input",
    message: "Enter the first name of the employee:"
    },
    {
    name: "last_name",
    type: "input",
    message: "Enter the last name of the employee:"
    },
    {
    name: "role",
    type: "list",
    message: "Select the role for the employee:",
    choices: roles
    },
    {
    name: "manager",
    type: "list",
    message: "Select the manager for the employee:",
    choices: [{ value: null, name: "None" }, ...employees]
    }
    ])
    .then(answer => {
    connection.query(
    "INSERT INTO employee SET ?",
    {
    first_name: answer.first_name,
    last_name: answer.last_name,
    role_id: answer.role,
    manager_id: answer.manager
},
err => {
if (err) throw err;
console.log(
`Employee "${answer.first_name} ${answer.last_name}" added successfully!`
);
startApp(); 
}
);
});
});
});
}
// Function to update employee role
function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    const employees = res.map(employee => ({
    value: employee.id,
    name: `${employee.first_name} ${employee.last_name}`
    }));
    connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    const roles = res.map(role => ({ value: role.id, name: role.title }));
    inquirer
    .prompt([
    {
    name: "employee",
    type: "list",
    message: "Select the employee whose role you want to update:",
    choices: employees
    },
    {
    name: "role",
    type: "list",
    message: "Select the new role for the employee:",
    choices: roles
    }
    ])
    .then(answer => {
    connection.query(
    "UPDATE employee SET ? WHERE ?",
    [{ role_id: answer.role }, { id: answer.employee }],
    err => {
    if (err) throw err;
    console.log("Employee role updated successfully!");
    startApp();
    }
    );
    });
    });
    });
    }
    
    startApp();