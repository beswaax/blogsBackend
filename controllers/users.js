require("dotenv").config();
const usersRouter = require("express").Router();
const User = require("../models/userSchema");
const Blog = require("../models/blogs");
const bcrypt = require("bcrypt");
const jwt = require("express-jwt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    likes: 1,
  });
  response.status(200).json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const passwordHash = await bcrypt.hash(body.password, 10);

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  response.status(200).json(savedUser);
});

module.exports = usersRouter;
