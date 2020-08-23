export {};
const app = require("../src/app");
const supertest = require("supertest");
const dbHandler = require("../jest/dbHandler");

const request = supertest(app);
const { setAuthHeader } = require("../jest/setAuthHeader");

describe("Api key creation and regen", () => {
  let token: String;
  beforeAll(async () => {
    token = await setAuthHeader();
  });

  afterAll(async () => await dbHandler.closeDatabase());

  let firstAPIKey: String;
  let secondAPIKey: String;

  it("creates an api key", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation{createAPIKey{key}}`,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.createAPIKey.key).toBeDefined;
        firstAPIKey = res.body.data.createAPIKey.key;
        done();
      });
  });

  it("regenerates a new api key", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation {
            generateNewAPIKey(password:"Password")
          }`,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.generateNewAPIKey).toBeDefined;
        expect(res.body.data.generateNewAPIKey).not.toEqual(firstAPIKey);
        secondAPIKey = res.body.data.generateNewAPIKey;
        done();
      });
  });

  it("retrieves latest api key", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `{
            retrieveAPIKey
          }
          `,
      })
      .auth(token, { type: "bearer" })
      .set({
        Accept: "application/json",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.retrieveAPIKey).toBeDefined;
        expect(res.body.data.retrieveAPIKey).not.toEqual(firstAPIKey);
        expect(res.body.data.retrieveAPIKey).toEqual(secondAPIKey);
        done();
      });
  });
});
