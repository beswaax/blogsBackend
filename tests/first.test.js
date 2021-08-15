const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const Blog = require("../models/mongo");
const { application } = require("express");
const api = supertest(app); // will return an object which can be used to make http requests

const outsideBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogs = outsideBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogs.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
describe("when there is initially some notes save", () => {
  test("expect to get all items", async () => {
    const blogs = await api.get("/blogs"); //this retunrns a promise, blogs are on .body

    expect(blogs.body.length).toEqual(outsideBlogs.length);
  });

  test("expect to contain id", async () => {
    const blogs = await api.get("/blogs");

    expect(blogs.body[0].id).not.toBe(undefined);
  });
});

describe("viewing a specific note", () => {
  test("expect to be able to add item", async () => {
    const newBlog = new Blog({
      title: "Good Troy",
      author: "Samuel Clintoc(of course)",
      url: "notherethatsforsure.com",
      likes: 1000,
    });

    await api
      .post("/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const allBlogs = await api.get("/blogs");
    expect(allBlogs.body[allBlogs.body.length - 1].title).toEqual("Good Troy");
  });

  test("expect error, false adress", async () => {
    const newBlog = {
      title: "Good Troy",
      author: "Samuel Clintoc(of course)",
      likes: 1000,
    };

    await api.post("/blogs").send(newBlog).expect(400);

    const allBlogs = await api.get("/blogs");
    expect(allBlogs.body.length).toEqual(outsideBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
//use await when you make a reust, get, send, delete etc.
