const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;

if (process.env.RENDER) {
  // En Render, leer desde el archivo secreto
  const servicePath = '/etc/secrets/serviceAccountKey.json';
  serviceAccount = JSON.parse(fs.readFileSync(servicePath, 'utf8'));
} else {
  // En local, usar el archivo del proyecto
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };