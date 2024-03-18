const Express = require('express');
const app = Express();
const morgan = require('morgan');
const cors = require('cors');
const {Sequelize} = require('sequelize');
var env = process.env.NODE_ENV || 'development';
const {port} = require('./config/config');
const config = require('./config/config')[env];

const PORT = process.env.PORT || port;


// Express Routes Import
const AuthorizationRoutes = require("./authorization/routes/routes");
// const UserRoutes = require("./users/routes");
// const ProductRoutes = require("./products/routes");

// Sequelize model imports
const UserModel = require("./common/Models/User");
// const ProductModel = require("./common/models/Product");

app.use(morgan("tiny"));
app.use(cors());

// Middleware that parses the body payloads as JSON to be consumed next set
// of middlewares and controllers.
app.use(Express.json());

const sequelize = new Sequelize(config.database, config.username, config.password, config)

// Initialising the Model on sequelize
UserModel.initialise(sequelize);
// ProductModel.initialise(sequelize);

// Syncing the models that are defined on sequelize with the tables that alredy exists
// in the database. It creates models as tables that do not exist in the DB.
sequelize
  .sync()
  .then(() => {
    console.log("Sequelize Initialised!!");

    // Attaching the Authentication and User Routes to the app.
    app.use("/", AuthorizationRoutes);
    // app.use("/user", UserRoutes);
    // app.use("/product", ProductRoutes);

    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", port);
    });
  })
  .catch((err) => {
    console.error("Sequelize Initialisation threw an error:", err);
  });
