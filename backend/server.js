import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import serviceRouter from './routes/serviceRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

// Mail
const bodyParser = 'body-parser';
// const cors = 'cors';
// const cors = require('cors');
// const nodemailer = 'nodemailer';

// new mail
// var nodemailer = require('nodemailer');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/keys/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/services', serviceRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Mail
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cors());

app.post('/send_mail', cors(), async (req, res) => {
  let { text } = req.body;

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: 'test@test.com',
    subject: 'test email',
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Here is your email!</h2>
        <p>${text}</p>
    
        <p>All the best, Kyle</p>
         </div>
    `,
  });
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5009;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
