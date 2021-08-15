const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/userSchema");

loginRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({ username: body.username });
  console.log(body);

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid password or username" });
  }

  const userForToken = {
    username: body.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({ token, user: user.username, name: user.name });
});

module.exports = loginRouter;
