const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../utils/firebase');

const registerUser = async (req, res) => {
  const { email, password, role = 'asistente', name } = req.body;

  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('users').add(newUser);

    res.status(201).json({ id: docRef.id, message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ uid: userDoc.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};