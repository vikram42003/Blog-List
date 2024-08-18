const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    let error = new Error("username or password are missing");
    error.name = "NotAuthorized";
    throw error;
  }

  const user = await User.findOne({ username });

  const isPasswordCorrect = !user ? null : await bcrypt.compare(password, user.password);

  if (!user || !isPasswordCorrect) {
    let error = new Error("username or password is incorrect");
    error.name = "NotAuthorized";
    throw error;
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({ token, username: user.username, name: user.name, });
});

module.exports = loginRouter;
