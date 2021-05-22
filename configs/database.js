const { Pool } = require('pg');

// To standarize timestamps throughout
const types = require('pg').types;
const timestampOID = 1114;
types.setTypeParser(timestampOID, function(stringValue) {
  return stringValue;
})

// Make the connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

module.exports = pool;