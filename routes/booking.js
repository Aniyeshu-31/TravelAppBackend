import express from 'express';
import { createbooking, getAllBookingDetails, getBookingDetails } from '../controllers/bookingController.js';
import { verifyUser,verifyAdmin } from '../Utils/verifyToken.js';
const router= express.Router();

router.post('/',verifyUser,createbooking)
router.get('/:id',verifyUser,getBookingDetails)
router.get('/',verifyAdmin,getAllBookingDetails)

export default router;