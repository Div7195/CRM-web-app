import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';
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
    
        // Publish message to RabbitMQ
        
        channel.sendToQueue('customerQueue', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
    
        response.status(202).json({ message: 'Customer creation request received' });
      } catch (err) {
        response.status(500).json({ error: err.message });
      }
}