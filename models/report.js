const mongoose = require('mongoose')
const { timeout, required } = require('nodemon/lib/config')

const reportSchema = new mongoose.Schema({
    reportType: {
        type:String,
        default: "ClockIn",
        // required: [true, 'report type not specified'],
    },
    reporter:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'users',
        // required: [true, 'user not recognised'],
        // ref: 'Category'
        
    },
    teamLeader: {
        type:  String,
        // required: [true, 'teamLeader not declared'],
        // ref:'users'
        //default: {reporter: new mongoose.Reporter}
    },
    numberOfWorkers:Number,
    workers:[{
        name:String,
        code:String,
        phoneNumber:String,
    }],
    taskList:[{
        type: String
    }],
    progress:String,
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
    reportMessage:String,
    adminComment:String,
    //more on this
    qualityCheck:String, 
    //this need to allow multiple images to be stored in an array
    reportImages:[{
        type: String
    }],
    reportTime:{
        type:Date,
        default: Date.now
    },
    site:String,
    location:String
},
{
    timestamps: true
}
)

reportSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

reportSchema.set('toJSON', {
    virtuals: true,
});

const Report = mongoose.model('clock reports', reportSchema);

module.exports = Report;