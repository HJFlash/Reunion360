const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

let zoomAccessToken = null;
let tokenExpiresAt = 0;

// Obtener token de acceso OAuth
const getZoomAccessToken = async () => {
  if (zoomAccessToken && Date.now() < tokenExpiresAt) {
    return zoomAccessToken;
  }

  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;
  const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    zoomAccessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

    return zoomAccessToken;
  } catch (error) {
    console.error('Error al obtener token de Zoom:', error.response.data);
    throw new Error('Error al autenticar con Zoom');
  }
};

const createZoomMeeting = async (hostEmail, topic = 'Reunión360', startTime = null) => {
  const token = await getZoomAccessToken();

  const meetingData = {
    topic,
    type: 1,
    settings: {
      host_video: true,
      participant_video: true,
    },
  };

  try {
    const response = await axios.post(`https://api.zoom.us/v2/users/${hostEmail}/meetings`, meetingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al crear reunión Zoom:', error.response.data);
    throw new Error('No se pudo crear la reunión');
  }
};

module.exports = { createZoomMeeting };