const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail or your SMTP provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email app password (not login password)
        },
    });

    // 2. Define Email Options
    const mailOptions = {
        from: `"Social Media App" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // You can add HTML templates here later
    };

    // 3. Send Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;