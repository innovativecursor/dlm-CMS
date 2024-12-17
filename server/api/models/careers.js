const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Careers = sequelize.define("Careers", {
  career_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobOpenings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  contactDetails: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: { contact1: "", contact2: "" },
  },
});
module.exports = Careers;
