const express = require("express");
require("express-async-errors");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const tokenExtractor = require("./utils/tokenExtractor");

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");

logger.info("Connecting to", config.MONGODB_URL);
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch(error => {
    logger.error("Could not connect to MongoDB\n", error);
  });

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/reset", testingRouter);
}

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);
app.use(middleware.errorHandler);

module.exports = app;
