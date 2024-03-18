const { productPriceUnits } = require("../../config/config");
module.exports = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    quantity: {
      type: "string",
    },
    price: {
      type: "number",
    },
    priceUnit: {
      type: "string",
      enum: Object.values(productPriceUnits),
    },
    expired_date: {
        type: "string",
        format: "date-time",
    },
    manufactured_date: {
        type: "string",
        format: "date-time",
    },
  },
  additionalProperties: false,
};