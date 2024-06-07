import mongoose from 'mongoose';
import amqp from 'amqplib';
import Customer from './models/customer-schema.js';
import Order from './models/order-schema.js';
import dbConnection from './database/db.js';
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
dbConnection(USERNAME, PASSWORD);

(async () => {
    
    console.log('wow')
    
  const connection = await amqp.connect('amqp://127.0.0.1');
  const channel = await connection.createChannel();
  console.log(channel)
  await channel.assertQueue('customerQueue', { durable: true });
  await channel.assertQueue('orderQueue', { durable: true });


  channel.consume('customerQueue', async (msg) => {
    try {
        
    
    const customerData = JSON.parse(msg.content.toString());
    
    const newCustomer = new Customer(customerData);
    console.log(newCustomer)
    await newCustomer.save();
    channel.ack(msg);
} catch (error) {
        console.log(error)
}
  }
  
  , { noAck: false });


  channel.consume('orderQueue', async (msg) => {
    const orderData = JSON.parse(msg.content.toString());

    const newOrder = new Order(orderData);
    await newOrder.save();

  
    const customer = await Customer.findById(orderData.customerId);
    if (customer) {
      customer.customerTotalSpend += orderData.orderTotalAmount;
      customer.customerTotalVisits += 1;
      customer.lastVisitDate = new Date();
      await customer.save();
    }

    channel.ack(msg);
  }, { noAck: false });
})();
