const express = require('express');
const router = express.Router();
const { testZoomIntegration } = require('../controllers/zoomController');

router.post('/test', testZoomIntegration);

module.exports = router;