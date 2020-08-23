export {};

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");
const graphqlHttp = require("express-graphql");

const isAuth = require("./middleware/middleware");
const keyAuth = require("./middleware/middleware");
const app = express();

const graphqlSchema = require("./graphql/schema/index");
const graphqlResovlers = require("./graphql/resolvers/index");

const dbHandler = require("../jest/dbHandler");

const path = require("path");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.set("json spaces", 2);

app.use(
  "/graphql",
  keyAuth,
  isAuth,
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResovlers,
    graphiql: true,
  })
);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

process.env.NODE_ENV === "test"
  ? dbHandler.connect().then(() => {
      if (!module.parent) {
        app.listen(process.env.PORT);
      }
    })
  : mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-buzuz.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
      )
      .then(() => {
        app.listen(process.env.PORT);
      })
      .catch((err: Error) => {
        console.log(err);
      });

module.exports = app;
