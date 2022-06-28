const Report = require('../models/report')
const user = require('../models/user')
const multer = require('multer');
const fs = require('fs');
const User = require('../models/user');
const mongoose = require('mongoose');

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const isValid = FILE_TYPE_MAP[file.mimetype];
        //let uploadError = new Error('invalid image type');

        const dir = "./public/uploads"

        if(!fs.existsSync(dir)){
            fs.mkdir(dir);
        }

        // if (isValid) {
        //     uploadError = null;
        // }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // const fileName = file.originalname.split(' ').join('-');
        // const extension = FILE_TYPE_MAP[file.mimetype];
        // cb(null, `${fileName}-${Date.now()}.${extension}`);
        cb(null, file.originalname);
    }
});

const uploadOptions = multer({ storage: storage }).array('reportImages',10);

const reportController = {
    addReport:  async (req, res) =>{  
            
            // const category = await Category.findById(req.body.category);
            // if(!category) return res.status(400).send('Invalid Category')
        try{
            var newReport = new Report;
            let task =[];
            task = req.body.taskList;
            console.log({message:'the task list found are: ' + task})

            uploadOptions(req, res, function(error){
                if(error){
                    return res.status(400).json({message:"uploading error:" +error.message})
                }
                const reportedID = req.user.id;
                const {
                    reportType,
                    teamLeader,
                    numberOfWorkers,
                    progress,
                    reportMessage, 
                    location,
                    taskList,
                    site
                } = req.body;
    
                const files = req.files;
                let imagesPaths = [];
                const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                if (files) {
                    files.map((file) => {
                        imagesPaths.push(`${basePath}${file.filename}`);
                    });
                }
                else{
                    return res.status(400).send('No image in the request');
                }

                console.log({message:'impagePaths created are: ' + imagesPaths})

                newReport = new Report({
                    reportType,
                    teamLeader,
                    numberOfWorkers,
                    progress,
                    reportMessage, 
                    location,
                    site,
                    reporter:reportedID,
                    taskList,
                    reportImages: imagesPaths, // "http://localhost:3000/public/upload/image-2323232",
                });
    
                newReport.save().then(newReport => {
                    newReport === newReport; // true
    
                    if(!newReport) 
                    return res.status(500).send('The product cannot be created')

                    // else
                    // return res.status(201).json("report created successfully");
                   
                    
                  });

            })
            

            if(!task){
                return res.status(200).json({message: 'report created successfully with no task List', data: newReport})
            }

            var newReportId = newReport.id;
            updatedNewReport = await Report.findOneAndUpdate(
                {
                    id: newReportId
                },
                {
                    $push:{
                        taskList: task
                    },
                }
                );
            if(!updatedNewReport){
                return res.status(200).json({message: 'report created but taskList could not be added', data: newReport})
            }
            else{
                return res.status(200).json({message:'report added succesfully', data: updatedNewReport})
            }  
        }
        catch(error){
            res.status(500).send('Server error: ' + error);
        }
        
    },
    deleteReport: ('/:id',(req, res) => {
        try{
            const reportID = req.query.id;
            Report.findByIdAndDelete(reportID, function (error, docs){
                if (error){
                    console.log(error)
                }
                else{
                    return res.status(201).json("report successfully deleted");
                }
            })
        }catch(error){
            res.status(500).send('Server error: ' + error);
        }
    }),
    adminUpdates: async (req, res) => {
        try{
            const {approvalStatus, adminComment, qualityCheck 
            } = req.body;
            const reportId = req.query.id;
            let report = await Report.findOneAndUpdate(
                {_id: reportId},
                {
                    $set: {
                        approvalStatus, adminComment, qualityCheck
                    }
                })
            await report.save()
            if (report) {
                // await res.status(201).json({message: "update successful", user});
                await res.status(201).json({message: "report updated successfully"});
            }
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    },
    getReports: async (req, res) => {
        try{
            const report = await Report.find(filter).populate('users');

        if(!report) {
            res.status(500).json({success: false})
        } 
        res.send(report);
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    },
    gerReport: ('/:userID',async (req, res) => {
        try{

            // if(!mongoose.isValidObjectId(req.params.id)) {
            //     return res.status(400).send('Invalid user Id')
            //  }

            console.log(req.query.userID)
            const reporter = req.query.userID
            const user = await User.findById(reporter);
            if(!user) return res.status(400).send({message:'Invalid User'})
         
            //test if this gives all the reports with that user id
            //populate won't send password ofthe user
            const report = await Report.find({reporter});

        if(!report) {
            res.status(500).json({success: false, message: 'no report found'})
        }
        return res.status(200).json({
            success: true, 
            message:'reports found' ,
            data: report
        }); 
        
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    })
}

module.exports =  reportController;