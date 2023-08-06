const express = require("express");
const app = express();
require("dotenv").config();
const mysql = require("mysql2");
const { v4 } = require("uuid");

const db_config = {
    host: process.env.PLANETSCALE_DB_HOST,
    user: process.env.PLANETSCALE_DB_USERNAME,
    password: process.env.PLANETSCALE_DB_PASSWORD,
    database: process.env.PLANETSCALE_DB,
    ssl: {
        ca: fs.readFileSync(process.env.PLANETSCALE_SSL_CERT_PATH),
    },
};

const connection = mysql.createConnection(db_config);

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

app.post("/add-url", (req, res) => {
    const { url } = req.body;
    console.log("here");
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }
    const id = v4();
    console.log(id);
    connection.query(
        "INSERT INTO urls (id, url) VALUES (?, ?)",
        [id, url],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json({ id: id });
        }
    );
});

module.exports = app;
