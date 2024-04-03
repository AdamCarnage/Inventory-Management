const express = require('express');
const router = express.Router();

const  ProductController  = require('./controllers/ProductController');

router.get('/:storeId', ProductController.get_products);
router.get('/:id/:storeId', ProductController.get_product);
router.post('/:storeId', ProductController.create_product);
router.put('/:id/:storeId', ProductController.update_product);
router.delete('/:id/:storeId', ProductController.delete_user);

module.exports = router;

