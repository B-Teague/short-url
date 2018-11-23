const express = require('express');
const router = express.Router();

// Require controller modules.
const newUrlController = require('../controllers/newUrlController');
const shortUrlController = require('../controllers/shortUrlController');

router.post('/new', newUrlController.CREATE_SHORT_URL);
router.get('/:shortUrl', shortUrlController.REDIRECT_URL);

module.exports = router;