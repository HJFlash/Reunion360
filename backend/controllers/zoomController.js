const { createZoomMeeting } = require('../services/zoomService');

const testZoomIntegration = async (req, res) => {
  const { hostEmail, topic } = req.body;

  if (!hostEmail) {
    return res.status(400).json({ error: 'Se requiere hostEmail' });
  }

  try {
    const meeting = await createZoomMeeting(hostEmail, topic || 'Reunión de prueba');
    res.status(200).json({
      message: 'Reunión de Zoom creada exitosamente',
      join_url: meeting.join_url,
      start_url: meeting.start_url,
    });
  } catch (error) {
    console.error('Error al probar Zoom:', error);
    res.status(500).json({ error: 'No se pudo crear la reunión de prueba' });
  }
};

module.exports = { testZoomIntegration };