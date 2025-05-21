import User from '../models/User.js';
import UserDTO from '../models/dtos/userDTO.js';

class UserRepository {
    async createUser(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user; 
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    async updateUser(userId, userData) {
        try {
            const user = await User.findByIdAndUpdate(userId, userData, { new: true });
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async deleteUser(userId) {
        try {
            await User.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    async getUserByResetToken(token) {
        try {
            const user = await User.findOne({ resetToken: token });
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    async updateResetToken(userId, token) {
        try {
            const user = await User.findByIdAndUpdate(userId, { resetToken: token }, { new: true });
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error updating reset token: ${error.message}`);
        }
    }

    async clearResetToken(userId) {
        try {
            const user = await User.findByIdAndUpdate(userId, { resetToken: null }, { new: true });
            return user ? UserDTO.fromUser(user) : null;
        } catch (error) {
            throw new Error(`Error clearing reset token: ${error.message}`);
        }
    }
}

export default new UserRepository();
