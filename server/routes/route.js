import express from 'express';
import multer from 'multer';

import { addCustomerController, checkAudienceSizeController, deliveryReceiptController, getAllAudiencesController, getCampaignsController, getCustomersController, getSingleAudience, saveAudienceController, sendAnEmailController, sendEmailsController,updateDeliveryReceiptController } from '../controllers/customerControllers.js';
import { addNewOrderController, getOrdersController } from '../controllers/orderControllers.js';
import checkAuthentication from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/addCustomer',checkAuthentication, addCustomerController);
router.get('/getCustomers',checkAuthentication, getCustomersController);
router.post('/addOrder',checkAuthentication, addNewOrderController);
router.get('/getOrders',checkAuthentication, getOrdersController);
router.post('/getAudienceSize',checkAuthentication, checkAudienceSizeController);
router.post('/addAudience',checkAuthentication, saveAudienceController);
router.post('/sendEmails',checkAuthentication, sendEmailsController);
router.post('/sendAnEmail',checkAuthentication, sendAnEmailController)
router.post('/updateDeliveryReceipt',checkAuthentication, updateDeliveryReceiptController);
router.get('/getAllCampaigns',checkAuthentication, getCampaignsController);
router.get('/getAllAudiences',checkAuthentication, getAllAudiencesController);
router.get('/getSingleAudience/:audienceId',checkAuthentication, getAllAudiencesController);
router.post('/getDeliveryReceipts',checkAuthentication, deliveryReceiptController);

export default router;