const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// resetPassword token...
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing the url
    await mailSender(
      email,
      "Reset Password link",
      `Password Reset Link: ${url}`
    );

    // return response
    return res.json({
      success: true,
      message:
        "Email sent successfully, Please check email and chenge password",
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password",
    });
  }
};



























// reset password (updating password in DB)...
exports.restPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }

    // get user details from db using token
    const userDetails = await User.findOne({ token: token });

    // if no entry -> invalide token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // token ka time bhi check krlo
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, Please regenerate your token",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    await userDetails.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    // response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Somthing went wrong in password reset ",
    });
  }
};
