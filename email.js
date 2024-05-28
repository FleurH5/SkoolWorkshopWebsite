require('dotenv').config();
const nodemailer = require('nodemailer');

const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});




async function sendEmail(to, subject, template, data) {
    try {
        const html = await ejs.renderFile(__dirname + '/EmailTemplates/' + template + '.ejs', data, { async: true })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html
        }

        await transporter.sendMail(mailOptions)

        console.log('Email sent successfully!');


    } catch (error) {
        console.log('Error: ', error)
    }
    
};

//await,                         {data from database}

sendEmail('saa.wenzel@student.avans.nl', 'Template email test', 'BackupTemplate', { userName: 'shirley' });


//Make sure to use async if u want to add a style in the templates!!!