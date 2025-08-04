const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'sumit6', // replace with your MySQL username
    password: '12345678', // replace with your MySQL password
    // Ensure the database exists or create it
    database: 'calculator_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});


db.query(`
    CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        expression VARCHAR(255),
        result VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

app.post('/api/history', (req, res) => {
    const { expression, result } = req.body;
    db.query(
        'INSERT INTO history (expression, result) VALUES (?, ?)',
        [expression, result],
        (err, result) => {
            if (err) return res.status(500).send('DB Error');
            res.send({ success: true });
        }
    );
});


app.get('/api/history', (req, res) => {
    db.query('SELECT * FROM history ORDER BY created_at DESC LIMIT 20', (err, results) => {
        if (err) return res.status(500).send('DB Error');
        res.send(results);
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});