const app = require("express")();
require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");

const db_config = {
    host: process.env.PLANETSCALE_DB_HOST,
    user: process.env.PLANETSCALE_DB_USERNAME,
    password: process.env.PLANETSCALE_DB_PASSWORD,
    database: process.env.PLANETSCALE_DB,
};

const connection = mysql.createConnection(db_config);

const { v4 } = require("uuid");

app.get("/:url", (req, res) => {
    const { url } = req.params;
    console.log("Connected to PlanetScale!");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.status(301).redirect(`https://www.amazon.com/${url}`);
});

app.post("/:url", (req, res) => {
    const { url } = req.params;
    console.log("Connected to PlanetScale!");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    // post to db
    const id = v4();
    const sql = `INSERT INTO urls (id, url) VALUES ('${id}', '${url}')`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.status(301).redirect(`https://www.amazon.com/${url}`);
});

// ONLY FOR TESTING
app.listen(3001, () => console.log("Server running on port 3001"));

module.exports = app;
