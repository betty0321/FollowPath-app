const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Connect to DB
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',  // PostgreSQL
    logging: console.log,  // Optional: Logs SQL queries for debugging (remove in prod)
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL via Sequelize!'))
  .catch(err => console.error('Connection error:', err));

// Export the sequelize instance
module.exports = sequelize;