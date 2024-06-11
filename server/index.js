import express from 'express'
import dbConnection from './database/db.js';
import dotenv from 'dotenv';
import Router from './routes/route.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import amqp from 'amqplib';
import passport from 'passport';
import cookieSession from 'cookie-session';
import authRoute from './auth.js'
import passportSetup from './passport.js'
dotenv.config();

const app = express();
app.use(
  cookieSession({ name: "session", keys: ["div"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["https://xeno-task.vercel.app"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))


app.use('/',Router);
app.use("/auth", authRoute);

const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const server = app.listen(PORT, () => console.log(`server is running on port ${PORT}`));


let channel;
(async () => {
    try {
        const connection = await amqp.connect('amqp://rabbitmq-service-6zl5.onrender.com');
        console.log(connection)
        channel = await connection.createChannel();
        await channel.assertQueue('customerQueue', { durable: true });
  await channel.assertQueue('orderQueue', { durable: true });
  await channel.assertQueue('saveAudienceQueue', { durable: true });
  await channel.assertQueue('checkAudienceSizeQueue', { durable: true });
  await channel.assertQueue('sendEmailsQueue', { durable: true });
  await channel.assertQueue('getCampaignsQueue',{durable:true})
  await channel.assertQueue('getAudiencesQueue', {durable:true})
  await channel.assertQueue('getSingleAudienceQueue', {durable:true})
  await channel.assertQueue('getCustomersQueue', {durable:true})
  await channel.assertQueue('getOrdersQueue', {durable:true})
    } catch (error) {
        console.log(error, 'sender')
    }
  
})();
dbConnection(USERNAME, PASSWORD);