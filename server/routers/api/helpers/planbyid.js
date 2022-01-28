const Plan = require("../../../models/plan");

const planbyid = async (id) => {
    try {
        let doc = await Plan.findOne(id);
        if (doc) {
            // console.log("Plan Details retrived from server :: ", doc);
            return doc;
        }
    } catch (error) {
        console.log(
            "Error while fetching Registered serial from Database: ",
            error
        );
        return false;
    }
};

module.exports = planbyid;
