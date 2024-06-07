import express from 'express'
import dbConnection from './database/db.js';
import dotenv from 'dotenv';
import Router from './routes/route.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import amqp from 'amqplib';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/',Router);
app.use(cors())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({ extended: true }));
app.get('/',(req, res)=>{
    return res.send('welcome to application')
})


const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const server = app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
let channel;
(async () => {
    try {
        const connection = await amqp.connect('amqp://127.0.0.1');
        channel = await connection.createChannel();
        await channel.assertQueue('customerQueue', { durable: true });
        await channel.assertQueue('orderQueue', { durable: true });
    } catch (error) {
        console.log(error, 'sender')
    }
  
})();
dbConnection(USERNAME, PASSWORD);