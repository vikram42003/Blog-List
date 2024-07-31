const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  if (request.body.password && request.body.password.length < 3) {
    let newError = new Error("Password is too short");
    newError.name = "ValidationError";
    throw newError;
  }

  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    password: request.body.password && await bcrypt.hash(request.body.password, 10),
  });

  const userToReturn = await newUser.save();

  response.status(201).json(userToReturn);
});

module.exports = usersRouter;
