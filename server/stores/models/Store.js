const mongoose = require('mongoose');
const {User} = require('../../users/models/User');
const Product = require('../../products/models/Product');

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
    }]
} , { timestamps: true})

module.exports = mongoose.model('Store', StoreSchema);