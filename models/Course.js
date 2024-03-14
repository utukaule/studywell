const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim:true,
        required:true
    },
    courseDescription:{
        type:String,
        trim: true,
        required: true
    },
    instructor:{
        type:String,
        required:true,
        trim:true
    }, 
    whatYouWillLearn:{
        type:String,
        trim:true,
        required:true
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
        ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag"
    },
    studentEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User',

        }
    ]

})


module.exports = mongoose.model('Course',courseSchema)