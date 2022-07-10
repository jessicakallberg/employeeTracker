const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "67CH@plin2022",
        database: "employee_tracker_db",
    },
    console.log("Connected to the Employee Tracker database.")
);


module.exports=db;