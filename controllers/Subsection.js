const SubSection = require('../models/SubSection')
const Section = require("../models/Section")

// create subsection

exports.createSubSection = async(req,res)=>{
    try{
        // fetch data from re body
        const {sectionId,title,timeDuration,description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success: false,
                message:"all fields are required"
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        // create subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })

        // update section with this subsection obj
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                    subSection:subSectionDetails._id
                }
            },
            {new:true}
        )
        // HW: log updated section here, after adding populate query

        // return response
        return res.status(200).json({
            success:true,
            message:"subsection creted successfully",
            updatedSection
        })
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:'something went wrong while creating SubSection'
        })
    }
}


// update subsection
    // data input
    const {title,description,timeDuration,subSection} = req.body;
    
    // validate data    
    if(!title || !description || !timeDuration){
        return res.status(400).json({
            success:false,
            message:"all fields are required",
        })
    }
    
    //update subsetion 

// delete subsection