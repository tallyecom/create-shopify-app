const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processSchema = new Schema({
  id: { type: String, index: true, unique: true },
  date: Date,
  type: String,
  processid: String,
  status: String,
  url: String,
  systemName: String,
});

const planSchema = new Schema({
  id: { type: String, index: true, unique: true },
  key: String,
  isSelected: Boolean,
  name: String,
  monthlyPrice: Number,
  annualPrice: Number,
  orderPrice: Number,
  productPrice: Number,
  imagePrice: Number,
  numOrders: Number,
  numProducts: Number,
  numImages: Number,
})
const planLimitSchema = new Schema({
  id: { type: String, index: true, unique: true },
  name: String,
  returnUrl: String,
  lineItems: [{
    plan: {
      appRecurringPricingDetails: {
        price: {
          amount: Number, currencyCode: String
        },
        date: Date,
        orderLimit: Number,
        productLimit: Number,
        imageLimit: Number,
      }
    }
  }]
})

const appSubscriptionSchema = new Schema({
  id: { type: String, index: true, unique: true },
  name: String,
  returnUrl: String,
  lineItems: [{
    plan: {
      appRecurringPricingDetails: {
        price: {
          amount: Number, currencyCode: String
        }, interval: String
      }
    }
  }]
})

const shopSchema = new Schema({
  shop: { type: String, required: true },
  accessToken: { type: String, default: null },
  serial: {
    type: Number,
    min: [700000000, "Serial Number starts with 7"],
    max: [800000000, "Invalid Serial Number"],
    validate: {
      validator: function (v) {
        return v % 9 === 0;
      },
    },
  },
  scopes: { type: String, default: null },
  isInstalled: { type: Boolean, default: false },
  installedOn: { type: Date, default: Date.now() },
  uninstalledOn: { type: Date, default: null },
  nonce: { type: String, default: null },
  webhooks: { type: Object, default: {} },
  info: { type: Object, default: {} },
  process: { type: [processSchema], default: [] },
  isMonthlyPlan: { type: Boolean, default: false },
  isOrderPlan: { type: Boolean, default: false },
  isFreePlan: { type: Boolean, default: false },
  isFPAOnce: { type: Boolean, default: false },
  icCharged: { type: Boolean, default: false },
  // appSubscription: [appSubscriptionSchema],
  // activePlan: [planSchema],
  // planLimits: [planLimitSchema],
  tallyPrime: { type: Boolean, default: false },
  orderRecLimit: { type: Number, default: null },
  productLimit: { type: Number, default: null },
  imageLimit: { type: Number, default: null },
  isPlanActive: { type: Boolean, default: false },
  planChangeDate: { type: Date },
  planExpiryDate: { type: Date },
});

const Shop = mongoose.models.shop || mongoose.model("shop", shopSchema);

module.exports = Shop;
