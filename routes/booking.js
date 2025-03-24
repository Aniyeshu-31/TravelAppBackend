import express from 'express'
import {
  confirmBooking,
  createbooking,
  getAllBookingDetails,
  getBookingDetails,
} from '../controllers/bookingController.js'
import { verifyUser, verifyAdmin } from '../Utils/verifyToken.js'
const router = express.Router()

router.post('/', verifyUser, createbooking)
router.get('/:id', verifyUser, getBookingDetails)
router.get('/', verifyAdmin, getAllBookingDetails)
router.get('/verify-payment', verifyUser, confirmBooking)
export default router
