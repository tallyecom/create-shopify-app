const Shop = require("../../../models/shop");

const planChange = async (shop, plan) => {
  // let nonce = nonceCreate();
  let fpa
  fpa = (plan.name.includes('Free'));
  console.log(plan.name)
  let lpe = plan.planExpiry
  let doc
  if (fpa) {
    try {
      doc = await Shop.findOneAndUpdate({ shop: shop }, { isFPAOnce: (plan.name.includes('Free')), isFreePlan: (plan.name.includes('Free')), isOrderPlan: (plan.name.includes('Order Based Plan')), isMonthlyPlan: (plan.name.includes('Periodic Plan')), lpe: lpe, $push: { plans: plan } }, { returnNewDocument: true });
    } catch (error) {
      console.log("Error while updating plan change to Database: ", error);
      return false;
    }
  } else {
    try {
      doc = await Shop.findOneAndUpdate({ shop: shop }, { lpe: lpe, $push: { plans: plan } }, { returnNewDocument: true });
    } catch (error) {
      console.log("Error while updating plan change to Database: ", error);
      return false;
    }
  }
  return (doc)
}
module.exports = planChange;
