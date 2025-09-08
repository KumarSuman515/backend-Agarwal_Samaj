const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Classified = sequelize.define(
  "Classified",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    person_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    firm_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    firm_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    website: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    business_category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    photos: {
      type: DataTypes.STRING(1000), // storing serialized filenames, e.g. comma separated
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "disapproved"),
      allowNull: false,
      defaultValue: "pending",
    },
    approval_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    approval_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "classified_listings",
    timestamps: false,
  }
);

module.exports = Classified;
