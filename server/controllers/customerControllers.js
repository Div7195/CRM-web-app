import Customer from "../models/customer-schema.js";
import Order from "../models/order-schema.js";
import amqp from 'amqplib';
import Audience from "../models/audience-model.js";
import DeliveryReceipt from "../models/commslog-schema.js";
import Campaign from "../models/campaign-schema.js";
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

export const getCampaignsController = async(req, res) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const responseQueue = 'responseQueue4';

    await channel.assertQueue(responseQueue, { durable: true });

    const filterRequest = { responseQueue };
    
    channel.sendToQueue('getCampaignsQueue', Buffer.from(JSON.stringify(filterRequest)), {
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

export const deliveryReceiptController = async(req, res) => {
  try {
    console.log(req.body)
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
    await DeliveryReceipt.create({
      campaignId,
      customerReceipts: deliveryReceipts
    });

    res.status(201).json({ message: 'Delivery receipts created successfully' });
  } catch (error) {
    console.error('Error creating delivery receipts:', error);
    res.status(500).json({ error: 'Error creating delivery receipts' });
  }
}

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