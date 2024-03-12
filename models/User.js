const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstNama:{
        type:String,
        required:true,
        trim:true
    },
    LastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        tryp:String,
        required:true,
        trim:true
    },
    password:{
        tryp:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],

    image:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress"
        }
    ]
     

})

const User = mongoose.model("User",userSchema) 
module.exports = User;