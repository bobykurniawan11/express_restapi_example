const app = require("../app");

const supertest = require("supertest");
const request = supertest(app);

const register_data_1 = {
  email: "dummy_email_1@email.com",
  password: "email1234",
  fullname: "Dummy User 1",
};

const register_data_2 = {
  email: "dummy_email_2@email.com",
  password: "email1234",
  fullname: "Dummy User 2",
};

let user_id_1 = null;
let user_id_2 = null;

const login_data_1 = {
  email: "dummy_email_1@email.com",
  password: "email1234",
};

const login_data_2 = {
  email: "dummy_email_2@email.com",
  password: "email1234",
};

describe("Phase 1 - Registering user", function () {
  it("Register Dummy No 1", async (done) => {
    let result = await request.post("/users").send(register_data_1);
    expect(result.status).toEqual(200);
    user_id_1 = result.body.id;
    done();
  });

  it("Register Dummy No 2", async (done) => {
    let result = await request.post("/users").send(register_data_2);
    expect(result.status).toEqual(200);
    user_id_2 = result.body.id;

    done();
  });
});

describe("Add Friend Request", function () {
  const auth = {};

  beforeAll(async (done) => {
    let result = await request.post("/users/login").send(login_data_1);
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

  it("Add friend request with invalid data", async (done) => {
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
      friend_id: user_id_2,
      created_date: new Date(),
    };
    let result = await request
      .post("/user_friend_request")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    done();
  });
  it("Delete User", async (done) => {
    const result = await request
      .delete("/users/" + auth.user_id)
      .set("Authorization", "Bearer " + auth.token);
    let Obj = result.body;
    expect(Obj).toHaveProperty("message");
    expect(result.status).toEqual(200);
    done();
  });
});

describe("Accept Friend Request", function () {
  const auth = {};
  beforeAll(async (done) => {
    let result = await request.post("/users/login").send(login_data_2);
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
      user_id: user_id_1,
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
  it("Delete User", async (done) => {
    const result = await request
      .delete("/users/" + auth.user_id)
      .set("Authorization", "Bearer " + auth.token);
    let Obj = result.body;
    expect(Obj).toHaveProperty("message");
    expect(result.status).toEqual(200);
    done();
  });

  it("Delete User Friends", async (done) => {
    const result = await request
      .delete("/user_friend/" + auth.user_id)
      .set("Authorization", "Bearer " + auth.token);
    let Obj = result.body;
    expect(result.status).toEqual(200);
    done();
  });
});
