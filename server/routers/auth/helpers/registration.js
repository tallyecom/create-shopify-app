const Shop = require("../../../models/shop");
const nonceCreate = require("nonce")();

const registration = async (shop, serialNum, isFreePlan) => {
  let nonce = nonceCreate();
  try {
    await Shop.updateOne(
      { shop: shop },
      { shop: shop, serial: serialNum, isFreePlan: isFreePlan },
      { upsert: true }
    );
  } catch (error) {
    console.log("Error while adding Nonce to Database: ", error);
    return false;
  }
  return (
    "https://" +
    shop +
    ".myshopify.com/admin/oauth/authorize?client_id=" +
    SHOPIFY_API_KEY +
    "&scope=" +
    SCOPES +
    "&redirect_uri=" +
    SHOPIFY_REDIRECT_URI +
    "&state=" +
    nonce
  );
};

module.exports = registration;
