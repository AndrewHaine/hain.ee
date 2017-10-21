const express = require('express');
const router = express.Router();
const homePageController = require('../controllers/homePageController');
const urlHandlers = require('../controllers/urlHandlers');
const {catchErr} = require('../middleware/errHandlers');

// Routes
router.get('/', homePageController.index);

router.post('/addURL', urlHandlers.addURL);
router.post('/getURLMeta', urlHandlers.getURLMeta);
router.get('/:id', catchErr(urlHandlers.checkRedirect));

module.exports = router;
