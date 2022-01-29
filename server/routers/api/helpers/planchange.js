const Shop = require("../../../models/shop");
const nonceCreate = require("nonce")();

const planChange = async (shop, planchange) => {
  let nonce = nonceCreate();
  try {
    await Shop.findOneAndUpdate(
      { shop: shop },
      { $push: { activePlan: { planchange, nonce } } },
      { returnNewDocument: true },
    );
  } catch (error) {
    console.log("Error while updating plan change to Database: ", error);
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

module.exports = planChange;
