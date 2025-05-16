import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        // Primero, registramos las variables de entorno para verificar
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
        
        this.transporter = nodemailer.createTransport({
            service: 'gmail',  // Usar 'service' en lugar de 'host' y 'port'
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Mantener debug para ver información detallada
            debug: true,
            logger: true
        });
    }

    async sendPasswordResetEmail(email, resetUrl) {
        console.log(`Intentando enviar email a: ${email} con URL: ${resetUrl}`);
        
        const mailOptions = {
            from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,  // Formato más formal
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `
                <h1>Restablecimiento de contraseña</h1>
                <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
                <a href="${resetUrl}" style="
                    background-color: #4CAF50; 
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 12px;
                ">Restablecer contraseña</a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no has solicitado un restablecimiento de contraseña, por favor ignora este mensaje.</p>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.response);
            return info;
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }
    
    // Método para verificar la conexión al servidor SMTP
    async verifyConnection() {
        return new Promise((resolve, reject) => {
            this.transporter.verify(function (error, success) {
                if (error) {
                    console.error('Error de verificación SMTP:', error);
                    reject(error);
                } else {
                    console.log('Servidor SMTP listo para enviar mensajes');
                    resolve(success);
                }
            });
        });
    }
}

export default new EmailService();