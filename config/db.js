const { Sequelize } = require("sequelize");
require("dotenv").config()

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database.");
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
};
console.log("DB export:", sequelize instanceof Sequelize);

module.exports = { connectDB, sequelize };
