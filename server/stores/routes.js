const express = require('express');
const router = express.Router();

const StoreController = require('./controllers/StoreController');

router.get('/', StoreController.get_stores);
router.post('/', StoreController.create_store);
router.put('/:id', StoreController.update_store);
router.delete('/:id', StoreController.delete_store);

module.exports = router;