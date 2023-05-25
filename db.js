/** Database setup for BizTime. */
const { Client } = require('pg');
const SECRET_PASS = require('./secrets');

let DB_URI;
if(process.env.NODE_ENV === "test")
    DB_URI = 'postgresql:///biztime_test';
else
    DB_URI = 'postgresql:///biztime';

let db = new Client({ 
    connectionString: DB_URI,
    password: 
});

db.connect();

module.exports = db;
