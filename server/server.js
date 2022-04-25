/*
AIM: To create a basic FREE App to install on a shopify store wtih JWT authentication and with webhooks set for both shop/update and app/uninstalled. 

Basic overview of the app:
Database - MongoDB (You can also use MongoDB atlas)
Authentication - Shopify JWT

How to get started:
1. run "npm install" to install dependencies
2. update the environment variables on the .env file.
3. start a node server (npm run dev) and a ngrok instance 
4. update app urls (main and callbacks) on the partner dashboard.
  on main url use https://{hostname}/auth
  on callbacks use https://{hostname}/auth/callback
5. Install the app on a development store from your partner dashboard.

NOTE: For webhook to work according to this server.js, you need to setup the webhok url in evironment file to 
https://{{hostname}}/webhooks

*/

const express = require("express");
// import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
require('dotenv').config();
const Fs = require("fs");
const { graphqlHTTP } = require("express-graphql");
const schema = require('./schema/schema')
const cors = require('cors');
const Path = require("path");
const nextapp = require("next");
const server = express();

// const bodyParser = require("body-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextapp({ dev });
const handle = app.getRequestHandler();

require("./config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//init routes
const authRoutes = require("./routers/auth");
const apiRoutes = require("./routers/api");
const webhookRoutes = require("./routers/webhook");

//Serve static assets without auth
server.get("/_next/*", (req, res) => {
  return handle(req, res);
});

//Content Security Policy
server.use(function (req, res, next) {
  var shopurl;
  var fa;
  const allowedOrigins = ['https://www.youtube.com']
  const origin = req.headers.origin;

  if (req.query.shop !== "") {
    if (allowedOrigins.includes(origin)) { res.setHeader("Access-Control-Allow-Origin", origin); }
    shopurl = req.query.shop;
    fa = `frame-ancestors ${shopurl} admin.shopify.com`;
    res.setHeader("Content-Security-Policy", fa);
    // res.setHeader("Accept-CH", "Sec-CH-UA-Full-Version-List");
    // res.setHeader("Access-Control-Allow-Origin",);
    // res.setHeader("Access-Control-Allow-Origin", "https://8316-103-216-215-179.ngrok.io/*");
  }
  next();
});

//Authentication Url
server.use("/auth", authRoutes);

//Api Url
server.use("/api", express.json(), apiRoutes);

//Webhook Url
server.use(
  "/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Middleware for checking if shop param is present for all app page requests
const checkShop = require("./middleware/checkShop");

server.get("*", checkShop, (req, res) => {
  return handle(req, res);
});

// graphql setup
server.use('/graphql', graphqlHTTP({
  schema, graphiql: true
}))

// app.use('/graphql', graphqlController);
app
  .prepare()
  .then(() => {
    server.listen(port, () => {
      console.log(`Shopify app listening at http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

