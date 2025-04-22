const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
    register: async (userData) => {
        const { first_name, last_name, email, age, password } = userData;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: 'user'
        });
        await newUser.save();
        return newUser;
    },

    login: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};

module.exports = authService;