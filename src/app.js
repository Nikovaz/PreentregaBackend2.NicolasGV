import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport'; // Importación del módulo de Passport
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import './config/passport.js'; // Importa la configuración de Passport sin asignarla a una variable

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});