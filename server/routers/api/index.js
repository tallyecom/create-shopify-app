const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const registration = require("./helpers/registration");
const process = require("./helpers/process");
const serialDetail = require("./helpers/serialdetail");
const plan = require("./helpers/plan");
const planByID = require("./helpers/planbyid");
const planchange = require("./helpers/planchange")
const Path = require("path");

//api authentication
// api.use(authApiRequest);

//Api Routes
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
      orderRecLimit: shopResult.orderRecLimit,
      productLimit: shopResult.productLimit,
      imageLimit: shopResult.imageLimit,
      isPlanActive: shopResult.isPlanActive,
      process: shopResult.process,
      isFPAOnce: shopResult.isFPAOnce,
      icCharged: shopResult.icCharged,
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

api.post("/planchange", async (req, res) => {

  try {
    let planchange = await process(
      req.body.shop
        .replace("https://", "")
        .replace("http://", "")
        .split(".")[0],
      req.body.planchange
    );
  } catch (e) {
    console.log(e);
  }
  res.status(200).send("Process Addedd successfully");
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
      req.body.icCharged
    );
    // if (registrationRes) console.log(registrationRes);
  } catch (e) {
    console.log(e);
  }
  res.status(200).send("Addedd successfully");
});
module.exports = api;
