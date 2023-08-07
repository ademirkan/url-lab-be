const express = require("express");
const app = express();
require("dotenv").config();
const mysql = require("mysql2");
const { v4 } = require("uuid");
const cors = require("cors");

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.use(express.json()); // middleware to parse JSON request body
app.use(cors());

app.get("/", (req, res) => {
    res.redirect("https://app.urllab.co/");
});
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

            res.redirect(results[0].url);
        }
    );
});

app.post("/create-url", (req, res) => {
    const { id, url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Check if id is already in table
    if (id) {
        connection.query(
            "SELECT url FROM urls WHERE id = ?",
            [id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                }
                if (results.length > 0) {
                    return res.status(400).json({ error: "ID already exists" });
                }
            }
        );
    }

    // Insert into table
    connection.query(
        "INSERT INTO urls (id, url) VALUES (?, ?)",
        [id, url],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json({ id, url });
        }
    );
});

module.exports = app;
