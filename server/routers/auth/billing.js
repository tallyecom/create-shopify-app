const axios = require("axios");
const Shop = require("../../models/shop");
const getSubscriptionUrl = require("./helpers/getSubscriptionUrl").default;

const billing = async (req, res) => {
    console.log(
        'billing request :: ', req);
}

module.exports = billing;