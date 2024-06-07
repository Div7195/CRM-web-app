import mongoose from 'mongoose';
import amqp from 'amqplib';
import Customer from './models/customer-schema.js';
import Order from './models/order-schema.js';
import dbConnection from './database/db.js';
import dotenv from 'dotenv'
import Audience from './models/audience-model.js';
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
  await channel.assertQueue('saveAudienceQueue', { durable: true });
  await channel.assertQueue('checkAudienceSizeQueue', { durable: true });
  
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

 

  channel.consume('checkAudienceSizeQueue', async (msg) => {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue } = JSON.parse(msg.content.toString());

    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - lastMonthsNotVisited);

    
    let conditions = [];

    if (minTotalSpend !== undefined) {
      conditions.push({ customerTotalSpend: { $gte: minTotalSpend } });
    }

    if (minTotalVisits !== undefined) {
      conditions.push({ customerTotalVisits: { $gte: minTotalVisits } });
    }

    if (lastMonthsNotVisited !== undefined) {
      conditions.push({ lastVisitDate: { $lt: pastDate } });
    }

    let query = {};

    if (conditions.length > 1) {
     
      let firstCondition;
      if (operator1 === 'AND') {
        firstCondition = { $and: [conditions[0], conditions[1]] };
      } else {
        firstCondition = { $or: [conditions[0], conditions[1]] };
      }

     
      if (conditions.length === 3) {
        if (operator2 === 'AND') {
          query = { $and: [firstCondition, conditions[2]] };
        } else {
          query = { $or: [firstCondition, conditions[2]] };
        }
      } else {
        query = firstCondition;
      }
    } else if (conditions.length === 1) {
      query = conditions[0];
    }

    try {
      const filteredCustomers = await Customer.find(query);
      const audienceSize = filteredCustomers.length;

      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ audienceSize })));
    } catch (error) {
      console.error('Error fetching customers:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching customers' })));
    }

    channel.ack(msg);
  }, { noAck: false });


  channel.consume('saveAudienceQueue', async (msg) => {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue, name, description } = JSON.parse(msg.content.toString());
    
    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - lastMonthsNotVisited);
  
   
    let conditions = [];
  
    if (minTotalSpend !== undefined) {
      conditions.push({ customerTotalSpend: { $gte: minTotalSpend } });
    }
  
    if (minTotalVisits !== undefined) {
      conditions.push({ customerTotalVisits: { $gte: minTotalVisits } });
    }
  
    if (lastMonthsNotVisited !== undefined) {
      conditions.push({ lastVisitDate: { $lt: pastDate } });
    }
  
    let query = {};
  
    if (conditions.length > 1) {
     
      let firstCondition;
      if (operator1 === 'AND') {
        firstCondition = { $and: [conditions[0], conditions[1]] };
      } else {
        firstCondition = { $or: [conditions[0], conditions[1]] };
      }
  
      
      if (conditions.length === 3) {
        if (operator2 === 'AND') {
          query = { $and: [firstCondition, conditions[2]] };
        } else {
          query = { $or: [firstCondition, conditions[2]] };
        }
      } else {
        query = firstCondition;
      }
    } else if (conditions.length === 1) {
      query = conditions[0];
    }
  
    try {
      const filteredCustomers = await Customer.find(query);
      const audienceSize = filteredCustomers.length;
  
      
      const audience = new Audience({
        name:name,
        description:description,
        criteria: {
          minTotalSpend:minTotalSpend,
          minTotalVisits:minTotalVisits,
          lastMonthsNotVisited:lastMonthsNotVisited,
          operator1:operator1,
          operator2:operator2
        },
        customers: filteredCustomers.map(customer => customer._id)
      });
      console.log(audience)
      await audience.save();
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ audienceSize })));
      
      channel.ack(msg);
    } catch (error) {
      console.error('Error saving audience:', error);
     
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error saving audience' })));
      
      channel.ack(msg);
    }
  }, { noAck: false });

})();


