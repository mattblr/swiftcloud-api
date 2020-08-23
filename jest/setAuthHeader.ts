const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);

export const setAuthHeader = async () => {
  const user = await request
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
    .set("Accept", "application/json");

  const res = await request
    .post("/graphql")
    .send({
      query: `{login(email: "${user.body.data.createUser.email}", password: "Password") {
            userId
            token
            email
            tokenExpiration
          }
        }`,
    })
    .set("Accept", "application/json");

  return res.body.data.login.token;
};

export const setKeyHeader = async () => {
  const token = await setAuthHeader();
  const res = await request
    .post("/graphql")
    .send({
      query: `mutation{
            createAPIKey{
              key
            }
          }`,
    })
    .auth(token, { type: "bearer" })
    .set("Accept", "application/json");

  return res.body.data.createAPIKey.key;
};
