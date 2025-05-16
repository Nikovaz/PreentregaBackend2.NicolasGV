import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Cargar variables de entorno
dotenv.config();

async function testEmailConnection() {
    console.log('=== Testing Email Configuration ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    
    // Crear transportador con configuración básica
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true
    });
    
    // Verificar conexión
    try {
        const verify = await transporter.verify();
        console.log('Conexión SMTP verificada:', verify);
        
        // Intentar enviar un correo de prueba
        const testResult = await transporter.sendMail({
            from: `"Test App" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Enviar a ti mismo para pruebas
            subject: "Test Email",
            text: "Este es un correo de prueba para verificar la configuración de nodemailer.",
            html: "<b>Este es un correo de prueba para verificar la configuración de nodemailer.</b>"
        });
        
        console.log('Correo de prueba enviado:', testResult.response);
        console.log('ID del mensaje:', testResult.messageId);
    } catch (error) {
        console.error('Error al probar la conexión de correo:', error);
        
        // Mostrar más detalles del error
        if (error.code) {
            console.error('Código de error:', error.code);
        }
        
        if (error.command) {
            console.error('Comando fallido:', error.command);
        }
        
        if (error.response) {
            console.error('Respuesta del servidor:', error.response);
        }
    }
}

// Ejecutar la función de prueba
testEmailConnection()
    .then(() => console.log('Prueba completada'))
    .catch(err => console.error('Error general:', err));
