const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// create rating

exports.createRating = async (req, res) => {
  try {
    // get userid
    const userId = req.user.id;

    // fetch data from req body
    const { rating, review, courseId } = req.body;

    // check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $eleMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "student is not enrolled in the course",
      });
    }

    // check if user already reviewed the course or not
    const alreadyReviewd = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewd) {
      return res.status(403).json({
        success: false,
        message: "already reviewed by the studernt",
      });
    }

    // create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with thid rating/raview
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get average rating
exports.getAverageRating = async (req, res) => {
  try {
    // get course id
    const courseId = req.body.courseId;
    // calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "rating" },
        },
      },
    ]);

    // reutrn rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if no rating/review exist
    return res.status(200).json({
      success: true,
      message: "avg rating is 0 no rating till now",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all rating
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "all reviews fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
