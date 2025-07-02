const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../utils/firebase');

const registerUser = async (req, res) => {
  const { name, email, password, role = 'asistente' } = req.body;

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
    console.error('Error al registrar usuario:', error);
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

    res.json({ 
      token,
      user: {
        uid: userDoc.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
     });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userData = userDoc.data();
    res.json({
      uid: userDoc.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil del usuario' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};