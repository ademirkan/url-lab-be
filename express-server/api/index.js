const express = require("express");
const app = express();
require("dotenv").config();
const mysql = require("mysql2");
const { v4 } = require("uuid");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.use(express.json()); // middleware to parse JSON request body

app.get("/:id", (req, res) => {
    const { id } = req.params;
    connection.query(
        "SELECT url FROM urls WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "URL not found" });
            }
            res.json({ url: results[0].url });
        }
    );
});

app.post("/create-url", (req, res) => {
    const { id, longUrl } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    connection.query(
        "INSERT INTO urls (id, url) VALUES (?, ?)",
        [id, url],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.redirect(url);
        }
    );
});

module.exports = app;
