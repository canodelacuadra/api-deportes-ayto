import 'dotenv/config';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
// Conectar/Crear la base de datos local
const db = new Database(process.env.DB_NAME);

// Configuraciones recomendadas para SQLite
db.pragma('journal_mode = WAL'); // Mejora el rendimiento
db.pragma('foreign_keys = ON');  // Activa la eliminación y actualización en cascada

console.log('Base de datos conectada correctamente.');

// ==========================================
// CREACIÓN DE TABLAS
// ==========================================

db.exec(`
 CREATE TABLE IF NOT EXISTS usuarios (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nombre TEXT NOT NULL,
   email TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL,
   rol TEXT DEFAULT 'ciudadano'
 )
`);

db.exec(`
 CREATE TABLE IF NOT EXISTS espacios (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nombre TEXT NOT NULL,
   tipo TEXT NOT NULL,
   ubicacion TEXT NOT NULL,
   capacidad_maxima INTEGER NOT NULL,
   disponible INTEGER DEFAULT 1
 )
`);

db.exec(`
 CREATE TABLE IF NOT EXISTS reservas (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   usuario_id INTEGER NOT NULL,
   espacio_id INTEGER NOT NULL,
   fecha TEXT NOT NULL,
   hora_inicio TEXT NOT NULL,
   hora_fin TEXT NOT NULL,
   estado TEXT DEFAULT 'confirmada',
   FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
   FOREIGN KEY (espacio_id) REFERENCES espacios(id) ON DELETE CASCADE,
   UNIQUE (espacio_id, fecha, hora_inicio) -- Evita doble reserva en mismo espacio, fecha y hora
 )
`);

// ==========================================
// DATOS DE EJEMPLO (Seed)
// ==========================================
// Comprobamos si la tabla usuarios está vacía para insertar datos iniciales
const checkUsers = db.prepare('SELECT COUNT(*) AS count FROM usuarios').get();

if (checkUsers.count === 0) {
 console.log('Insertando datos de ejemplo...');
 // Hasheamos las contraseñas antes de insertarlas
 const passCiudadano = bcrypt.hashSync('1234', 10); // El 10 es el "salt"
 const passAdmin = bcrypt.hashSync('admin123', 10);


 // Insertamos usuarios
 const insertUser = db.prepare('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)');
 insertUser.run('Ana García', 'ana@email.com', passCiudadano, 'ciudadano');
 insertUser.run('Carlos López', 'carlos@email.com', passCiudadano, 'ciudadano');
 insertUser.run('Admin Ayto', 'admin@ayto.com', passAdmin, 'admin');

 // Insertamos espacios
 const insertEspacio = db.prepare('INSERT INTO espacios (nombre, tipo, ubicacion, capacidad_maxima, disponible) VALUES (?, ?, ?, ?, ?)');
 const piscinaId = insertEspacio.run('Piscina Municipal', 'Piscina', 'C/ Agua 1', 50, 1).lastInsertRowid;
 const padelId = insertEspacio.run('Pista Pádel Central', 'Pádel', 'Polideportivo Norte', 4, 1).lastInsertRowid;
 insertEspacio.run('Gimnasio Cubierto', 'Gimnasio', 'Av. Deporte 5', 30, 0); // No disponible

 // Insertamos una reserva de ejemplo (Ana reserva la piscina)
 const insertReserva = db.prepare('INSERT INTO reservas (usuario_id, espacio_id, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)');
 insertReserva.run(1, piscinaId, '2024-10-15', '10:00', '11:00', 'confirmada');
 insertReserva.run(2, padelId, '2024-10-15', '18:00', '19:30', 'confirmada');
}

// Exportamos la conexión para usarla en otros archivos
export default db;