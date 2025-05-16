import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../models/repositories/userRepository.js';
import UserDTO from '../models/dtos/userDTO.js';
import passwordResetService from '../services/passwordResetService.js';
import emailService from '../services/emailService.js';

const { JWT_SECRET } = process.env;

// Register a new user
export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password, // El password se encripta en el middleware pre-save del modelo
            role: 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
    
    try {
        // Mensaje de depuración
        console.log(`Intentando generar token para: ${email}`);
        await passwordResetService.generateResetToken(email);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Error requesting password reset', 
            error: error.message,
            stack: error.stack
        });
    }
};

// Reset password with token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {
        await passwordResetService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(400).json({ message: 'Error resetting password', error: error.message });
    }
};