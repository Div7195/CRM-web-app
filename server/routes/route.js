import express from 'express';
import multer from 'multer';

import { addCustomerController, checkAudienceSizeController, deliveryReceiptController, getAllAudiencesController, getCampaignsController, getCustomersController, getSingleAudience, saveAudienceController, sendAnEmailController, sendEmailsController,updateDeliveryReceiptController } from '../controllers/customerControllers.js';
import { addNewOrderController, getOrdersController } from '../controllers/orderControllers.js';
import { loginUserController } from '../controllers/loginControllers.js';
import checkAuthentication from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/addCustomer', addCustomerController);
router.get('/getCustomers',checkAuthentication, getCustomersController);
router.post('/addOrder', addNewOrderController);
router.get('/getOrders', getOrdersController);
router.post('/getAudienceSize', checkAudienceSizeController);
router.post('/addAudience', saveAudienceController);
router.post('/sendEmails', sendEmailsController);
router.post('/sendAnEmail', sendAnEmailController)
router.post('/updateDeliveryReceipt', updateDeliveryReceiptController);
router.get('/getAllCampaigns', getCampaignsController);
router.get('/getAllAudiences', getAllAudiencesController);
router.get('/getSingleAudience/:audienceId', getAllAudiencesController);
router.post('/getDeliveryReceipts', deliveryReceiptController);
// router.post('/login', loginUserController);

export default router;