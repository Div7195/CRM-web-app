import express from 'express';
import multer from 'multer';

import { addCustomerController, checkAudienceSizeController, deliveryReceiptController, getAllAudiencesController, getCampaignsController, getCustomersController, getSingleAudience, saveAudienceController, sendEmailsController } from '../controllers/customerControllers.js';
import { addNewOrderController, getOrdersController } from '../controllers/orderControllers.js';
import { loginUserController } from '../controllers/loginControllers.js';


const router = express.Router();

router.post('/addCustomer', addCustomerController);
router.get('/getCustomers', getCustomersController);
router.post('/addOrder', addNewOrderController);
router.get('/getOrders', getOrdersController);
router.post('/getAudienceSize', checkAudienceSizeController);
router.post('/addAudience', saveAudienceController);
router.post('/sendEmails', sendEmailsController);
router.get('/getAllCampaigns', getCampaignsController);
router.get('/getAllAudiences', getAllAudiencesController);
router.get('/getSingleAudience/:audienceId', getAllAudiencesController);
router.post('/getDeliveryReceipts', getSingleAudience);
// router.post('/login', loginUserController);

export default router;