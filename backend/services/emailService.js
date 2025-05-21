import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Variable para indicar si SendGrid está configurado
const isSendGridConfigured = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'TU_SENDGRID_API_KEY';

// Solo configurar SendGrid si hay una API key válida
if (isSendGridConfigured) {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log('SendGrid configurado correctamente');
    } catch (error) {
        console.error('Error configurando SendGrid:', error);
    }
}

class EmailService {
    async sendPasswordResetEmail(email, resetUrl) {
        console.log(`Intentando enviar email a: ${email} con URL: ${resetUrl}`);
        
        // Verificar la configuración antes de intentar enviar
        try {
            await this.verifyConfig();
        } catch (error) {
            console.error('Error en verificación de configuración de email:', error);
            throw new Error(`No se pudo configurar el servicio de correo: ${error.message}`);
        }
        
        // Plantilla de correo HTML mejorada
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                    <h1 style="color: #333; margin: 0;">Restablecimiento de Contraseña</h1>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Haz clic en el siguiente botón para restablecer tu contraseña:</p>
                    <div style="text-align: center; margin: 30px 0;">
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
                            border-radius: 8px;
                        ">Restablecer contraseña</a>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Este enlace expirará en 1 hora por razones de seguridad.</p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">Si no has solicitado este cambio o no quieres cambiar tu contraseña, puedes ignorar este mensaje.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #666; font-size: 14px;">© 2025 Tu Tienda de E-commerce. Todos los derechos reservados.</p>
                </div>
            </div>
        `;

        // Datos del correo
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            subject: 'Restablecimiento de contraseña - Tu Tienda',
            html: htmlContent,
            // Texto alternativo para clientes que no muestran HTML
            text: `Restablecimiento de contraseña - Usa este enlace para restablecer tu contraseña: ${resetUrl} (expira en 1 hora)`
        };

        // Intentar enviar con SendGrid primero
        if (isSendGridConfigured) {
            try {
                const info = await sgMail.send(mailOptions);
                console.log('Email enviado exitosamente con SendGrid');
                return info;
            } catch (error) {
                console.error('Error al enviar email con SendGrid, intentando con Nodemailer:', error);
                // Si falla SendGrid, continuamos con Nodemailer
            }
        } else {
            console.log('SendGrid no está configurado, usando Nodemailer como alternativa');
        }

        // Usar Nodemailer como respaldo o como opción principal si SendGrid no está configurado
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                // Configurar transporter de Nodemailer
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,  // true para 465, false para otros puertos
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                    tls: {
                        rejectUnauthorized: false // Ayuda con algunos problemas de certificados
                    },
                    debug: true // Habilitar para ver logs detallados si hay problemas
                });

                // Intenta verificar la conexión antes de enviar
                await transporter.verify();
                
                const info = await transporter.sendMail(mailOptions);
                console.log('Email enviado exitosamente con Nodemailer');
                return info;
            } catch (error) {
                console.error('Error al enviar email con Nodemailer:', error);
                throw new Error(`No se pudo enviar el correo electrónico: ${error.message}`);
            }
        } else {
            throw new Error('No hay configuración válida para el envío de correos. Se requieren EMAIL_USER y EMAIL_PASS.');
        }
    }
    
    // Método para verificar la configuración de correo electrónico
    async verifyConfig() {
        const config = {
            configured: false,
            sendGridApiKey: !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'TU_SENDGRID_API_KEY',
            emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            warnings: []
        };
        
        // Verificar SendGrid API Key
        if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'TU_SENDGRID_API_KEY') {
            config.warnings.push('SENDGRID_API_KEY no está configurada correctamente');
        }
        
        // Verificar email de remitente
        if (!process.env.EMAIL_FROM && !process.env.EMAIL_USER) {
            config.warnings.push('EMAIL_FROM o EMAIL_USER debe estar configurado');
            throw new Error('No se ha configurado un email de remitente (EMAIL_FROM o EMAIL_USER)');
        }
        
        // Verificar credenciales de Nodemailer como respaldo
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            config.warnings.push('EMAIL_USER y EMAIL_PASS no están configurados para el servicio de respaldo');
        }
        
        // Determinar si hay al menos un método de envío configurado
        config.configured = config.sendGridApiKey || (!!process.env.EMAIL_USER && !!process.env.EMAIL_PASS);
        
        if (!config.configured) {
            console.error('Sistema de emails no configurado correctamente:', config.warnings);
            throw new Error('No hay servicios de correo configurados correctamente');
        }
        
        // Verificar la conectividad con un servicio de correo antes de continuar
        if (!config.sendGridApiKey && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                // Verificamos la conectividad creando un transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,  // true para 465, false para otros puertos
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                    debug: true // Ayuda a diagnosticar problemas de conexión
                });
                
                // Verificar la conexión al servidor de correo
                await transporter.verify();
                console.log('Servidor de correo Nodemailer verificado correctamente');
            } catch (error) {
                console.error('Error al verificar el servidor de correo Nodemailer:', error);
                throw new Error('No se pudo conectar al servidor de correo. Verifica las credenciales.');
            }
        }
        
        return config;
    }
}

export default new EmailService();