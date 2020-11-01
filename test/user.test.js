const app = require("../app");

const supertest = require("supertest");
const request = supertest(app);
const auth = {};

describe("Phase 1 - USER", function () {
  it("Enpoint test", async (done) => {
    let response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("IT IS WORKING.");

    done();
  });

  it("Register test with no data", async (done) => {
    let register_data = {};
    let result = await request.post("/users").send(register_data);
    expect(result.status).toEqual(400);
    done();
  });

  it("Register test with invalid email", async (done) => {
    let register_data = {
      email: "mymail@emailcom",
      password: "password1234",
      fullname: "My Name Is",
    };
    let result = await request.post("/users").send(register_data);
    expect(result.status).toEqual(400);
    done();
  });

  it("Register test", async (done) => {
    let register_data = {
      email: "mymail@email.com",
      password: "password1234",
      fullname: "My Name Is",
    };
    let result = await request.post("/users").send(register_data);
    expect(result.status).toEqual(200);
    done();
  });
});

describe("Phase 2 - USER", function () {
  var new_password = "1234567";
  var old_password = "password1234";

  const login_data = {
    email: "mymail@email.com",
    password: old_password,
  };

  const change_password_data = {
    email: "mymail@email.com",
    new_password: new_password,
    password: old_password,
  };

  const new_login_data = {
    email: "mymail@email.com",
    password: new_password,
  };

  const update_data = {
    fullname: "EDITED NAME",
  };

  beforeAll(async (done) => {
    let result = await request.post("/users/login").send(login_data);
    auth.token = result.body.token;
    auth.user_id = result.body.user_id;
    done();
  });

  it("Token & User Id should not null", function (done) {
    expect(auth.token).not.toBeNull();
    expect(auth.user_id).not.toBeNull();
    done();
  });

  it("Access change password end point without token", function (done) {
    request
      .post("/users/change_password")
      .send(change_password_data)
      .expect(401, done);

    done();
  });

  it("Change password with no data", async (done) => {
    let data = {};
    let result = await request
      .post("/users/change_password")
      .send(data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(400);
    done();
  });

  it("Change password", async (done) => {
    let result = await request
      .post("/users/change_password")
      .send(change_password_data)
      .set("Authorization", "Bearer " + auth.token);
    expect(result.status).toEqual(200);
    done();
  });

  it("Login After Change Password", async (done) => {
    let result = await request.post("/users/login").send(new_login_data);
    auth.token = result.body.token;
    auth.user_id = result.body.user_id;
    done();
  });

  it("Update Fullname Field", async (done) => {
    const result = await request
      .put("/users/" + auth.user_id)
      .set("Authorization", "Bearer " + auth.token)
      .send(update_data);
    let Obj = result.body;
    expect(result.status).toEqual(200);
    expect(Obj).toHaveProperty("fullname");
    expect(Obj).toHaveProperty("id");
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
