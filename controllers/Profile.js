const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // get userId
    const id = req.user.id;

    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // response
    return res.status(200).json({
      success: true,
      message: "profile updated successfullu",
      profileDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      message: "somthing went wrong while updating profile data...",
    });
  }
};

// delete account

exports.deletaAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;

    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user not found to delete account",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // HW: unenroll user from all enrolled courses

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "user account deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "spmthing went wrong while deleting account",
    });
  }
};
