const { db } = require('../utils/firebase');

const createEvent = async (req, res) => {
  try {
    const newEvent = req.body;
    const docRef = await db.collection('events').add(newEvent);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

const getEvents = async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

module.exports = { createEvent, getEvents };