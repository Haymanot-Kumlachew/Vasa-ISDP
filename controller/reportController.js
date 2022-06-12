const Report = require('../models/report')

const reportController = {
    addReport: async (req, res) => {
        try{
            //const workers = req.body.workers
            const {reportType, teamLeader, 
                numberOfWorkers, workers, taskList, progress, 
                tools, reportMessage, reportImages, 
                //reportTime, location
                site} = req.body;
            const {reporter} = req.query;
            if(teamLeader ==="" || reportMessage === "" || reportImages === "" ){
                return  res.status(400).json ({message:"Empty fields"})}

            const newReport = new Report({
                reportType, teamLeader, numberOfWorkers, 
                workers, taskList, progress, tools, reportMessage, 
                reportImages,reporter, 
                //reportTime, location
            })
            await newReport.save()
            return res.status(200).json({message: "Reported Successfully"});
        }
        catch(e){
            return  res.status(500).json({message: e.message})
        }
    },
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
    }
}

module.exports =  reportController;