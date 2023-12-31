const express = require("express");
const app = express();
require("dotenv").config();
const mysql = require("mysql2");
const { v4 } = require("uuid");
const cors = require("cors");
import { ensureAbsoluteURL, generateUniqueId } from "../helpers";

const connection = mysql.createConnection(process.env.DATABASE_URL);
connection.connect();

app.use(express.json()); // middleware to parse JSON request body
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.options("/create-url", (req, res) => {
    res.sendStatus(200);
});

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
    let { id, url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    function insertIntoTable(id, url) {
        // Insert into table
        connection.query(
            "INSERT INTO urls (id, url) VALUES (?, ?)",
            [id, ensureAbsoluteURL(url)],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                }
                res.json({ id, url });
            }
        );
    }

    // Check if id is already in table
    if (id && id !== "") {
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
                insertIntoTable(id, url);
            }
        );
    } else {
        // create id of length 6 based on timestamp
        let isUnique = false;
        // while id exists in table, generate new id
        generateUniqueId(connection, (err, id) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            insertIntoTable(id, url);
        });
    }
});

module.exports = app;
