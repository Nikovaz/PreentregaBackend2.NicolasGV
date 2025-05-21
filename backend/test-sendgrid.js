import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

// Cargar variables de entorno
dotenv.config();

async function testSendGridConfig() {
    console.log('=== Testing SendGrid Email Configuration ===');
    console.log('SENDGRID_API_KEY length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || process.env.EMAIL_USER);
    
    // Verificar la API key
    if (!process.env.SENDGRID_API_KEY) {
        console.error('Error: SENDGRID_API_KEY no está configurada en el archivo .env');
        console.log('Por favor, regístrate en SendGrid (https://app.sendgrid.com) y crea una API key');
        console.log('Luego añade la variable SENDGRID_API_KEY a tu archivo .env');
        return;
    }
    
    // Verificar el email remitente
    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    if (!emailFrom) {
        console.error('Error: EMAIL_FROM o EMAIL_USER no está configurado en el archivo .env');
        console.log('Por favor, configura EMAIL_FROM o EMAIL_USER en tu archivo .env');
        return;
    }
    
    // Establecer la API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Configurar el mensaje de prueba
    const testEmail = process.env.TEST_EMAIL || emailFrom; // Enviar a EMAIL_FROM si no hay TEST_EMAIL
    const msg = {
        to: testEmail,
        from: emailFrom,
        subject: 'Test Email from SendGrid',
        text: 'Este es un correo de prueba enviado desde SendGrid para verificar la configuración.',
        html: '<strong>Este es un correo de prueba enviado desde SendGrid para verificar la configuración.</strong>',
    };
    
    // Intentar enviar el correo
    try {
        console.log(`Intentando enviar correo a: ${testEmail}`);
        const response = await sgMail.send(msg);
        
        console.log('Correo enviado exitosamente:');
        console.log('Status code:', response[0].statusCode);
        console.log('Body:', response[0].body);
        console.log('Headers:', response[0].headers);
        
        console.log('\n✅ La configuración de SendGrid funciona correctamente!');
    } catch (error) {
        console.error('Error al enviar correo con SendGrid:');
        console.error(error);
        
        if (error.response) {
            console.error('Respuesta del error:', error.response.body);
            
            // Casos comunes de error
            if (error.code === 401) {
                console.log('\nEl error parece ser un problema de autenticación. Verifica tu API key.');
            } else if (error.code === 403) {
                console.log('\nEl error parece ser un problema de permisos. Asegúrate de que la API key tenga permisos para enviar correos.');
            } else if (error.response.body && error.response.body.errors) {
                const errors = error.response.body.errors;
                if (errors.some(e => e.message && e.message.includes('sender address'))) {
                    console.log('\nEl remitente no está verificado. Debes verificar tu dirección de correo electrónico en SendGrid.');
                    console.log('Por favor, visita: https://app.sendgrid.com/settings/sender_auth');
                }
            }
        }
    }
}

// Ejecutar la prueba
testSendGridConfig()
    .then(() => console.log('Prueba completada'))
    .catch(err => console.error('Error general:', err));
