import express from 'express';
import multer from 'multer';


import { addCustomerController } from '../controllers/customerControllers.js';
import { addNewOrderController } from '../controllers/orderControllers.js';


const router = express.Router();

router.post('/addCustomer', addCustomerController);
router.post('/addOrder', addNewOrderController);
export default router;