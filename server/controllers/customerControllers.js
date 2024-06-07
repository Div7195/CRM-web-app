import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';
import Audience from "../models/audience-model.js";
let channel;
(async () => {
    try {
        
    
  const connection = await amqp.connect('amqp://127.0.0.1');
  channel = await connection.createChannel();
  await channel.assertQueue('customerQueue', { durable: true });
} catch (error) {
    console.log(error, 'customer')
}
})();

export const addCustomerController = async (request, response) => {
    try {
        const { customerName, customerEmail, customerTotalSpend, customerTotalVisits, lastVisitDate } = request.body;
    
        // Input data validation
        if (!customerName || !customerEmail) {
          return res.status(400).json({ error: 'Name and Email are required' });
        }
    
        
        
        channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
    
        response.status(202).json({ message: 'Customer creation request received' });
        setTimeout(() => {
          channel.close();
          connection.close();
        }, 500);  // Ensuring the connection closes after sending the response
      } catch (err) {
        response.status(500).json({ error: err.message });
      }
}

export const checkAudienceSizeController = async (req, res) => {
  try {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2 } = req.body;
    console.log(req.body)
    if (![minTotalSpend, minTotalVisits, lastMonthsNotVisited].every(cond => cond !== undefined)) {
      return res.status(400).json({ error: 'All conditions must be provided' });
    }
    if (!['AND', 'OR'].includes(operator1) || !['AND', 'OR'].includes(operator2)) {
      return res.status(400).json({ error: 'Invalid operators' });
    }

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const responseQueue = 'responseQueue';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue };

    channel.sendToQueue('checkAudienceSizeQueue', Buffer.from(JSON.stringify(filterRequest)), {
      persistent: true,
    });

    channel.consume(responseQueue, (msg) => {
      const result = JSON.parse(msg.content.toString());
      res.status(200).json(result);
      channel.ack(msg);
      setTimeout(() => {
        channel.close();
        connection.close();
      }, 500); 
    }, { noAck: false });

  } catch (error) {
    res.status(500).json({ error: error.message });
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);  
  }
};


export const saveAudienceController = async (req, res) => {
  try {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2 } = req.body.criteria;
    const name = req.body.name;
    const description = req.body.description;
    
    if (![minTotalSpend, minTotalVisits, lastMonthsNotVisited].every(cond => cond !== undefined)) {
      return res.status(400).json({ error: 'All conditions must be provided' });
    }
    if (!['AND', 'OR'].includes(operator1) || !['AND', 'OR'].includes(operator2)) {
      return res.status(400).json({ error: 'Invalid operators' });
    }

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue2';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue, name, description };
    
    channel.sendToQueue('saveAudienceQueue', Buffer.from(JSON.stringify(filterRequest)), {
      persistent: true,
    });

    channel.consume(responseQueue, (msg) => {
      const result = JSON.parse(msg.content.toString());
      res.status(200).json(result);
      channel.ack(msg);
      setTimeout(() => {
        channel.close();
        connection.close();
      }, 500);  
    }, { noAck: false });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};