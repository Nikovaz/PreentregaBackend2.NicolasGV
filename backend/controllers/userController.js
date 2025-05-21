import User from '../models/User.js';
import UserDTO from '../models/dtos/userDTO.js';
import PasswordResetService from '../services/passwordResetService.js';

export const getCurrentUser = async (req, res) => {
    try {
        const userDTO = UserDTO.fromUser(req.user);
        res.status(200).json(userDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario actual', error });
    }
};

export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const newUser = new User({ first_name, last_name, email, age, password, role });
        await newUser.save();
        const userDTO = UserDTO.fromUser(newUser);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: userDTO });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
};

export const initiatePasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const resetToken = await PasswordResetService.generateResetToken(email);
        res.status(200).json({ message: 'Correo de restablecimiento enviado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar restablecimiento', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await PasswordResetService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al restablecer contraseña', error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const userDTO = UserDTO.fromUser(user);
        res.status(200).json(userDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const userDTO = UserDTO.fromUser(updatedUser);
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: userDTO });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
};