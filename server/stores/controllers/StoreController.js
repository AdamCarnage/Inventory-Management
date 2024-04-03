const jwt = require('jsonwebtoken');
const token_config = require('../../config/token');

const Store = require('../../stores/models/Store');

const StoreController = {
    async create_store(req, res) {
        const token = req.headers.authorization.split(" ")[1];
         // Decode token to obtain user ID
         const decodedToken = jwt.verify(token, token_config.token.jwt_secret);
         const userId = decodedToken.userId;

        const newStore = new Store({
            name: req.body.name,
            address: req.body.address,
            street: req.body.street,
            city: req.body.city,
            country: req.body.country,
            user: userId
        });
        try {
            const existingStore = await Store.findOne({ name: newStore.name, street:newStore.street})
            if (existingStore) {
                res.status(400).json({
                    type: "error",
                    message: "Store with this name in this street  already exists"
                });
            } else {
                const store = await newStore.save();
                res.status(201).json({
                    type: "success",
                    message: "Store created successfully",
                    store
                });
            }
        } 
        catch (error) {
            res.status(400).json({
                type: "error",
                message: "Something went wrong please try again",
                error
            });
        }
    },

    async get_stores(req, res) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, token_config.token.jwt_secret);
            userId = decodedToken.userId;

            const stores = await Store.find({ user: { $in: [userId] } });
            res.status(200).json({
                type: "success",
                stores
            });
        } catch (error) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                error
            });
        }
    },


    async update_store(req, res) {
        const existing = await Store.findById(req.params.id);
        if (!existing) {
            res.status(404).json({
                type: "error",
                message: "Store doesn't exists"
            });
        } else {
            try {
                const updatedStore = await Store.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                },
                    { new: true }
                );
                res.status(200).json({
                    type: "success",
                    message: "Store updated successfully",
                    updatedStore
                });
            } catch (error) {
                res.status(500).json({
                    type: "error",
                    message: "Something went wrong please try again",
                    error
                });
            }
        }
    },

    async delete_store(req, res) {
        const existing = await Store.findById(req.params.id);
        if (!existing) {
            res.status(200).json({
                type: "error",
                message: "Store doesn't exists"
            });
        } else {
            try {
                await Store.findOneAndDelete(req.params.id);
                res.status(200).json({
                    type: "success",
                    message: "Store has been deleted successfully"
                });
            } catch (error) {
                res.status(500).json({
                    type: "error",
                    message: "Something went wrong please try again",
                    error
                });
            }
        }
    }
}

module.exports = StoreController;

