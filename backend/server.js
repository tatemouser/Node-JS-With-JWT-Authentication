const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shopping_site_db"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.status(401).json({ error: "Token required" });
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token invalid" });
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};




/*------------
USER CONTROL
-------------*/

app.get('/checkauth', verifyJwt, (req, res) => {
    return res.json("Authenticated");
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `username` = ? AND `password` = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: "Database error" });
        }
        if (data.length > 0) {
            const user = data[0];
            const token = jwt.sign({ id: user.id }, "jwtSecretKey", { expiresIn: 300 });
            return res.json({
                Login: true,
                token,
                id: user.id,
                username: user.username,
                gender: user.gender,
                birthday: user.birthday
            });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`username`, `password`, `gender`, `birthday`) VALUES (?)";
    const values = [
        req.body.username,
        req.body.password,
        req.body.gender,
        req.body.birthday
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json(data);
    });
});



/*--------------
SWIPE PAGE 
----------------*/

// GET STACK
app.get('/items', (req, res) => {
    const query = 'SELECT id, name, url FROM items'; // Include id in the select statement
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal server error');
            return;
        }
        res.json(results);
    });
});

// FOR SWIPING
app.post('/add-to-checkouts', verifyJwt, (req, res) => {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
    }

    const sql = "INSERT INTO checkouts (user_id, item_id) VALUES (?, ?)";
    db.query(sql, [userId, itemId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Item added to checkouts' });
    });
});

// FOR SWIPING
app.post('/remove-from-checkouts', verifyJwt, (req, res) => {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
    }

    const sql = "DELETE FROM checkouts WHERE user_id = ? AND item_id = ?";
    db.query(sql, [userId, itemId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Item removed from checkouts' });
    });
});



/*--------------------------------------
INVENRTORY/CART PAGE (DISPLAYING ITEMS))
----------------------------------------*/

app.get('/user-items', (req, res) => {
    const userId = req.query.userId; // Get user ID from query parameters
  
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }
  
    const checkoutsQuery = `SELECT * FROM checkouts WHERE user_id = ${userId}`;
  
    db.query(checkoutsQuery, (err, checkoutsResult) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal server error');
            return;
        }
  
        res.json(checkoutsResult);
    });
});


app.get('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = `SELECT * FROM items WHERE id = ${itemId}`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal server error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Item not found');
            return;
        }

        res.json(results[0]);
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
