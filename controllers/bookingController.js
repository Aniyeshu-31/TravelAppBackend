import Stripe from 'stripe'
import Booking from '../models/booking.js' // Ensure this path is correct
import dotenv from 'dotenv'

dotenv.config()

// ✅ Use the correct Stripe key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY)

export const createbooking = async (req, res) => {
  try {
    const { bookingDetails } = req.body

    if (!bookingDetails || bookingDetails.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No booking details provided' })
    }

    // ✅ Construct Line Items for Stripe Checkout
    const lineItems = bookingDetails.map((booking) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: booking.tourname },
        unit_amount: Math.round(booking.price), // Convert to cents
      },
      quantity: booking.guestSize,
    }))

    // ✅ Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:`${process.env.CLIENT_URL}/thank-you`,
      cancel_url: `${process.env.CLIENT_URL}/retry-booking`,
    })

        if (!session || !session.id) {
          throw new Error('Failed to create Stripe session')
        }
    
    // ✅ Save the Booking with the Stripe Session ID


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
    const { sessionId } = req.body // ✅ Get sessionId from req.body

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: 'Session ID is required' })
    }

    // ✅ Find and update the booking status
    // const updatedBooking = await Booking.findOneAndUpdate(
    //   { stripeSessionId: sessionId },
    //   { status: 'confirmed' },
    //   { new: true }
    // )
         const newBooking = new Booking({
           userId: bookingDetails[0].userId,
           userEmail: bookingDetails[0].userEmail,
           tourname: bookingDetails[0].tourname,
           fullName: bookingDetails[0].fullName,
           phone: bookingDetails[0].phone,
           guestSize: bookingDetails[0].guestSize,
           totalAmount: bookingDetails[0].price,
           bookAt: bookingDetails[0].bookAt || new Date(),
           sessionId: sessionId,
           status: 'confirmed', // Mark as confirmed when payment is confirmed
         })

         await newBooking.save()
    // if (!updatedBooking) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: 'Booking not found' })
    // }

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed',
      data: newBooking,
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

export const getBookingDetails = async (req, res) => {
  const id = req.params.id
  try {
    const book = await Booking.findById(id)
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found!' })
    }
    res.status(200).json({
      success: true,
      message: 'Booking Fetched Successfully!!',
      data: book,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
    })
  }
}

export const getAllBookingDetails = async (req, res) => {
  try {
    const bookings = await Booking.find()
    res.status(200).json({
      success: true,
      message: 'All Bookings Fetched Successfully!!',
      data: bookings,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
    })
  }
}
