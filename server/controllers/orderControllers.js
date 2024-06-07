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
        const { customerId, orderTotalAmount, orderDateStamp } = request.body;
    
        // Input data validation
        if (!customerId || !orderTotalAmount) {
          return res.status(400).json({ error: 'Customer ID and Order Amount are required' });
        }
    
        // Publish message to RabbitMQ
        channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
    
        response.status(202).json({ message: 'Order creation request received' });
      } catch (err) {
        response.status(500).json({ error: err.message });
      }
}