const router = require("express").Router();

// Controller Imports
const AuthorizationController = require("../controllers/AuthorizationController");

// Middleware Imports
const SchemaValidationMiddleware = require("../../common/middlewares/SchemaValidationMiddleware");

// JSON Schema Imports for payload verification
const Register = require("../schemas/Register");
const Login = require("../schemas/Login");

router.post(
  "/signup",
  [SchemaValidationMiddleware.verify(Register)],
  AuthorizationController.register
);

router.post(
  "/login",
  [SchemaValidationMiddleware.verify(Login)],
  AuthorizationController.login
);

module.exports = router;