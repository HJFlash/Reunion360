const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, requireRole('organizador'), createEvent);
router.post('/', verifyToken, createEvent);
router.get('/', getEvents);

module.exports = router;