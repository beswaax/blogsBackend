const express = require("express");
const cors = require("cors");
const app = express();
require("express-async-errors");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const errorHandler = require("./utils/middleware").errorHandler;
const middleware = require("./utils/middleware");
// app.use(express.static());

logger.info("Connecting to MongoDB");

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  });

app.use(cors());
app.use(express.json());
app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use(errorHandler);

module.exports = app;

//The ref option is what tells Mongoose which model to use during populatio
