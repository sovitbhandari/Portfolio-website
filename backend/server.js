require('dotenv').config({ path: 'pw.env' });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic Input Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).send('All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email address');
    }

    if (message.length < 10) {
        return res.status(400).send('Message is too short');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Message from ${name}: ${subject}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('Email sent successfully');
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
