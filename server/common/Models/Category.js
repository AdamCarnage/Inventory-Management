const{DataTypes} = require("sequelize");

const CategoryModel = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

module.exports = {
    initialise: (sequelize) => {
      this.model = sequelize.define("category", CategoryModel)
    },
  
    createCategory: (category) => {
      return this.model.create(category);
    },
}

  