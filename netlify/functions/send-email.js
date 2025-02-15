const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
        };
    }

    try {
        const { name, email, message } = JSON.parse(event.body);

        // Create Gmail SMTP transporter with secure settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.GMAIL_EMAIL}>`,
            to: process.env.TO_EMAIL,
            subject: `New message from ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
            replyTo: email
        };

        // Verify connection configuration
        await transporter.verify();

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent:', info.messageId);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Detailed error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: error.message,
                details: {
                    code: error.code,
                    response: error.response,
                    responseCode: error.responseCode
                }
            })
        };
    }
};
