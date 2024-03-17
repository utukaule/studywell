// const Categories = require("../models/Tags");
const Categories = require("../models/categories");

// create categories handler function

exports.createTag = async (req, res) => {
  try {
    // fetch data from body
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Field is empty, Please fillup all fields",
      });
    }

    // categories entry in db
    const tagDetails = await Categories.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "categories created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went while creating tags",
    });
  }
};

// get all tags
exports.showAllTags = async (req, res) => {
  try {
    // getting all tags usign find method
    const allTags = await Categories.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tage returned successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};