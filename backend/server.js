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
})

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database.');
  });

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token) {
        return res.json("We need token please provide it for next time");
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if(err) {
                return res.json("Not Authenticated");
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.get('/checkauth', verifyJwt, (req, res) => {
    return res.json("Authenticated");
})

app.get('/items', (req, res) => {
    // Execute query to fetch data from the table
    const query = 'SELECT name, url FROM items'; // Modify this query based on your table structure
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal server error');
        return;
      }
      
      // Send the fetched data in the response
      res.json(results);
    });
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (`username`, `password`, `gender`, `birthday`) VALUES (?)";
    const values = [
        req.body.username,
        req.body.password,
        req.body.gender,
        '2000-01-01'
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `username` = ? AND `password` = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const id = data[0].id;
            //  TODO: SHOULD BE FILE IN REAL APPLICATION
            const token = jwt.sign({id}, "jwtSecretKey", {expiresIn: 300});
            return res.json({Login: true, token, data});
        } else {
            return res.json("Failed");
        }
    })
})

app.get('/user-items', (req, res) => {
    // Get the username from the request
    // const username = req.body.username; // Assuming username is available in req.user
    // TODO: REAL PULL OF ID
    const username = 'tatesmouser@gmail.com'; // Hardcoded for testing
    // Execute query to fetch user ID based on the username
    const userIdQuery = `SELECT id FROM users WHERE username = '${username}'`;
  
    db.query(userIdQuery, (err, userIdResult) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal server error');
        return;
      }
      
      if (userIdResult.length === 0) {
        res.status(404).send('User not found');
        return;
      }
  
      // Extract user ID from the result
      const userId = userIdResult[0].id;
  
      // Execute query to fetch checkouts for the user ID
      const checkoutsQuery = `SELECT * FROM checkouts WHERE user_id = ${userId}`;
  
      db.query(checkoutsQuery, (err, checkoutsResult) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal server error');
          return;
        }
  
        // Send the fetched checkouts data in the response
        res.json(checkoutsResult);
      });
    });
  });

  app.get('/items/:id', (req, res) => {
    const itemId = req.params.id; // Extract item ID from the request parameters
    
    // Execute query to fetch item details based on the ID
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

        // Send the fetched item data in the response
        res.json(results[0]); // Assuming there's only one item with the specified ID
    });
});

   

app.listen(8081, () => {
    console.log("listening");
})
