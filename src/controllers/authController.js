import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { JWT_SECRET } = process.env;

// Register a new user
export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password,
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
        console.log('Datos recibidos para login:', { email, password });

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuario no encontrado:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Usuario encontrado:', user);

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log('Resultado de la comparación de contraseñas:', isMatch);

        if (!isMatch) {
            console.log('Contraseña incorrecta para el usuario:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Usuario autenticado correctamente:', user);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};