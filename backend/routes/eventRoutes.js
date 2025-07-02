const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { 
    createEvent, 
    getEvents,
    attendEvent,
    getEventStats
    } = require('../controllers/eventController');

router.post('/', verifyToken, requireRole('organizador'), createEvent);
router.get('/', getEvents);
router.post('/:id/attend', verifyToken, attendEvent);
router.get('/stats', verifyToken, requireRole('organizador'), getEventStats);

module.exports = router;