const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");



const app = express();
const port = 5050; 

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "web_app",
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error("Error:", err);
    process.exit(1);
  }
  console.log("Connnect Mysql");
});




app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "Username and Password" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ success: false, message: "Error" });
    }

    if (results.length > 0) {
      res.json({ success: true, message: "Successfully!", user: results[0] });
    } else {
      res.json({ success: false, message: "Error" });
    }
  });
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.post("/register", (req, res) => {
  const { username, password, firstname, lastname, salary, age } = req.body;

  if (!username || !password || !firstname || !lastname) {
    return res.json({ message: "Please fill in all required fields." });
  }

  const registerday = new Date().toISOString().slice(0, 10);
  const signintime = new Date();

  const sql = `
    INSERT INTO Users
    (username, password, firstname, lastname, salary, age, registerday, signintime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [username, password, firstname, lastname, salary, age, registerday, signintime];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ message: "Username already exists." });
      }
      return res.json({ message: "Database error: " + err.message });
    }
    res.json({ message: "Registration successful!" });
  });
});


app.listen(5050, () => {
  console.log("Server running on http://localhost:5050");
});


function queryDB(sql, params, res) {
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}


app.get("/searchByFirstname", (req, res) => {
    const { firstname } = req.query;
    const sql = "SELECT * FROM Users WHERE firstname LIKE ?";
    queryDB(sql, [`%${firstname}%`], res);
});

app.get("/searchByUserid", (req, res) => {
    const { userid } = req.query;
    const sql = "SELECT * FROM Users WHERE userid = ?";
    queryDB(sql, [userid], res);
});

app.get("/searchBySalary", (req, res) => {
    const { min, max } = req.query;
    const sql = "SELECT * FROM Users WHERE salary BETWEEN ? AND ?";
    queryDB(sql, [min, max], res);
});

app.get("/searchByAge", (req, res) => {
    const { min, max } = req.query;
    const sql = "SELECT * FROM Users WHERE age BETWEEN ? AND ?";
    queryDB(sql, [min, max], res);
});

app.get("/searchAfterJohn", (req, res) => {
    const sql = `
        SELECT * FROM Users
        WHERE registerday > (SELECT registerday FROM Users WHERE firstname = 'John' LIMIT 1)
    `;
    queryDB(sql, [], res);
});

app.get("/searchSameDayJohn", (req, res) => {
    const sql = `
        SELECT * FROM Users
        WHERE registerday = (SELECT registerday FROM Users WHERE firstname = 'John' LIMIT 1)
    `;
    queryDB(sql, [], res);
});

app.get("/searchRegisteredToday", (req, res) => {
    const sql = "SELECT * FROM Users WHERE DATE(registerday) = CURDATE()";
    queryDB(sql, [], res);
});

app.get("/searchNeverSignedIn", (req, res) => {
    const sql = "SELECT * FROM Users WHERE signintime IS NULL";
    queryDB(sql, [], res);
});




app.listen(5050, () => {
    console.log("Server running on http://localhost:5050");
});


app.get("/", (req, res) => res.send("Server is running"));


function queryDB(sql, params, res) {
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}


app.get("/searchByFirstname", (req, res) => {
    const { firstname } = req.query;
    const sql = "SELECT * FROM Users WHERE firstname LIKE ?";
    queryDB(sql, [`%${firstname}%`], res);
});

app.get("/searchByUserid", (req, res) => {
    const { userid } = req.query;
    const sql = "SELECT * FROM Users WHERE userid = ?";
    queryDB(sql, [userid], res);
});

app.get("/searchBySalary", (req, res) => {
    const { min, max } = req.query;
    const sql = "SELECT * FROM Users WHERE salary BETWEEN ? AND ?";
    queryDB(sql, [min, max], res);
});

app.get("/searchByAge", (req, res) => {
    const { min, max } = req.query;
    const sql = "SELECT * FROM Users WHERE age BETWEEN ? AND ?";
    queryDB(sql, [min, max], res);
});

app.get("/searchAfterJohn", (req, res) => {
    const sql = `
        SELECT * FROM Users
        WHERE registerday > (SELECT registerday FROM Users WHERE firstname = 'John' LIMIT 1)
    `;
    queryDB(sql, [], res);
});

app.get("/searchSameDayJohn", (req, res) => {
    const sql = `
        SELECT * FROM Users
        WHERE registerday = (SELECT registerday FROM Users WHERE firstname = 'John' LIMIT 1)
    `;
    queryDB(sql, [], res);
});

app.get("/searchRegisteredToday", (req, res) => {
    const sql = "SELECT * FROM Users WHERE DATE(registerday) = CURDATE()";
    queryDB(sql, [], res);
});

app.get("/searchNeverSignedIn", (req, res) => {
    const sql = "SELECT * FROM Users WHERE signintime IS NULL";
    queryDB(sql, [], res);
});


app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
});