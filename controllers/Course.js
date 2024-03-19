const Course = require("../models/Course");
const Categories = require("../models/categories");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
exports.course = async (req, res) => {
  try {
    // fetch data from DB
    const {
      courseName, //*
      courseDescription, //*
      whatYouWillLearn, //*
      price, //*
      categories, //*
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation for above medetory fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !thumbnail ||
      !categories
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check instructor
    const userId = req.user.id;
    const instructorDetails = await User.find(userId);
    console.log("instructor Details: ", instructorDetails);

    // validate instructor
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor detail not found",
      });
    }

    // categories validation
    const tagDetails = await Categories.findById(categories);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "categories details not found",
      });
    }

    // upload imageon cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create entry in DB with this course
    const newCourse = await Course.create({
      courseName, //*
      courseDescription, //*
      instructor: instructorDetails._id, //*
      whatYouWillLearn, //*
      price: price, //*
      thumbnail: thumbnailImage._id, //*
      categories: tagDetails.secure_url, //*
    });

    // Now add new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // update categories ka schema
    // todo: HW
    await Categories.findByIdAndUpdate(
      { id: tagDetails._id },
      {
        $push: {
          categories: tagDetails._id,
        },
      },
      { new: true }
    );

    //update the TAG ka schema
    //TODO: HW

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong while uploading course data",
    });
  }
};

// showAllCourses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourse = await Course.find({});

    return res.status(200).json({
      success: true,
      message: "all courses data fetched successfully",
      data: allCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};
