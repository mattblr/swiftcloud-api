export {};
const app = require("../src/app");
const dbHandler = require("../jest/dbHandler");
const supertest = require("supertest");

const request = supertest(app);

describe("authentication", () => {
  let token: String;

  afterAll(async () => await dbHandler.closeDatabase());

  it("creates test user", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation{
            createUser(userInput:{email:"test@user.com",password:"Password",name:"Test User"}){
              _id
              email
              password
              name
            }
          }`,
      })
      .auth(token, { type: "bearer" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.createUser.email).toBe("test@user.com");
        done();
      });
  });
  it("logs user in", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{login(email: "test@user.com", password: "Password") {
              userId
              token
              email
              tokenExpiration
            }
          }`,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.login.email).toBe("test@user.com");
        token = res.body.data.login.token;
        done();
      });
  });

  it("changes user password", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation{
            changePassword(password:"Password",newPassword:"NewPassword")
          }`,
      })
      .auth(token, { type: "bearer" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.changePassword).toBe("Password changed");
        done();
      });
  });
});
