import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";


//get All reviews
export const getAllReviews = async(req,res)=>{
    try
    {
        const reviews = await Review.find({})
                                            .sort({rating: "desc"})
                                            .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image",
                                                })
                                            .populate({
                                                path:"doctor",
                                                select:"coureName",
                                            }).exec();

        res.status(200).json({
            success:true,
            message:"Successful",
            data:reviews,
        })

    }catch(err)
    {
        res.status(404).json({
            success:false,
            message:"Reviews Not found ",
        })
    }
}

//create review
export const createReview = async(req,res)=>{

    if(!req.body.doctor) req.body.doctor = req.params.doctorId;
    if(!req.body.user) req.body.user = req.userId;


    const newReview = new Review(req.body);

    try{
        const savedReview = await newReview.save();
        console.log("SAVES: ", savedReview);

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: {reviews: savedReview._id}
        });


        res.status(200).json({
            success:true,
            message:"Review submitted",
            data: savedReview,
        });

    }catch(err)
    {
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}