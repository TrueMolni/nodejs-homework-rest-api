const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const { DB_HOST_TEST } = process.env;
// const DB_HOST_TEST =
//   "mongodb+srv://Molni:4XViTn9csmAdhbvo@molni.kjubpv6.mongodb.net/contacts_reader_test?retryWrites=true&w=majority";

const app = require("../../app");
const { User } = require("../../models/user");

describe("test /api/auth/register route", () => {
  let server = null;
  beforeAll(async () => {
    server = app.listen(3000);
    await mongoose.connect(DB_HOST_TEST);
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  beforeEach(() => {});

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  test("test register route with correct data", async () => {
    const registerData = {
      name: "Sonic",
      email: "sonic@mail.com",
      password: "123456",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(registerData);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(registerData.name);
    expect(res.body.email).toBe(registerData.email);

    const user = await User.findOne({ email: registerData.email });
    expect(user.name).toBe(registerData.name);
  });

  test("test login route with correct data", async () => {
    const loginData = {
      email: "sonic@mail.com",
      password: "123456",
    };

    const res = await request(app).post("/api/auth/login").send(loginData);
    expect(res.statusCode).toBe(200);
    //   expect(res.body.email).toBe(loginData.email);
  });
});
