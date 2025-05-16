import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            // Agregamos debug para ver más información sobre los errores
            debug: true,
            logger: true
        });
    }

    async sendPasswordResetEmail(email, resetUrl) {
        console.log(`Intentando enviar email a: ${email} con URL: ${resetUrl}`);
        console.log(`Usando credenciales: ${process.env.EMAIL_USER}`);
        const mailOptions = {
            from: process.env.EMAIL_USER,
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

        return this.transporter.sendMail(mailOptions);
    }
}

export default new EmailService();