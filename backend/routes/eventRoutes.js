const express = require('express');
const router = express.Router();
const { createEvent, 
        getEvents,
        attendEvent 
    } = require('../controllers/eventController');

const verifyToken = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, requireRole('organizador'), createEvent);
router.get('/', getEvents);

router.post('/:id/attend', verifyToken, attendEvent);

module.exports = router;