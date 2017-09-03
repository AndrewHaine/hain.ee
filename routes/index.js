const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/homePageController');

// Routes
router.get('/', homePageController.index);

router.post('/addURL', homePageController.addURL);

module.exports = router;
