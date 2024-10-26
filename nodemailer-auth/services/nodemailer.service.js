import nodemailer from 'nodemailer'
import prisma from '../prisma/prisma.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// nodemailer.service.js
const mailOptions = (email, num) => {
  return {
    from: 'As-Company',
    to: email,
    subject: 'Node-App',
    // text: 'Hello Bro This is your verification code' + ' ' + num,
     html: `<h2>Hi Bro This is your verification code: <h3>${num}</h3></h2>`
  };
};


const deleteExpiredOtpCodes = async () => {
  const currentDate = new Date();

  await prisma.otp.deleteMany({
    where: {
      expirationDate: {
        lt: currentDate,
      },
    },
  });
};

export const sendOtp = async (email) => {
  const randomNumbers =
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10) +
    '' +
    Math.floor(Math.random() * 10);

  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 2);

  const otp = await prisma.otp.create({
    data: {
      email: email,
      code: randomNumbers,
      expirationDate: expirationDate,
    },
  })

  console.log(otp);

  transporter.sendMail(mailOptions(email, randomNumbers), (error, info) => {
    if (error) {
      console.error('❌ Error:', error.message)
    } else {
      console.log('✅ Email sent:', info.response)
    }
  })

  setInterval(deleteExpiredOtpCodes, 60000)
}
