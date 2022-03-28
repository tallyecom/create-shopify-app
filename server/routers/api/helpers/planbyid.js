const Plan = require("../../../models/plan");

const planbyid = async (id) => {
    try {
        let doc = await Plan.findOne(id);
        if (doc) {
            // console.log("Plan Details retrived from server :: ", doc.name == "Free");
            return doc;
        }
    } catch (error) {
        console.log(
            "Error while fetching plan detail from Database: ",
            error
        );
        return false;
    }
};

module.exports = planbyid;
