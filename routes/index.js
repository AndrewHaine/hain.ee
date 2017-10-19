const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/homePageController');
const urlHandlers = require('../controllers/urlHandlers');

// Routes
router.get('/', homePageController.index);

router.post('/addURL', urlHandlers.addURL);
router.post('/getURLMeta', urlHandlers.getURLMeta);
router.get('/:id', urlHandlers.checkRedirect);

module.exports = router;
