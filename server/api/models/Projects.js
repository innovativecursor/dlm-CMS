const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Menu = require("./menu");

const Projects = sequelize.define("Projects", {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  project_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  onGoingProject: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  project_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pictures: { type: DataTypes.JSON, allowNull: false },
  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: "menu_id",
    },
  },
});
Menu.hasMany(Projects, { foreignKey: "menu_id" });
Projects.belongsTo(Menu, { foreignKey: "menu_id" });
module.exports = Projects;
