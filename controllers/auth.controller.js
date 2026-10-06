import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database.js';

// Clave secreta para firmar el JWT (En producción debería ir en un archivo .env)
const JWT_SECRET = process.env.JWT_SECRET;

export const login = (req, res) => {
   try {
       const { email, password } = req.body;

       if (!email || !password) {
           return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
       }

       // 1. Buscar el usuario por email (¡Necesitamos la password de la BD!)
       const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
      
       if (!usuario) {
           return res.status(404).json({ error: 'Usuario no encontrado' });
       }

       // 2. Comparar la contraseña enviada con la hasheada de la BD
       const passwordValida = bcrypt.compareSync(password, usuario.password);
      
       if (!passwordValida) {
           return res.status(401).json({ error: 'Contraseña incorrecta' }); // 401 Unauthorized
       }

       // 3. Generar el Token JWT (El "carnet de identidad")
       const token = jwt.sign(
           { id: usuario.id, rol: usuario.rol }, // Payload: datos que queremos guardar en el token
           JWT_SECRET,                           // Clave secreta
           { expiresIn: '2h' }                   // El token expira en 2 horas
       );

       // 4. Devolver el token y los datos del usuario (sin la password)
       res.json({
           mensaje: 'Login exitoso',
           token,
           usuario: {
               id: usuario.id,
               nombre: usuario.nombre,
               email: usuario.email,
               rol: usuario.rol
           }
       });

   } catch (error) {
       res.status(500).json({ error: 'Error en el servidor al hacer login' });
   }
};

