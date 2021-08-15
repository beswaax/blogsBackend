const blogsRouter = require("express").Router();
const BlogCollection = require("../models/blogs");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  let blogs = await BlogCollection.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.status(200).json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user = await User.findById(decodedToken.id); // made a change here recently,may not work

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = new BlogCollection({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  const savedBlog = await blog.save();

  user.notes = user.notes.concat(blog);
  user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  let id = request.params.id;
  await BlogCollection.findByIdAndDelete(id);
  response.status(400).end();
});

blogsRouter.put("/:id", async (request, response) => {
  await BlogCollection.findByIdAndUpdate(request.params.id, request.body);
  response.status(201).json(request.body);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await BlogCollection.findById(request.params.id);
  response.status(200).json(blog);
});

module.exports = blogsRouter;
