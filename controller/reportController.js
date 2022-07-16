const Report = require('../models/report')
const multer = require('multer');
const User = require('../models/user');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },

    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        // const extension = file.mimetype;
        cb(null, `${Date.now()}-${fileName}`);
    }
});

const uploadOptions = multer({ storage: storage }).array('reportImages',20);

const reportController = {
    addReport:  async (req, res) =>{  
            try{
                var newReport = new Report;

                uploadOptions(req, res, function(error){
                    if(error){
                        return res.status(400).json({message:"uploading error:" +error.message})
                    }
                    const reportedID = req.user.id;
                    const {
                        reportType,
                        teamLeader,
                        site,
                        taskList,
                        numberOfWorkers,
                        reportMessage,
                        progress,
                        location,
                    } = req.body;
        
                    const files = req.files;
                    let imagesPaths = [];
                    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                    if (files) {
                        files.map((file) => {
                            imagesPaths.push(`${basePath}${file.filename}`);
                        });
                    }
                    // else{
                    //     return res.status(400).send('No image in the request');
                    // }

                    console.log({message:'impagePaths created are: ' + imagesPaths})

                    newReport = new Report({
                        reportType,
                        reporter:reportedID,
                        teamLeader,
                        site,
                        taskList,
                        numberOfWorkers,
                        reportImages: imagesPaths, // "http://localhost:3000/public/upload/image-2323232",
                        reportMessage,
                        progress,
                        location,
                    });
        
                    newReport.save().then(newReport => {
                        newReport === newReport; // true
        
                        if(newReport) 
                        return res.status(200).json({
                            message: 'report created successfully', 
                            data: newReport,
                            status: 'success',
                        })
                    });
                }) 
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
    getReport: ('/:userID',async (req, res) => {
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