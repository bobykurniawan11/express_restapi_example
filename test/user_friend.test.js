const app = require("../app");

const supertest = require("supertest");
const request = supertest(app);

describe("Add Friend Request", function () {
  const auth = {};

  const login_data = {
    email: "dummy_email_1@email.com",
    password: "email1234",
  };
  beforeAll(async (done) => {
    let result = await request.post("/users/login").send(login_data);
    auth.token = result.body.token;
    auth.user_id = result.body.user_id;
    done();
  });

  it("Add friend request no data", async (done) => {
    let data = {};
    let result = await request
      .post("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(400);
    done();
  });

  it("Add friend request with unvalid data", async (done) => {
    let data = {
      user_id: auth.user_id,
      friend_id: auth.user_id,
      created_date: new Date(),
    };
    let result = await request
      .post("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(400);
    done();
  });

  it("Add Friend Request with valid data", async (done) => {
    let data = {
      user_id: auth.user_id,
      friend_id: 100,
      created_date: new Date(),
    };
    let result = await request
      .post("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    done();
  });
});

describe("Add Friend Request", function () {
  const auth = {};

  const login_data = {
    email: "dummy_email_2@email.com",
    password: "email1234",
  };
  beforeAll(async (done) => {
    let result = await request.post("/users/login").send(login_data);
    auth.token = result.body.token;
    auth.user_id = result.body.user_id;
    done();
  });

  it("Get friend request", async (done) => {
    let data = {
      user_id: auth.user_id,
    };
    let result = await request
      .get("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    let Obj = result.body;
    expect(Obj).toHaveProperty("friend_request_data");
    expect(Obj).toHaveProperty("data_count", 1);
    done();
  });

  it("Accept Friend request", async (done) => {
    let data = {
      user_id: "94",
      friend_id: auth.user_id,
    };
    let result = await request
      .post("/accept_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    let Obj = result.body;
    expect(Obj).toHaveProperty("friend_request_data");
    done();
  });

  it("Get friend List", async (done) => {
    let result = await request
      .get("/user_friend/" + auth.user_id)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    let Obj = result.body;
    expect(Obj).toHaveProperty("friend_request_data");
    expect(Obj).toHaveProperty("data_count", 1);
    done();
  });

  it("Get friend request", async (done) => {
    let data = {
      user_id: auth.user_id,
    };
    let result = await request
      .get("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    let Obj = result.body;
    expect(Obj).toHaveProperty("friend_request_data");
    expect(Obj).toHaveProperty("data_count", 0);
    done();
  });
});
