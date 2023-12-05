import Booking from '../models/booking.js'
export const createbooking = async(req,res,next)=>{
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        res.status(200).json({success:true,message:'Booking Saved Successfully!!',data:savedBooking});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Booking not saved successfully!!'
        });
    }
}

export const getBookingDetails= async(req,res,next)=>{
   const id=req.params.id;
   try {
      const Book = await Booking.findById(id);
      res.status(200).json({success:true,message:'Booking Fetched Successfully!!',data:Book});
   } catch (err) {
    res.status(404).json({
        success:false,
        message:'Booking not Found!'
    });
   }
}

export const getAllBookingDetails= async(req,res,next)=>{
//    const id=req.params.id;
   try {
      const Book = await Booking.find( );
      res.status(200).json({success:true,message:'All Booking Fetched Successfully!!',data:Book});
   } catch (err) {
    res.status(500).json({
        success:false,
        message:'Internal Server Error!'
    });
   }
}