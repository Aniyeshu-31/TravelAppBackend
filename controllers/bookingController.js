import Stripe from 'stripe'
import Booking from '../models/Booking.js' // Ensure this path is correct
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_URL_BACKEND)
console.log(process.env.STRIPE_URL_BACKEND)
export const createbooking = async (req, res) => {
  try {
    const { bookingDetails } = req.body

    if (!bookingDetails || bookingDetails.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No booking details provided' })
    }

    const lineItems = bookingDetails.map((booking) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: booking.tourname,
        },
        unit_amount: booking.totalAmount, // Dollars
      },
      guestSize: booking.guestSize,
    }))
    console.log('🟢 Line Items:', lineItems)
    // ✅ Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'amazon_pay'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/thank-you`,
      cancel_url: `${process.env.CLIENT_URL}/retry-booking`,
    })

    return res.status(200).json({ success: true, sessionId: session.id })
  } catch (err) {
    console.error('❌ Stripe Session Error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Stripe session creation failed',
      error: err.message,
    })
  }
}
export const getBookingDetails = async (req, res, next) => {
  const id = req.params.id
  try {
    const Book = await Booking.findById(id)
    res
      .status(200)
      .json({
        success: true,
        message: 'Booking Fetched Successfully!!',
        data: Book,
      })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'Booking not Found!',
    })
  }
}

export const getAllBookingDetails = async (req, res, next) => {
  //    const id=req.params.id;
  try {
    const Book = await Booking.find()
    res
      .status(200)
      .json({
        success: true,
        message: 'All Booking Fetched Successfully!!',
        data: Book,
      })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
    })
  }
}
