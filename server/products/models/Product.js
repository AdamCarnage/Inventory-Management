const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit_price: {
        type: Number,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Array,
    },
    manufactured_date:{
        type: Date,
    },
    expired_date:{
        type: Date,
    }
} , { timestamps: true})

module.exports = mongoose.model('Product', ProductSchema);