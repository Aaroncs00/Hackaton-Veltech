// Ruta básica para la raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Fundación Nexa',
    endpoints: {
      voluntarios: '/api/voluntarios',
      donaciones: '/api/donaciones',
      turnos: '/api/turnos'
    }
  });
});

// server.js - después de los imports
const app = express();

// Configuración CORS más específica
app.use(cors({
  origin: 'http://localhost:5173', // o el puerto de tu frontend React
  credentials: true
}));

// O más permisivo para desarrollo:
app.use(cors({
  origin: '*', // Permite todos los orígenes (solo para desarrollo)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));