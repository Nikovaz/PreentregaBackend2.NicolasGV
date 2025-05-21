import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import UserDTO from '../models/dtos/userDTO.js';
import passwordResetService from '../services/passwordResetService.js';
import emailService from '../services/emailService.js';
import Cart from '../models/Cart.js';

const { JWT_SECRET } = process.env;

// Register a new user
export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create user first
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password, // The password is encrypted in the pre-save middleware of the model
            role: 'user'
        });

        await newUser.save();
        
        // Create a cart for the new user
        const newCart = new Cart({
            user: newUser._id,
            items: [],
            total: 0
        });
        
        // Save the cart first
        await newCart.save();
        
        // Update user with the cart reference
        newUser.cart = newCart._id;
        await newUser.save();
        
        // Generar un token para el usuario recién registrado
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '3h' });
        
        // Devolver el token junto con el mensaje de éxito
        res.status(201).json({ 
            message: 'User registered successfully', 
            token,
            user: {
                _id: newUser._id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                role: newUser.role,
                cart: newCart._id
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Crear token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

        // Crear respuesta de usuario usando DTO
        const userDTO = UserDTO.fromUser(user);
        const userResponse = {
            _id: userDTO.id,
            email: userDTO.email,
            first_name: userDTO.first_name,
            last_name: userDTO.last_name,
            role: userDTO.role,
            cart: userDTO.cart
        };

        res.status(200).json({ token, user: userResponse });
    } catch (error) {
        console.error('Error in login:', error);
        next(error);
    }
};

// Get current user (using DTO to filter sensitive info)
export const getCurrentUser = async (req, res) => {
    try {
        const userDTO = UserDTO.fromUser(req.user);
        res.status(200).json(userDTO);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'El email es requerido' });
    }

    try {
        // Verificar si el usuario existe primero
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No se encontró un usuario con ese email' });
        }

        // Mejorar mensaje de depuración
        console.log(`Procesando solicitud de restablecimiento para: ${email}`);
        console.log('Configuración actual:', {
            EMAIL_USER: process.env.EMAIL_USER,
            EMAIL_SERVICE: process.env.EMAIL_SERVICE,
            EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
        });
        
        // Verificar la configuración del servicio de email
        try {
            await emailService.verifyConfig();
        } catch (configError) {
            console.error('Error de configuración de email:', configError);
            return res.status(500).json({ 
                message: 'Error en la configuración del servicio de correo. Contacta al administrador.', 
                error: configError.message 
            });
        }

        // Mensaje de depuración
        console.log(`Intentando generar token para: ${email}`);
        await passwordResetService.generateResetToken(email);
        res.status(200).json({ message: 'Se ha enviado un enlace de recuperación a tu correo electrónico' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        console.error('Stack trace:', error.stack);
        
        // Manejar diferentes tipos de errores
        if (error.message.includes('API_KEY') || error.message.includes('EMAIL_FROM')) {
            return res.status(500).json({ 
                message: 'Error de configuración del servidor de correo. Contacta al administrador.', 
                error: 'Configuration Error'
            });
        }
        
        if (error.code === 'EAUTH' || error.message.includes('Username and Password not accepted') || error.message.includes('no se pudo conectar al servidor de correo')) {
            console.error('Detalles del error de autenticación:', {
                code: error.code,
                message: error.message,
                responseCode: error.responseCode || 'N/A',
                command: error.command || 'N/A'
            });
            return res.status(500).json({
                message: 'Error de autenticación con el servidor de correo. Por favor contacta al administrador.', 
                error: 'Authentication Error'
            });
        }
        
        res.status(500).json({ 
            message: 'Error al solicitar recuperación de contraseña', 
            error: error.message
        });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
        return res.status(400).json({ message: 'La nueva contraseña es requerida' });
    }
    
    try {
        await passwordResetService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ message: 'Error resetting password', error: error.message });
    }
};

// Verify reset token
export const verifyResetToken = async (req, res) => {
    const { token } = req.params;
    
    if (!token) {
        return res.status(400).json({ 
            message: 'Token no proporcionado', 
            valid: false 
        });
    }
    
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            // Instead of just returning 400, we'll return a more specific response
            // that indicates the token has been used or expired
            return res.status(200).json({ 
                message: 'Token ya utilizado o expirado', 
                valid: false,
                used: true
            });
        }

        res.status(200).json({ 
            message: 'Token válido', 
            valid: true,
            used: false
        });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
};