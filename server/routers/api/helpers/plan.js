const Plan = require("../../../models/plan");

const plans = async () => {
    try {
        let doc = await Plan.find();
        if (doc) {
            // console.log("Plan Details retrived from server :: ", doc);
            return doc;
        }
    } catch (error) {
        console.log(
            "Error while fetching plan details from Database: ",
            error
        );
        return false;
    }
};

module.exports = plans;
