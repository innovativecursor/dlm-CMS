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
    allowNull: true,
    defaultValue: "Work Sans",
  },
  navTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  navIconsColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  heroMainTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  heroSubTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  universalButtonColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  universalSelectorTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  universalHeadingTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  universalContentTextColor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Fontcolor;
