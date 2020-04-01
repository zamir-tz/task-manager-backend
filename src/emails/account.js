const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'zamir.toss@gmail.com',
        subject: 'Welcome to the APP',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
}

const sendLeavingEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'zamir.toss@gmail.com',
        subject: 'Sorry to see you leaving',
        text: `It is sad seeing you leave, ${name}. Please let us know how we can improve.`,
    });
}

module.exports = {
    sendWelcomeEmail,
    sendLeavingEmail
};