const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass',
    },
});

/**
 * Send a generic email
 */
const sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Spiritual Library" <${process.env.SMTP_FROM || 'noreply@manfusaa.com'}>`,
            to,
            subject,
            html,
        });

        logger.info(`Email sent: ${info.messageId}`);
        // If using Ethereal, log the preview URL
        if (info.messageId && !process.env.SMTP_HOST) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return info;
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        return null;
    }
};

/**
 * Send due date reminder
 */
const sendDueDateReminder = async (user, book, daysRemaining) => {
    const subject = `Reminder: "${book.title}" is due in ${daysRemaining} day(s)`;
    const html = `
        <div style="font-family: serif; color: #001f3f; padding: 20px;">
            <h1 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">Spiritual Library Reminder</h1>
            <p>Dear ${user.name},</p>
            <p>This is a gentle reminder that the sacred text <strong>"${book.title}"</strong> is due to be returned in <strong>${daysRemaining} day(s)</strong>.</p>
            <p>Please ensure you return it by <strong>${book.dueDate}</strong> to avoid any fines and allow other seekers to study its wisdom.</p>
            <br/>
            <p>Blessings,</p>
            <p>The Manfusaa Archives</p>
        </div>
    `;
    return sendMail({ to: user.email, subject, html });
};

/**
 * Send book available notification
 */
const sendBookAvailableNotification = async (user, book) => {
    const subject = `Sacred Text Available: "${book.title}"`;
    const html = `
        <div style="font-family: serif; color: #001f3f; padding: 20px;">
            <h1 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">Reservation Alert</h1>
            <p>Greetings ${user.name},</p>
            <p>The book you reserved, <strong>"${book.title}"</strong>, is now back in our archives and available for you to borrow.</p>
            <p>Please visit the library or log in to your portal to secure your study session.</p>
            <br/>
            <p>Peace be with you,</p>
            <p>The Manfusaa Archives</p>
        </div>
    `;
    return sendMail({ to: user.email, subject, html });
};

module.exports = {
    sendMail,
    sendDueDateReminder,
    sendBookAvailableNotification,
};
