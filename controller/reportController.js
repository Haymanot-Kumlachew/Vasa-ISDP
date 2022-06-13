const Report = require('../models/report')
const users = require('../models/user')
const multer = require('multer');

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('invalid image type');

//         if (isValid) {
//             uploadError = null;
//         }
//         cb(uploadError, 'public/uploads');
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`);
//     }
// });

// const uploadOptions = multer({ storage: storage });

const reportController = {
    addReport:  ('/:id', async (req, res) => {
        try{
            // const file = req.file;
            // if (!file) return res.status(400).send('No image in the request');

            // const fileName = file.filename;
            // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            const reporterId = req.query.id;
            //const workers = req.body.workers
            const {
                reportType,
                teamLeader,
                numberOfWorkers, 
                workers, 
                taskList,
                progress, 
                tools, 
                reportMessage, 
                reportImages, 
                location,
                //reportTime, reporter
                site} = req.body;
           
            if(teamLeader ==="" || reportMessage === "" || reportImages === "" ){
                return  res.status(400).json ({message:"Empty fields"})}

            const newReport = new Report({
                reportType,
                teamLeader, 
                numberOfWorkers, 
                workers, 
                taskList, 
                progress, 
                tools, 
                reportMessage, 
                // reportImages:`${basePath}${fileName}`,
                reporter:reporterId,
                location,
                site
                //reportTime
            })
            await newReport.save()
            return res.status(200).json({message: "Reported Successfully"});
        }
        catch(e){
            return  res.status(500).json({message: e.message})
        }
    }),
    deletedReport: ('/:id',(req, res) => {
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
        }catch(e){
            res.status(500).send('Server error: ' + error);
        }
    }),
    adminUpdates: async (req, res) => {
        const {approvalStatus, adminComment, qualityCheck 
        } = req.body;
        const reportId = req.query.id;
        try{
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
        }catch(e){
            return res.status(500).json({message: e.message})
        }
    },
    getReports: async (req, res) => {
        const report = await Report.find(filter).populate('users');

        if(!report) {
            res.status(500).json({success: false})
        } 
        res.send(report);
    },
    gerRepot: async (req, res) => {
        const report = await Report.findById(req.params.id).populate('users');

        if(!report) {
            res.status(500).json({success: false})
        } 
        res.send(report);
    }
}

module.exports =  reportController;