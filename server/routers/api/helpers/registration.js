const Shop = require("../../../models/shop");
const nonceCreate = require("nonce")();

const registration = async (
  shop,
  serialNum,
  isPrime,
  isPlanActive,
  planNearExp,
  isFreePlan,
  isFPAOnce,
  isOrderPlan,
  isMonthlyPlan,
  orderRecLimit,
  productLimit,
  imageLimit,
  icCharged,
) => {
  let nonce = nonceCreate();
  try {
    let doc = await Shop.updateOne(
      { shop: shop },
      {
        shop: shop,
        serial: serialNum,
        tallyPrime: isPrime,
        isPlanActive: isPlanActive,
        planNearExp: planNearExp,
        isFreePlan: isFreePlan,
        isFPAOnce: isFPAOnce,
        isOrderPlan: isOrderPlan,
        isMonthlyPlan: isMonthlyPlan,
        orderRecLimit: orderRecLimit,
        productLimit: productLimit,
        imageLimit: imageLimit,
        icCharged: icCharged,
      },
      { upsert: true }
    );
    return doc
    // console.log(doc);
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
