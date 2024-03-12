const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");
    //   if token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }
    // varify token using secret key
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      // verification issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while validating the token",
    });
  }
};

// isStudent
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for student only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be varified, please try again",
    });
  }
};

// isInstructor

exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be varified, please try again",
    });
  }
};

// isAdmin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be varified, please try again",
    });
  }
};
