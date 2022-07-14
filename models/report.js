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
    },
    site:{
        tyep:String
    },
    taskList:{
        type: String
    },
    numberOfWorkers:{
        type: Number
    },
    reportImages:[{
        type: String
    }],
    reportMessage:{
        tyep:String
    },
    progress:{
        tyep:String
    },
    workers:[{
        name:String,
        code:String,
        phoneNumber:String,
    }],
    tools:[{
        name:String,
        amount:Number,
        model:String,
        size:String
    }],
    //Admin fillouts 
    approvalStatus: {
        type: Boolean,
        default: false
    },
    adminComment:{
        tyep:String
    },
    qualityCheck:{
        tyep:String
    }, 
    //
    location:{
        tyep:String
    },
    reportTime:{
        type:Date,
        default: Date.now
    },
    
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