const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Project = require("./Projects");

const Fontcolor = sequelize.define("Fontcolor", {
  pack_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  font_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Work Sans",
  },
});

module.exports = Fontcolor;
