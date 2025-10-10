import express from 'express';
import cors from 'cors';
const app = express();


// Si quieres CORS solo para tu frontend:
app.use(cors({ origin: 'http://localhost:5173' }));
// Middlewares
app.use(express.json());

// Middleware de diagnóstico - AGREGA ESTO
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Importar rutas
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import buffetRoutes from './routes/buffet.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import roomRoutes from './routes/room.routes.js';

// Usar rutas con prefijos
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/buffet', buffetRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/room', roomRoutes);

// Ruta de prueba directa - AGREGA ESTO
app.post('/api/test', (req, res) => {
  console.log('Ruta de prueba alcanzada');
  res.json({ message: 'Test route works!' });
});

// Puerto
const PORT = 8080;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});