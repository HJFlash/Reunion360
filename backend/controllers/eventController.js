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

const attendEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.uid; // viene del token JWT
  const userEmail = req.user.email; // si es que se llega a incluir el email en el token

  try {
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const eventData = eventDoc.data();
    const attendees = eventData.attendees || [];

    // verificamos si el usuario ya está inscrito
    const alreadyAttending = attendees.some(a => a === userId);
    if (alreadyAttending) {
      return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
    }

    // Agregamos al usuario
    attendees.push(userId);

    await eventRef.update({ attendees });

    res.status(200).json({ message: 'Asistencia confirmada' });
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    res.status(500).json({ error: 'Error al confirmar asistencia' });
  }
};

module.exports = { createEvent, getEvents, attendEvent };