const { db } = require('../utils/firebase');

const createEvent = async (req, res) => {
  const { topic, start_time, duration } = req.body;

  if (!topic || !start_time || !duration) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // En vez de crear reunión en Zoom, generamos un link simulado
    const fakeJoinUrl = `https://reunion360.fake/join/${Date.now()}`;

    const newEvent = {
      topic,
      start_time,
      duration,
      join_url: fakeJoinUrl,
      start_url: 'https://reunion360.fake/start',
      createdAt: new Date().toISOString(),
      organizerId: req.user.uid,
      attendees: []
    };

    const docRef = await db.collection('events').add(newEvent);

    res.status(201).json({
      message: 'Evento simulado creado correctamente',
      id: docRef.id,
      join_url: fakeJoinUrl
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
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

const getMyEvents = async (req, res) => {
  try {
    const snapshot = await db
      .collection('events')
      .where('organizerId', '==', req.user.uid)
      .get();

    const myEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(myEvents);
  } catch (error) {
    console.error('Error al obtener mis eventos:', error);
    res.status(500).json({ error: 'Error al obtener tus eventos' });
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

//------------Controllers de stat------------//

const getEventStats = async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const eventos = snapshot.docs.map(doc => doc.data());

    const totalEventos = eventos.length;

    const totalAsistentes = eventos.reduce((acc, e) => {
      const attendees = e.attendees || [];
      return acc + attendees.length;
    }, 0);

    const eventosPorMes = {};

    eventos.forEach(evento => {
      const fecha = new Date(evento.createdAt);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!eventosPorMes[mes]) eventosPorMes[mes] = 0;
      eventosPorMes[mes]++;
    });

    res.json({
      totalEventos,
      totalAsistentes,
      eventosPorMes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  attendEvent,
  getEventStats,
  getMyEvents
};