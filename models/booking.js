import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    userEmail: {
      type: String,
    },
    tourName: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
    },
    phone: {
      type: String, // Changed from Number to String for flexibility
      required: true,
    },
    bookAt: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
    },
    sessionId: {
      type: String, // To store Stripe session ID
      required: true,
      unique: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)
