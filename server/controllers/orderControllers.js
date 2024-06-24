import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';

export const addNewOrderController = async (request, response) => {
    try {
        const { customerId, orderTotalAmount } = request.body;
    
        
        if (!customerId || !orderTotalAmount) {
          return res.status(400).json({ error: 'Customer ID and Order Amount are required' });
        }
    
        
        channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
        
        response.status(202).json({ message: 'Order creation request received' });
        
      } catch (err) {
        response.status(500).json({ error: err.message });
          
      }
}

export const getOrdersController = async(req, res) => {
  try {
    const connection = await amqp.connect('amqp://rabbitmq-service-6zl5.onrender.com');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue8';

    await channel.assertQueue(responseQueue, { durable: true });
    const customer = req.query.customer
    const filterRequest = { customer, responseQueue };
    
    channel.sendToQueue('getOrdersQueue', Buffer.from(JSON.stringify(filterRequest)), {
      persistent: true,
    });

    channel.consume(responseQueue, async(msg) => {
      const result = JSON.parse(msg.content.toString());
      res.status(200).json(result);
      channel.ack(msg);
      await channel.close();
      await connection.close();  
    }, { noAck: false });
  } catch (error) {
    await channel.close();
      await connection.close();  
    res.status(500).json({ error: error.message });
  }
}