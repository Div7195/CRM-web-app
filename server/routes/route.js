import express from 'express';
import multer from 'multer';


import { addCustomerController, checkAudienceSizeController, saveAudienceController } from '../controllers/customerControllers.js';
import { addNewOrderController } from '../controllers/orderControllers.js';


const router = express.Router();

router.post('/addCustomer', addCustomerController);
router.post('/addOrder', addNewOrderController);
router.post('/getAudienceSize', checkAudienceSizeController);
router.post('/addAudience', saveAudienceController);
export default router;