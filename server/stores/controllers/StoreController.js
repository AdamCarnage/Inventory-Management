const Store = require('../../stores/models/Store');


const StoreController = {
    async create_store(req, res) {
        const newStore = new Store({
            name: req.body.name,
            address: req.body.address,
            street: req.body.street,
            city: req.body.city,
            country: req.body.country,
            user: req.body.user
        });
        try {
            const store = await newStore.save();
            res.status(201).json({
                type: "success",
                message: "Store created successfully",
                store
            });
        } catch (error) {
            res.status(400).json({
                type: "error",
                message: "Something went wrong please try again",
                error
            });
        }
    },

    async get_stores(req, res) {
        try {
            const stores = await Store.find({userid: req.user._id}); 
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

