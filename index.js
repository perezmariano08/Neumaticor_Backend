const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const productosRoutes = require('./routes/productosRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const preciosRoutes = require('./routes/preciosRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(bodyParser.json());  // Permite que las solicitudes POST con JSON sean procesadas

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174',
        'https://neumaticor.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/precios', preciosRoutes);

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Corriendo en http://localhost:${port}`);
});

server.setTimeout(30000);
