const express = require('express');
const router = express.Router();

// Require controller modules.
const indexController = require('../controllers/index');

router.get('/', indexController.HOMEPAGE);

module.exports = router;