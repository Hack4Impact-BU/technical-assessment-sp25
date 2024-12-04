const { Client } = require('pg');
require('dotenv').config();

const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

dbClient.connect((e) => {
    if (e) {
        console.error(e);
    } else {
        console.log('Connected to the database');
    }
})

module.exports = dbClient;