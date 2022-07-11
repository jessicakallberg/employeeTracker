const { response } = require("express");
const inquirer = require("inquirer");
const db = require("./db/connections");

db.connect(function (err) {
    if (err) throw error;
});

const menuQuestions = 
[
    {
        type: "list",
        name: "menu",
        message: "What would you like to do today?",
        choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        // "View Employees by Manager",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role",
        "Exit",
        // "Update an Employee's Manager",
        ],
    }
];

const addDepartmentQuestions = 
    {
        type: "input",
        name: "department",
        message: "What is the name of the new Department?",
    };

const addRoleQuestions =
[
    {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
    },    
    {
        type: "input",
        name: "salary",
        message: "What is the salary?",
    },
    {
        type: "input",
        name: "department_id",
        message: "What is the department id?",
    }
];

const addEmployeeQuestions =
[
    {
        type: "input",
        name: "fname",
        message: "What is the new employee's first name?",
    },
    {
        type: "input",
        name: "lname",
        message: "What is the new employee's last name?",
    },
    {
        type: "input",
        name: "roleid",
        message: "What is the new employee's role?",
    },
    {
        type: "input",
        name: "manid",
        message: "Who is the new employee's manager?",
    }
];

function viewDep() {
  db.query(`SELECT * FROM department`, (err, rows) => {
    console.table(rows);
    startMenu();
    });
};

function viewRole() {
  db.query(`SELECT * FROM role`, (err, rows) => {
    console.table(rows);
    startMenu();
    });
};

function viewEmp() {
  db.query(`SELECT * FROM employee`, (err, rows) => {
    console.table(rows);
    startMenu();
    });
};

// function viewEmpByMan() {
//   db.query(`SELECT * FROM employee WHERE manager =?`, (err, rows) => {
//     console.table(rows);
//     startMenu();
//   });
// };

function addDep() {
    inquirer.prompt(addDepartmentQuestions).then((response) => {
    db.query(`INSERT INTO department(name) VALUES (?)`,
    response.department,
    (err, results) => {
    if (err) {
        console.log(err);
    }
    db.query(`SELECT * FROM department`, 
    (err, results) => {
        console.table(results);
        startMenu();
    });
    }
    );
});
};

// title, salary, department_id
function addRole() {
  db.query('SELECT * FROM department', (err, results) => {
    console.table(results);
    if (err) {
        console.log(error);
    }
    inquirer.prompt(addRoleQuestions).then((response) => {
    db.query(`INSERT INTO role(title,salary,department_id) VALUES (?, ?, ?)`,
    [response.title, response.salary, response.department_id],
    (err, results) => {
        if (err) {
        console.log(err);
    }
    db.query(`SELECT * FROM role`, 
    (err, results) => {
        console.table(results);
        startMenu();
    });
    }
    );
    });
});
}

// db.query(`INSERT INTO role VALUES (${insertQuestions.role})`, (err, rows) => {
//     console.table(rows);
//     startMenu();
//   });
// }


function addEmp() {
  db.query('SELECT * FROM role', (err, results) => {
    console.table(results);
      db.query('SELECT * FROM employee', (err, results) => {
        console.table(results);
        inquirer.prompt(addEmployeeQuestions).then((response) => {
            db.query(
            `INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`,
            [
            response.fname,
            response.lname,
            response.roleid,
            response.manid
            ],
            (err, results) => {
            db.query('SELECT * FROM employee', (err, results) => {
                console.table(results);
                startMenu();
            });
            }
        );
        });
    });
})
};

function updateEmpRole() {
  db.query(`SELECT * FROM role`, (err, results) => {
    console.table(results);
  const roleOptions = results.map((obj) => {
    return { name: obj.title, value: obj.id };
  });
  db.query('SELECT * FROM employee', (err, results) => {
    console.table(results);
    const empOptions = results.map((obj) => {
      return { name: obj.first_name, value: obj.id };
    });
    const newRoleQuestions = [
      {
        name: "employees",
        type: "list",
        message: "Which employee would you like to update?",
        choices: empOptions
      },
      {
        name: "roles",
        type: "list",
        message: "Which role would you like to reassign to the employee?",
        choices: roleOptions
      }
    ];
    inquirer.prompt(newRoleQuestions).then((response) => {
      db.query('UPDATE employee SET role_id = ? WHERE id = ?',
      [response.role, response.employee],
      (err, results) => {
        db.query('SELECT * FROM employee', (err, results) => {
          console.table(results);
          startMenu();
        });
      }
    );
  });
});
});
};

function startMenu() {
  inquirer.prompt(menuQuestions).then((answer) => {
    
    if (answer.menu === "View All Departments") {
      viewDep();
    } else if (answer.menu === "View All Roles") {   
      viewRole();
    } else if (answer.menu === "View All Employees") {
      viewEmp();
    // } else if (answer.menu === "View Employees by Manager") {
    //   viewEmpByMan();
    } else if (answer.menu === "Add a Department") {
      addDep();
    } else if (answer.menu === "Add a Role") {
      addRole();
    } else if (answer.menu === "Add an Employee") {
      addEmp();
    } else if (answer.menu === "Update an Employee's Role") {
      updateEmpRole();
    // } else if (answer.menu === "Update an Employee's Manager") {
    //   updateEmpMan();
    }
  });
};

startMenu();