import 'dotenv/config'; 
import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import espaciosRouter from './routes/espacios.routes.js'; 
import usuariosRouter from "./routes/usuarios.routes.js";
import reservasRouter from './routes/reservas.routes.js';
import authRouter from './routes/auth.routes.js';


// 1. Inicializamos la aplicación de Express
const app = express();

// 2. Definimos el puerto donde correrá nuestro servidor
const PORT = process.env.PORT || 3000;

// 3. Middleware: Le decimos a Express que sepa entender los datos en formato JSON
app.use(express.json());
app.use(helmet());
app.use(cors());

// 4. Creamos una ruta de prueba (GET) en la raíz para comprobar que funciona
app.get('/', (req, res) => {
    res.json({ 
        mensaje: '¡API de Espacios Deportivos del Ayuntamiento funcionando! 🏟️' 
    });
});
app.use('/api/espacios', espaciosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/reservas', reservasRouter);
app.use('/api/auth', authRouter);

// 5. Arrancamos el servidor para que escuche peticiones en el puerto indicado
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});