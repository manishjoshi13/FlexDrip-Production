import nodemailer from 'nodemailer'
import {config} from '../config/config.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user:config.NODEMAILER_EMAIL_USER,
    clientId:config.NODEMAILER_CLIENT_ID,
    clientSecret:config.NODEMAILER_CLIENT_SECRET,
    refreshToken:config.NODEMAILER_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"FlexDrip" <${config.NODEMAILER_EMAIL_USER}>`, 
      to, 
      subject, 
      text, 
      html, 
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;