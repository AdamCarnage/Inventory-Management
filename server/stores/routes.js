const express = require('express');
const router = express.Router();

const StoreController = require('./controllers/StoreController');
const isautheticated = require('../middleware/IsAutheticatedMiddleware');

router.get(
    '/',
    [isautheticated.check],        
    StoreController.get_stores);

router.post(
    '/', 
    [isautheticated.check],
    StoreController.create_store);

router.put(
    '/:id', 
    [isautheticated.check],
    StoreController.update_store);

router.delete(
    '/:id',
    [isautheticated.check],
    StoreController.delete_store);

module.exports = router;