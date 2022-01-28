const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
    id: { type: String, index: true, unique: true },
    name: { type: String, unique: true },
    monthlyPrice: Number,
    annualPrice: Number,
    orderPrice: Number,
    productPrice: Number,
    imagePrice: Number,
    numOrders: Number,
    numProducts: Number,
    numImages: Number,
})

const Plandetail = mongoose.models.planSchema || mongoose.model("plan", planSchema);

module.exports = Plandetail;