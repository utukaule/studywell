const Section = require("../models/Section");
const Course = require("../models/Course")
exports.section = async (req, res) => {

    try {

        // data fetch 
        const { sectionName, courseId } = req.body

        // validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "missing properties"
            })
        }

        // create section
        const newSection = await Section.create({ sectionName })

        // update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { courseId },
            {
                $push: {
                    courseContent: newSection
                }
            },
            { new: true }
        )
        // use populate to replace section/subsuction bothin theu updatedCourseDetails


        // return response
        return res.status(200).json({
            succes: true,
            message: "section created successfully",
            updatedCourseDetails,
        })
    }
    catch (error) {
        return res.status(400).json({
            succes: false,
            message: "Somthing went wrong while creating course"
        })
    }
}

// update section

exports.updateSection = async (req, res) => {
    try {

        // data input
        const { sectionName, sectionId } = req.body;


        // data validatoin
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "missing properties"
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })

        // return res
        return res.status(200).json({
            succes: true,
            message: "section updated successfully",
            updatedCourseDetails,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            succes: false,
            message: "Somthing went wrong while creating course"
        })
    }
}


// delete section

exports.deleteSection = async (req, res) => {
    try {
        // get id
        const { sectionId } = req.body
        // use findId and delete
        // response
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            succes: false,
            message: "Somthing went wrong while creating course"
        })
    }
}