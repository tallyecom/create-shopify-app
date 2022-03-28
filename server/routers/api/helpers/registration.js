const Shop = require("../../../models/shop");
// const nonceCreate = require("nonce")();

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
  // orderRecLimit,
  // productLimit,
  // imageLimit,
  icCharged,
  planChangeDate,
  planExpiryDate,
  planID
) => {
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
        // orderRecLimit: orderRecLimit,
        // productLimit: productLimit,
        // imageLimit: imageLimit,
        icCharged: icCharged,
        planChangeDate: planChangeDate,
        planExpiryDate: planExpiryDate,
        planID: planID,
      },
      { upsert: true }
    );
    return doc
  } catch (error) {
    console.log("Error while adding Nonce to Database: ", error);
    return false;
  }
};

module.exports = registration;
