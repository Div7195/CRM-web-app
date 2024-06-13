import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';
import Audience from "../models/audience-model.js";
import CommsLogs from "../models/commslog-schema.js";
import Campaign from "../models/campaign-schema.js";
import axios from "axios";

export const addCustomerController = async (request, response) => {
    try {
        const { customerName, customerEmail } = request.body;
    
        
        if (!customerName || !customerEmail) {
          return res.status(400).json({ error: 'Name and Email are required' });
        }
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const responseQueue = 'responseQueueee2';

    await channel.assertQueue(responseQueue, { durable: true });
        
        
        channel.sendToQueue('customerQueueee', Buffer.from(JSON.stringify(request.body)), {
          persistent: true,
        });
    
        response.status(200).json({ message: 'Customers data updated' });
        setTimeout(() => {
          channel.close();
          connection.close();
        }, 500);  
      } catch (err) {
        response.status(500).json({ error: err.message });
      }
}

export const checkAudienceSizeController = async (req, res) => {
  try {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2 } = req.body;
    console.log(req.body)
    

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const responseQueue = 'responseQueue';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue };

    channel.sendToQueue('checkAudienceSizeQueue', Buffer.from(JSON.stringify(filterRequest)), {
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
    res.status(500).json({ error: error.message });
  }
};


export const saveAudienceController = async (req, res) => {
  try {
    const { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2 } = req.body.criteria;
    const name = req.body.name;
    const description = req.body.description;
    
    

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue2';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { minTotalSpend, minTotalVisits, lastMonthsNotVisited, operator1, operator2, responseQueue, name, description };
    
    channel.sendToQueue('saveAudienceQueue', Buffer.from(JSON.stringify(filterRequest)), {
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
    res.status(500).json({ error: error.message });
  }
};


export const sendEmailsController = async(req, res) => {
  try {
    const { audienceId, subject, messageBody } = req.body;
    
    
    if(!audienceId || !subject || !messageBody){
      return res.status(400).json({msg:'missing important fields'})
    }

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue3';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { audienceId, subject, messageBody, responseQueue };
    
    channel.sendToQueue('sendEmailsQueue', Buffer.from(JSON.stringify(filterRequest)), {
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
    res.status(500).json({ error: error.message });
  }
}


export const sendAnEmailController = async (req, res) => {
  try {
    const { customerId, subject, messageBody, campaignId } = req.body;
    console.log(`Sending email to customer: ${customerId} with subject: ${subject}`);
   
    await axios.post('http://localhost:8000/updateDeliveryReceipt', {campaignId, customerId });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Email failed' });
  }
};


export const updateDeliveryReceiptController = async (req, res) => {
  try {
    const { campaignId, customerId } = req.body;

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('updateDeliveryReceiptQueue', { durable: true });
    
    channel.sendToQueue('updateDeliveryReceiptQueue', Buffer.from(JSON.stringify({ campaignId, customerId })), {
      persistent: true,
    });

    await channel.close();
    await connection.close();

    res.status(200).json({ message: 'Delivery receipt update request sent' });
  } catch (error) {
    console.error('Error updating delivery receipt:', error);
    res.status(500).json({ message: 'Error updating delivery receipt' });
  }
};

export const getCampaignsController = async(req, res) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue4';

    await channel.assertQueue(responseQueue, { durable: true });
    
    if(req.query.audienceId && req.query.audienceId !== ""){
      const audienceId = req.query.audienceId
      const customerId = ""
      const filterRequest = { responseQueue, audienceId, customerId  };
      console.log(filterRequest) 
      channel.sendToQueue('getCampaignsQueue', Buffer.from(JSON.stringify(filterRequest)), {
      persistent: true,
    });
    }else if(req.query.customerId && req.query.customerId !== ""){
      const customerId = req.query.customerId
      const audienceId = ""
      const filterRequest = { responseQueue, audienceId, customerId  };
      console.log(filterRequest) 
      channel.sendToQueue('getCampaignsQueue', Buffer.from(JSON.stringify(filterRequest)), {
      persistent: true,
    });
    }
    
    

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

export const deliveryReceiptController = async (req, res) => {
  try {
    console.log(req.body);
    const { campaignId } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const audience = await Audience.findById(campaign.audienceId);
    if (!audience) {
      return res.status(404).json({ error: 'Audience not found' });
    }
    const customers = audience.customers;
    const deliveryReceipts = customers.map(customer => {
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      return {
        customerId: customer._id,
        status
      };
    });

    const sentCount = deliveryReceipts.filter(receipt => receipt.status === 'SENT').length;
    const failedCount = deliveryReceipts.filter(receipt => receipt.status === 'FAILED').length;
    const totalCount = deliveryReceipts.length;

    const sentPercentage = (sentCount / totalCount) * 100;
    const failedPercentage = (failedCount / totalCount) * 100;

    await CommsLogs.create({
      campaignId,
      customerReceipts: deliveryReceipts
    });

    res.status(201).json({
      message: 'Delivery receipts created successfully',
      sentPercentage: sentPercentage.toFixed(2),
      failedPercentage: failedPercentage.toFixed(2)
    });
  } catch (error) {
    console.error('Error creating delivery receipts:', error);
    res.status(500).json({ error: 'Error creating delivery receipts' });
  }
};

export const getAllAudiencesController = async(req, res) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue5';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { responseQueue };
    
    channel.sendToQueue('getAudiencesQueue', Buffer.from(JSON.stringify(filterRequest)), {
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
    res.status(500).json({ error: error.message });
  }
}

export const getSingleAudience = async(req, res) => {
  try {
    const{audienceId} = req.params
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue6';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { audienceId, responseQueue };
    
    channel.sendToQueue('getSingleAudienceQueue', Buffer.from(JSON.stringify(filterRequest)), {
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
}

export const getCustomersController = async(req, res) => {

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseGetCustomerssss1';

    await channel.assertQueue(responseQueue, { durable: true });
    const audienceId = req.query.audienceId
    const filterRequest = { responseQueue, audienceId };
    
    channel.sendToQueue('getCustomerssssQueue', Buffer.from(JSON.stringify(filterRequest)), {
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