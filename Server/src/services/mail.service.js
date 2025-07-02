require('dotenv').config();
const nodemailer = require('nodemailer');

class MailService {
    transport;

    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // false for Gmail (587)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Optional: verify connection
        this.transport.verify((err, success) => {
            if (err) console.error('Email transport error:', err);
            else console.log('Mail service is ready to send messages.');
        });
    }

    sendEmail = async (to, subject, htmlMessage, attachments = []) => {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to,
            subject,
            html: htmlMessage,
            attachments
        };

        const info = await this.transport.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    };
}

const mailSvc = new MailService();
module.exports = mailSvc;
