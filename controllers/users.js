const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/api/users", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/api/users", async (request, response) => {
  const newUser = new User({
    username: request.body.username,
    name: request.body.name,
    password: await bcrypt.hash(request.body.password, 10),
  });

  const userToReturn = await newUser.save();

  response.status(201).json(userToReturn);
});

module.exports = usersRouter;
