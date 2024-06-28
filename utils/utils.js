import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import models from '../models';

const { user } = models;

export function signJsonWebToken(usr) {
  const token = jwt.sign({
    data: usr,
  }, process.env.JWT_SECRET, { expiresIn: '6h' });
  return token;
}

export function getErrorMessage(error) {
  console.log(error);
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}

export function resetPasswordEmail(req, { recipientEmail }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const { user } = req

    const email = {
      body: {
        name: user.name,
        intro: 'We’ve received your request to reset your password.',
        action: {
          instructions: 'Please click the link below to complete the reset.',
          button: {
            color: '#1da1f2', // Optional action button color
            text: 'Confirm your account',
            link: `https://product-square-invoice.netlify.app/resetPassword?recoveryPasswordId=${user.recoveryPasswordId}`,
            // link: `http://localhost:3000/resetPassword?recoveryPasswordId=${user.recoveryPasswordId}`,
          },
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
      },
    };

    const MailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'KBS Team',
        link: 'https://mailgen.js/',
      },
    });

    const emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: '"KBS" <kingsbusinesssuite@gmail.com>',
      to: recipientEmail,
      subject: '[KBS] Reset password',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'Error sending email' });
      }
      console.log(`Email sent: ${info.response}`);
      return resolve({ message: 'Email sent successfully' });
    });
  });
}