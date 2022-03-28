const { createApp } = require("@shopify/app-bridge");
const { getSessionToken } = require("@shopify/app-bridge-utils");
const axios = require("axios");
const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const registration = require("./helpers/registration");
const process = require("./helpers/process");
const serialDetail = require("./helpers/serialdetail");
const plan = require("./helpers/plan");
const planByID = require("./helpers/planbyid");
const planchange = require("./helpers/planchange")
const Path = require("path");
const { resolve } = require("path");
require("dotenv").config()
const { GraphQLClient, gql } = require('graphql-request')
const ONETIME_CREATE = require("./helpers/apppurchaseonetime")


//api authentication
// api.use(authApiRequest);

//Api Routes
api.get("/graphql.json", (req, res) => {
  try {
    var shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];
    var appplanchange = ONETIME_CREATE()
    let data = { appplanchange }
    res.json({ success: true, data }).status(200);
  } catch { e => console.log(e) }
});

api.get("/1", (req, res) => {
  res.json({ hi: "from first api" });
});
api.get("/2", (req, res) => {
  res.json({ hi: "from second api" });
});

api.get("/TCP", function (req, res, next) {
  const options = {
    root: Path.join(__dirname, "TCP"),
    dotfiles: "deny",
    headers: { "x-timestamp": Date.now(), "x-sent": true },
  };

  const fileName = req.query.name;
  res.download("server/routers/api/TCP/" + fileName)
});

api.get("/plans", async (req, res) => {
  // console.log(req.url);
  try {
    var shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];
    var planDetail = await plan({});
    // console.log({ planDetail });
    let data = { planDetail }
    res.json({ success: true, data }).status(200);
  } catch (e) {
    console.log(e);
    res.json({ success: false }).status(500);
  }
});

api.get("/plans/:_id", async (req, res) => {
  // console.log(req.url);
  // console.log(req.params._id);
  try {
    let id = req.params._id
    var shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];
    var planDetail = await planByID({ id });
    // console.log({ planDetail });
    let data = { planDetail }
    res.json({ success: true, data }).status(200);
  } catch (e) {
    console.log(e);
    res.json({ success: false }).status(500);
  }
})

api.get("/shop", async (req, res) => {
  try {
    var shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];
    var shopResult = await serialDetail({ shop });
    let data = {
      serial: shopResult.serial,
      isPrime: shopResult.tallyPrime,
      isFreePlan: shopResult.isFreePlan,
      accessToken: shopResult.accessToken,
      isMonthlyPlan: shopResult.isMonthlyPlan,
      isOrderPlan: shopResult.isOrderPlan,
      installedOn: shopResult.installedOn,
      // orderRecLimit: shopResult.orderRecLimit,
      // productLimit: shopResult.productLimit,
      // imageLimit: shopResult.imageLimit,
      isPlanActive: shopResult.isPlanActive,
      process: shopResult.process,
      isFPAOnce: shopResult.isFPAOnce,
      icCharged: shopResult.icCharged,
      planChangeDate: shopResult.planChangeDate,
      planExpiryDate: shopResult.planExpiryDate,
      plans: shopResult.plans
    };
    res.json({ success: true, data }).status(200);
  } catch (e) {
    console.log(e);
    res.json({ success: false }).status(500);
  }
  // res.json(shopResult);
});

api.post("/process", async (req, res) => {
  try {
    let processRes = await process(
      req.body.shop
        .replace("https://", "")
        .replace("http://", "")
        .split(".")[0],
      req.body.process
    );
  } catch (e) {
    console.log(e);
  }
  res.status(200).send("Process Addedd successfully");
});
const modifyPlanBody = async (req, res, next) => {
  // console.log(req.body);
  let shop = req.body.shop.replace("https://", "").replace("http://", "").split(".")[0]
  var plan = await planByID({ "_id": req.body.planID });
  // console.log("plan :: ", plan)
  var shopResult = await serialDetail({ shop });
  let d, e
  if (shopResult.lpe == null) {
    d = new Date()
    d.setHours(0, 0, 0, 0)
  } else {
    d = new Date(shopResult.lpe)
    d.setHours(0, 0, 0, 0)
  }
  if (shopResult.lpe == null) {
    e = new Date()
    e.setHours(0, 0, 0, 0)

  } else {
    e = new Date(shopResult.lpe)
    e.setHours(0, 0, 0, 0)
  }
  req.body.name = plan.name
  req.body.monthlyPrice = plan.monthlyPrice
  req.body.annualPrice = plan.annualPrice
  req.body.orderPrice = plan.orderPrice
  req.body.productPrice = plan.productPrice
  req.body.imagePrice = plan.imagePrice
  // req.body.isFreePlan = (plan.name == 'Free')
  // req.body.isOrderPlan = (plan.name == 'Order Based Plan')
  //  req.body.isMonthlyPlan =  (plan.name == 'Periodic Plan')
  // req.body.numOrders = plan.numOrders
  // req.body.numProducts = plan.numProducts
  // req.body.numImages = plan.numImages
  if (req.body.period == "1 Month") {
    req.body.activateFrom = d
    e.setMonth(e.getMonth() + 1)
    req.body.planExpiry = e
  }
  if (req.body.period == "1 Year") {
    req.body.activateFrom = d
    e.setMonth(e.getMonth() + 12)
    req.body.planExpiry = e
  }
  // console.log("Updated Request :: ", req.body);
  next()
}
api.post("/planchange", modifyPlanBody, async (req, res) => {
  try {
    let shop = req.body.shop.replace("https://", "").replace("http://", "").split(".")[0]
    // var plan = await planByID({ "_id": req.body.planID });
    await planchange(shop, req.body)
    await ONETIME_CREATE(req.headers.referer, req, shop)
    res.status(200).send("plan added successfully");
  } catch (e) {
    console.log(e);
  }
});
api.post("/regform", async (req, res) => {
  // console.log("data received while changing plan :: ", req.body);
  try {
    await registration(
      req.body.shop
        .replace("https://", "")
        .replace("http://", "")
        .split(".")[0],
      req.body.serialNumber,
      req.body.tallyPrime,
      req.body.isPlanActive,
      req.body.planNearExp,
      req.body.isFreePlan,
      req.body.isFPAOnce,
      req.body.isOrderPlan,
      req.body.isMonthlyPlan,
      req.body.orderRecLimit,
      req.body.productLimit,
      req.body.imageLimit,
      req.body.icCharged,
      req.body.planChangeDate,
      req.body.planExpiryDate,
      req.body.planID
    );
    // console.log(req.body.planID)
    // let data = {shop}
    // console.log(shop);
    // res.json(shop).status(200);
    // if (registrationRes) console.log(registrationRes);
  } catch (e) {
    console.log(e);
  }
  res.status(200).send("Addedd successfully");
});
module.exports = api;
