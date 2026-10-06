import 'dotenv/config';
import jwt from 'jsonwebtoken';

// El mismo secreto que usamos en auth.controller.js
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// MIDDLEWARE 1: EL común para todos
// ==========================================
export const verificarToken = (req, res, next) => {
   // 1. Leer la cabecera de autorización
   const authHeader = req.header('Authorization');

   if (!authHeader) {
       return res.status(401).json({ error: 'Acceso denegado. No hay token de autenticación.' });
   }

   try {
       // 2. El token viene así: "Bearer <token>". Separamos la palabra Bearer del token real.
       const token = authHeader.split(' ')[1];
      
       // 3. Verificar si el token es válido y no ha expirado
       const decoded = jwt.verify(token, JWT_SECRET);
      
       // 4. Si es válido, guardamos los datos del usuario en la petición (req)
       // para que los controladores posteriores sepan quién está haciendo la petición
       req.usuario = decoded;
      
       // 5. ¡Pasa! (Green light)
       next();

   } catch (error) {
       res.status(401).json({ error: 'Token inválido o expirado' });
   }
};

// ==========================================
// MIDDLEWARE 2: El que solo accede el administrador
// ==========================================
export const esAdmin = (req, res, next) => {
   // Confiamos en que verificarToken ya se ejecutó y llenó req.usuario
   if (req.usuario && req.usuario.rol === 'admin') {
       next(); // Es admin, puede pasar
   } else {
       res.status(403).json({ error: 'Acceso prohibido. Se requiere rol de Administrador.' }); // 403 Forbidden
   }
};
