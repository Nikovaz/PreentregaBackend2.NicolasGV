import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import emailService from './emailService.js';

class PasswordResetService {
    async generateResetToken(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hora

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await emailService.sendPasswordResetEmail(email, resetUrl);

        return resetToken;
    }

    async resetPassword(token, newPassword) {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Token inválido o expirado');
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error('La nueva contraseña debe ser diferente a la anterior');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
    }
}

export default new PasswordResetService();