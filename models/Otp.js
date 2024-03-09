const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60
    }
})

// function to send emails
async function 

module.exports = mongoose.model('OTP',otpSchema)

