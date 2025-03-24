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
        product_data: { name: booking.tourname },
        unit_amount: Math.round(booking.price), // Convert to cents
      },
      quantity: booking.guestSize,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/retry-booking`,
    })
    //  userId: user && user._id,
    // userEmail: user && user.email,
    // tourname: title,
    // fullName: '',
    // phone: '',
    // guestSize: 1,
    // bookAt: '',

    // ✅ Save the booking with the session ID
    const newBooking = new Booking({
      userId: bookingDetails[0].userId,
      tourname: bookingDetails[0].tourname,
      fullName: bookingDetails[0].fullName,
      phone: bookingDetails[0].phone,
      guestSize: bookingDetails[0].guestSize,
      totalAmount: bookingDetails[0].price,
      stripeSessionId: session.id,
      status: 'pending', // Mark as pending until payment is confirmed
    })

    await newBooking.save()

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

export const confirmBooking = async (req, res) => {
  try {
    const { sessionId } = req.query

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Session ID is required' })
    }

    // ✅ Find and update the booking
    const updatedBooking = await Booking.findOneAndUpdate(
      { stripeSessionId: sessionId },
      { status: 'confirmed' },
      { new: true }
    )

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed',
      data: updatedBooking,
    })
  } catch (err) {
    console.error('❌ Booking Confirmation Error:', err.message)
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: err.message,
    })
  }
}

export const getBookingDetails = async (req, res, next) => {
  const id = req.params.id
  try {
    const Book = await Booking.findById(id)
    res.status(200).json({
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
    res.status(200).json({
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
