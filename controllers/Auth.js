const User = require("../models/User");
const OTP = require("../models/Otp");
const optGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp for signup
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });
    // if user exist, then return a response
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate OTP
    let otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated ", otp);

    // check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    // checking that new generated opt is unique or not
    while (result) {
      otp = optGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const result = await OTP.findOne({ otp: otp });
    }

    // creating payload to store otp in db
    const otpPayload = { email, otp };

    // create an entry in db
    const otpBody = await OTP.create(otpPayload);
    // return response successfully
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ******************************************************
// signup
exports.signup = async (req, res) => {
  try {
    // fetch data form request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // check all fields are field or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !contactNumber
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 password match kalo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword does not match, try again.",
      });
    }

    // check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered.",
      });
    }

    // find most recent opt stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 }) //in this -1 means that sorting in descending order so the most recent OTP document (based on its createdAt timestamp) will be the first one in the result set
      .limit(1);
    console.log(recentOtp);

    // validate otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp) {
      // Invalid OPT check
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstNama,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "user is registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user cannot be registered, please try again",
    });
  }
};

// ******************************************************
// login
exports.login = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }
    // user check exists or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    // generate JWT, after matching password
    if (bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      // creating jwt token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Data(Date.now() + 3 * 24 * 60 * 60 * 100),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure, please try again",
    });
  }
};


// ******************************************************
// changePassword
exports.changepassword = async (req, res) => {
  // get data from req body
  // get old password, newpassword, confirmnewpassword
  // validation
  // update pws in DB
  // send mail - password updated
  // return response
};
