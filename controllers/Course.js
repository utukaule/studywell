const Course = require('../models/Course')
const Tag = require("../models/Tags")
const Uesr = require("../models/User")

exports.course = async (req, res) => {
    try {

        // fetch data from DB
        const { courseName, //mendetory
            courseDescription, //mendetory 
            instructor, //mendetory
            whatYouWillLearn,//mendetory
            courseContent, //mendetory
            ratingAndReviews,
            price, //mendetory
            thumbnail, //mendetory
            tag, //mendetory
            studentEnrolled
        } = req.body;

        // validation for above medetory fields
        if (!courseName || courseDescription || instructor || whatYouWillLearn || courseContent || price || thumbnail || tag) {
            return res.status(400).json({
                success: false,
                message: "Please fillup all required field"
            })
        }



        // valide the user as a instructor or not
        const userVerification = await User.findOne({ email });
        if (!userVerification) {
            return res.status(400).json({
                success: false,
                message: "User not found please create account as a instructor",
            })
        }

        // validation for instructor (like instuctor is new or not)
        const userCategory = await Course.find({ accountType })

        // valide the role
        if (userCategory.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "You cant create course because you are not instructor, To became instructor signup as a instructor",
            })
        }

        // find all students
        const allStudents = await Course.find([studentEnrolled])
        if(allStudents.length ==0){
            res.json({
                success:true,
                message:"No student enrolled this course "
            })
        }
        else if(allStudents.length > 0){
            res.json({
                success:true,
                message:`${allStudents.length} students enrolled this course`
            })
        }
        
        // create entry in DB with this course

        const newCourse = await Course.create({
            courseName: courseName, //mendetory
            courseDescription: courseDescription, //mendetory 
            instructor: instructor, //mendetory
            whatYouWillLearn: whatYouWillLearn,//mendetory
            courseContent: courseContent, //mendetory
            ratingAndReviews: ratingAndReviews,
            price: price, //mendetory
            thumbnail: thumbnail, //mendetory
            tag: tag, //mendetory
            studentEnrolled: allStudents
        })


        // return response
        return res.status(200).json({
            success: true,
            message: "Creating course field is done now upload section and subsection"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Somthing went wrong while uploading course data"
        })
    }



}