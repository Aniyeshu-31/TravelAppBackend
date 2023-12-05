import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
export const createReview = async(req,res,next)=>{
    
    const tourId=req.params.tourId;
    const newReview = new Review({...req.body});

    try {
        const savedReview = await newReview.save();

        await Tour.findByIdAndUpdate(tourId,{
            $push:{reviews:savedReview}
        })
        res.status(200).json({success:true,message:'Review Submitted',data:savedReview})
        }
     catch (err) {
        res.status(401).json({success:false,message:'Failed to Submit the Review'});
    }
}
