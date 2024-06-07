import express from 'express';
import multer from 'multer';


import { addCustomerController, checkAudienceSizeController, deliveryReceiptController, getAllAudiencesController, getCampaignsController, getSingleAudience, saveAudienceController, sendEmailsController } from '../controllers/customerControllers.js';
import { addNewOrderController } from '../controllers/orderControllers.js';


const router = express.Router();

router.post('/addCustomer', addCustomerController);
router.post('/addOrder', addNewOrderController);
router.post('/getAudienceSize', checkAudienceSizeController);
router.post('/addAudience', saveAudienceController);
router.post('/sendEmails', sendEmailsController);
router.get('/getAllCampaigns', getCampaignsController);
router.get('/getAllAudiences', getAllAudiencesController);
router.get('/getSingleAudience/:audienceId', getAllAudiencesController);
router.post('/getDeliveryReceipts', getSingleAudience);
export default router;