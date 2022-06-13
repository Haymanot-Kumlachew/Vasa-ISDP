const mongoose = require('mongoose')
const { timeout, required } = require('nodemon/lib/config')

const reportSchema = new mongoose.Schema({
    reportType: {
        type:String,
        default: "ClockIn",
        required: true
    },
    reporter:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
        // ref: 'Category'
        
    },
    teamLeader: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'users'
        //default: {reporter: new mongoose.Reporter}
    },
    numberOfWorkers:{
        type: Number

    },
    workers:[{
        name:String,
        code:String
    }],
    taskList:[{ 
        type: String
    }],
    progress:[{
        type: String
    }],
    tools:[{
        name:String,
        amount:Number,
        model:String,
        size:String
    }],
    approvalStatus: {
        type: Boolean,
        default: false
    },
    reportMessage:{
        type:String,
    },
    adminComment:{
        type: String,
    },
    //more on this
    qualityCheck:{
        type: String,
    },
    //this need to allow multiple images to be stored in an array
    reportImages:[{
        type: String
        // type:Buffer,
        // data: Buffer,
        // contentType: String
    }],
    reportTime:{
        type:Date,
        default: Date.now
    },
    site:{
        type:String,
    },
    location:{
        // type:mongoose.map(mongoose.)
    }
},
{
    timestamps: true
}
)

const Report = mongoose.model('clock reports', reportSchema);

module.exports = Report;