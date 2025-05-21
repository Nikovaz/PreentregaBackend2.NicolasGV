import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport'; // Importación del módulo de Passport
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js'; // Import product routes
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import './config/passport.js'; // Importa la configuración de Passport sin asignarla a una variable

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de Mongoose
mongoose.set('strictQuery', false);

// Conectar a MongoDB
connectDB().catch(console.error);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === 'http://localhost:3000') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Middleware para manejar JWT
app.use((req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        req.token = token;
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB URL: ${process.env.MONGODB_URI}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});