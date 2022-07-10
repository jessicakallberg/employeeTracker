USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");
-- 1 through 4
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 150000.00, 1),
("Salesperson", 85000, 1),
("Lead Engineer", 140000, 2),
("Accoutant", 115000, 3),
("Account Manager", 135000, 3),
("Legal Team Lead", 145000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Quince", 1, NULL),
("Sally", "Raphael", 3, 1),
("Jess", "Jones", 5, NULL),
("Sam", "Smith", 6, 1);