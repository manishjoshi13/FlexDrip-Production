import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.NODEMAILER_EMAIL_USER;
const pass = process.env.NODEMAILER_APP_PASSWORD;

console.log('Testing with email user:', user);
console.log('Testing with app password length:', pass ? pass.length : 0);

// Test 1: Service Gmail
const transporter1 = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

console.log('Verifying transporter with service: gmail...');
transporter1.verify((error, success) => {
  if (error) {
    console.error('Service Gmail failed:', error.message || error);
    
    // Test 2: SMTP host/port explicit
    console.log('Trying with host/port configuration (smtp.gmail.com)...');
    const transporter2 = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    transporter2.verify((err2, succ2) => {
      if (err2) {
        console.error('SMTP port 465 failed:', err2.message || err2);
        
        // Test 3: Port 587
        console.log('Trying with port 587...');
        const transporter3 = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false
          }
        });
        transporter3.verify((err3, succ3) => {
          if (err3) {
            console.error('SMTP port 587 failed:', err3.message || err3);
          } else {
            console.log('SMTP port 587 succeeded!');
          }
        });
      } else {
        console.log('SMTP port 465 succeeded!');
      }
    });
  } else {
    console.log('Service Gmail succeeded!');
  }
});
