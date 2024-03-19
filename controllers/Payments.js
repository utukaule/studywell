const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");

const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: webhooks } = require("razorpay/dist/types/webhooks");

// capture the payment and initial razorpay order
exports.capturePayment = async (req, res) => {
  // get courseId and userId
  const { course_id } = req.body;
  const userId = req.user.id;

  // validation

  // valid courseid
  if (!course_id) {
    return res.json({
      success: false,
      message: "please provide valid course id",
    });
  }

  // valid couserDetails
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "could not find the course",
      });
    }

    // user already payed for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is enrolled already...",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 1000,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };

  try {
    // initiate the payment
    const paymentResponse = await instancen.orders.create(options);
    console.log(paymentResponse);

    return res.status(200).json({
      success: true,
      message: "course purchesed successfully",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "could not initiate order",
    });
  }
};

// varify signature of razorpay and server
exports.varifySignature = async (req, res) => {
  const wabhookSecret = "1234567";
  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256", webhooks);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature == digest) {
    console.log("payment is athorised");
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // fullfill the action

      // find the course and enroll student init
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "course not found",
        });
      }
      console.log(enrolledCourse);

      //find the student and add the course to there enrolled course
      const enrolledstudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledstudent);

      // mail sender to send email to student so know about course he purchesed
      const emailResponse = await mailSender(
        enrolledstudent.email,
        "congrats from codeLearn",
        "congrats you are enrolled in course"
      );
      console.lot(emailResponse);
      return res.status(200).json({
        success: true,
        message: "signature varified and course added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  else{
    return res.status(400).json({
        success:false,
        message:'invalide request'
    })
  }
};
