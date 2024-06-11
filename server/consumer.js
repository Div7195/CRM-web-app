import mongoose from 'mongoose';
import amqp from 'amqplib';
import Customer from './models/customer-schema.js';
import Order from './models/order-schema.js';
import dbConnection from './database/db.js';
import dotenv from 'dotenv'
import Audience from './models/audience-model.js';
import Campaign from './models/campaign-schema.js';
import axios from 'axios'
import DeliveryReceipt from './models/commslog-schema.js';

dotenv.config()
const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
dbConnection(USERNAME, PASSWORD);

(async () => {
    
    // console.log('wow')
    
  const connection = await amqp.connect('amqp://127.0.0.1');
  const channel = await connection.createChannel();
  // console.log(channel)
  await channel.assertQueue('customerQueueee', { durable: true });
  await channel.assertQueue('orderQueue', { durable: true });
  await channel.assertQueue('saveAudienceQueue', { durable: true });
  await channel.assertQueue('checkAudienceSizeQueue', { durable: true });
  await channel.assertQueue('sendEmailsQueue', { durable: true });
  await channel.assertQueue('getCampaignsQueue',{durable:true})
  await channel.assertQueue('getAudiencesQueue', {durable:true})
  await channel.assertQueue('getSingleAudienceQueue', {durable:true})
  await channel.assertQueue('getCustomerssssQueue', {durable:true})
  await channel.assertQueue('getOrdersQueue', {durable:true})
  await channel.assertQueue('updateDeliveryReceiptQueue', {durable:true})

  const batchUpdateInterval = 500; 
    let updateBatch = [];

    const batchUpdate = async () => {
      try {
        
      
      if (updateBatch && updateBatch.length > 0) {
        const batch = [...updateBatch];
        updateBatch = [];

        const bulkOps = batch.map(({ campaignId, customerId }) => ({
          updateOne: {
            filter: { campaignId },
            update: { $push: { customerReceipts: { customerId, status: Math.random() < 0.9 ? 'SENT' : 'FAILED' } } },
            upsert: true
          }
        }));
        console.log(bulkOps)
        await DeliveryReceipt.bulkWrite(bulkOps);
        console.log('Batch update complete');
      }
    } catch (error) {
        console.log(error)
    }
    };

  // setInterval(batchUpdate, batchUpdateInterval);
  channel.consume('customerQueueee', async (msg) => {
    try {
        
    
    const customerData = JSON.parse(msg.content.toString());
    
    const newCustomer = new Customer(customerData);
    // console.log(newCustomer)
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
        customer.customerTotalSpend += newOrder.orderTotalAmount;
        customer.customerTotalVisits += 1;
        customer.lastVisitDate = new Date();
        await customer.save();
    }

    const audiences = await Audience.find();
    const now = new Date();
    const pastDate = new Date();
    
    for (const audience of audiences) {
        const { criteria } = audience;
        
        const conditions = [];

        if (criteria.minTotalSpend !== undefined) {
            conditions.push({ customerTotalSpend: { $gte: criteria.minTotalSpend } });
        }

        if (criteria.minTotalVisits !== undefined) {
            conditions.push({ customerTotalVisits: { $gte: criteria.minTotalVisits } });
        }

        if (criteria.lastMonthsNotVisited !== undefined) {
            pastDate.setMonth(now.getMonth() - criteria.lastMonthsNotVisited);
            conditions.push({ lastVisitDate: { $lt: pastDate } });
        }

        let query = {};

        if (conditions.length > 1) {
            let firstCondition;
            if (criteria.operator1 === 'AND') {
                firstCondition = { $and: [conditions[0], conditions[1]] };
            } else {
                firstCondition = { $or: [conditions[0], conditions[1]] };
            }

            if (conditions.length === 3) {
                if (criteria.operator2 === 'AND') {
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

        const isInCriteria = await Customer.exists({ _id: orderData.customerId, ...query });

        if (isInCriteria && !audience.customers.includes(orderData.customerId)) {
            audience.customers.push(orderData.customerId);
            await audience.save();
        }
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
      // console.log(audience)
      await audience.save();
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ audienceSize })));
      
      channel.ack(msg);
    } catch (error) {
      console.error('Error saving audience:', error);
     
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error saving audience' })));
      
      channel.ack(msg);
    }
  }, { noAck: false });


  channel.consume('sendEmailsQueue', async(msg) => {
    const { audienceId, subject, messageBody, responseQueue } = JSON.parse(msg.content.toString());
    try {
    
        const list = await Audience.findById(audienceId).populate('customers');
        if (!list) return res.status(404).json({ error: 'List not found' });
        
        const campaign = new Campaign({
          audienceId,
          subject,
          messageBody
        });
        
        await campaign.save()
        for (const customer of list.customers) {
          const emailRequest = { customerId: customer._id, subject, messageBody, campaignId:campaign._id };
          await axios.post('http://localhost:8000/sendAnEmail', emailRequest);
        }
        
        

        const message = {
            msg: 'Emails sent with delivery receipt rates.',
        };
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(message)));
      channel.ack(msg);
      } catch (error) {
        console.error('Error sending emails:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error sending emails' })));
      channel.ack(msg);
      }
  }, { noAck: false })


  channel.consume('updateDeliveryReceiptQueue', async (msg) => {
      try {
        const { campaignId, customerId } = JSON.parse(msg.content.toString());
        
        updateBatch.push({ campaignId, customerId });
        
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.reject(msg, true);
      }
    }, { noAck: false });



  channel.consume('getCampaignsQueue', async (msg) => {
    const { responseQueue, audienceId, customerId } = JSON.parse(msg.content.toString());
    try {
        let campaigns = [];

      if(audienceId !== ""){
        if(audienceId === "nil"){
          campaigns = await Campaign.find().sort({ date: -1 });
        }else{
          campaigns = await Campaign.find({ audienceId }).sort({ date: -1 });
        }
      }else if(customerId !== ""){
        if(customerId === "nil"){
          campaigns = await Campaign.find().sort({ date: -1 });
        }else{
          console.log('customer id is ' + customerId)
          const audiences = await Audience.find({ customers: customerId });
        const audienceIds = audiences.map(audience => audience._id);
        campaigns = await Campaign.find({ audienceId: { $in: audienceIds } }).sort({ date: -1 });
        }
      }else{
        campaigns = await Campaign.find().sort({ date: -1 });
      }

        const campaignsWithDetails = await Promise.all(campaigns.map(async (campaign) => {
            const audience = await Audience.findById(campaign.audienceId);
            const audienceName = audience ? audience.name : 'Unknown Audience';

            const deliveryReceipt = await DeliveryReceipt.findOne({ campaignId: campaign._id });
            let sentPercentage = 0;
            let failedPercentage = 0;
            if (deliveryReceipt) {
                const totalReceipts = deliveryReceipt.customerReceipts.length;
                const sentCount = deliveryReceipt.customerReceipts.filter(receipt => receipt.status === 'SENT').length;
                const failedCount = deliveryReceipt.customerReceipts.filter(receipt => receipt.status === 'FAILED').length;
                sentPercentage = totalReceipts > 0 ? (sentCount / totalReceipts) * 100 : 0;
                failedPercentage = totalReceipts > 0 ? (failedCount / totalReceipts) * 100 : 0;
            }

            return {
                ...campaign.toObject(),
                audienceName,
                sentPercentage,
                failedPercentage,
                audienceSize: audience ? audience.customers.length : 0
            };
        }));

        channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ campaigns: campaignsWithDetails })));
        channel.ack(msg);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching campaigns' })));
        channel.ack(msg);
    }
}, { noAck: false });

  channel.consume('getAudiencesQueue', async (msg) => {
    const { responseQueue } = JSON.parse(msg.content.toString());
    try {
     
      const audiences = await Audience.find();
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ audiences })));
      channel.ack(msg);
    } catch (error) {
      console.error('Error fetching audiences:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching audiences' })));
      channel.ack(msg);
    }
  }, { noAck: false });

  channel.consume('getSingleAudienceQueue', async (msg) => {
    const { responseQueue, audienceId } = JSON.parse(msg.content.toString());
    try {
     
      const campaigns = await Campaign.find().sort({ date: -1 });
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ campaigns })));
      channel.ack(msg);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching campaigns' })));
      channel.ack(msg);
    }
  }, { noAck: false });


  channel.consume('getCustomerssssQueue', async (msg) => {
    const { responseQueue, audienceId } = JSON.parse(msg.content.toString());
    
    let customers = []
    try {
      if(audienceId !== "nil"){
        
        const audience = await Audience.findById(audienceId).populate('customers');
        
        if (!audience) {
          channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Customers for this audience not found' })));
          channel.ack(msg);
          return;
      }
      customers = audience.customers
      
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ customers })));
      channel.ack(msg);
      }else{
      customers = await Customer.find();
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ customers })));
      channel.ack(msg);
      }
      
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching customers' })));
      channel.ack(msg);
      
    }
  }, { noAck: false });


  channel.consume('getOrdersQueue', async (msg) => {
    const { responseQueue, customer } = JSON.parse(msg.content.toString());
    try {
      let orders = []
      let result = []
      if(customer === 'all'){
         orders = await Order.find().sort({ date: -1 });
         result = await Promise.all(
          orders.map(async (order) => {
            const customerObj = await Customer.findById(order.customerId);
            return {
              customerId: order.customerId,
              customerName: customerObj ? customerObj.customerName : 'Unknown',
              orderTotalAmount: order.orderTotalAmount,
              orderDateStamp: order.orderDateStamp,
            };
          })
        );
      }else{
        
        const customerObj = await Customer.findById(customer);

      if (!customerObj) {
        return res.status(404).json({ error: 'Customer not found' });
      }
        orders = await Order.find({customerId:customer}).sort({ date: -1 });
         result = await Promise.all(
          orders.map(async (order) => {
            const customerObj = await Customer.findById(order.customerId);
            return {
              customerId: order.customerId,
              customerName: customerObj ? customerObj.customerName : 'Unknown',
              orderTotalAmount: order.orderTotalAmount,
              orderDateStamp: order.orderDateStamp,
            };
          })
        );
      }
      
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ result })));
      channel.ack(msg);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify({ error: 'Error fetching orders' })));
      channel.ack(msg);
    }
  }, { noAck: false });

})();


