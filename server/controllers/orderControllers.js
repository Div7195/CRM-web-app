import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';
let channel;
(async () => {
    try {
        
    
  const connection = await amqp.connect('amqp://127.0.0.1');
  channel = await connection.createChannel();
  await channel.assertQueue('orderQueue', { durable: true });
} catch (error) {
        console.log(error, 'order')
}
})();
export const addNewOrderController = async (request, response) => {
    try {
        const { customerId, orderTotalAmount } = request.body;
    
        
        if (!customerId || !orderTotalAmount) {
          return res.status(400).json({ error: 'Customer ID and Order Amount are required' });
        }
    
        
        channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
        
        response.status(202).json({ message: 'Orders data updated' });
        
      } catch (err) {
        response.status(500).json({ error: err.message });
          
      }
}

export const getOrdersController = async(req, res) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
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