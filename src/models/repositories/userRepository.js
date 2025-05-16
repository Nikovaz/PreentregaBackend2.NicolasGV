import User from '../User.js';
import UserDTO from '../dtos/userDTO.js';

class UserRepository {
    async findById(id) {
        const user = await User.findById(id);
        return user ? UserDTO.fromUser(user) : null;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    async findUserDTOByEmail(email) {
        const user = await User.findOne({ email });
        return user ? UserDTO.fromUser(user) : null;
    }

    async create(userData) {
        const user = new User(userData);
        await user.save();
        return UserDTO.fromUser(user);
    }

    async update(id, updateData) {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return user ? UserDTO.fromUser(user) : null;
    }

    async delete(id) {
        await User.findByIdAndDelete(id);
    }

    async findByResetToken(token) {
        return await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    }
}

export default new UserRepository();