const sgMail = require('@sendgrid/mail');
const sendgridAPIKey=(process.env.SEND_GRID_API)
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail =(email, name)=>{
    sgMail,send({
        to:email,
        from:'yogocamlus@gmail.com',
        subject:'thanks for sending',
        text:`welcome to the app, ${name} let me know how you get along with the app`
    })
}

const sendCancellationEmail = (email, name)=>{
    sgMail.send({
        to:email,
        from:'yogocamlus@gmail.com',
        subject:'sorry to see you go',
        text:`goodbye, ${name} i hope to see you soon`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}