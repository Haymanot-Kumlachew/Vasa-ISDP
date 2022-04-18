const mongoose = require('mongoose')
const { timeout, required } = require('nodemon/lib/config')

const userSchema = new mongoose.Schema({
    reportType: {
        type:String,
        default: "ClockIn",
        required: true
    },
    reportMessage:{
        type:String,
    },
    reportImage:{
        type:Buffer,
        required: true
    },
    user:{
        type:ObjectId,
        required: true
    },
    reportTime:{
        type:Date
    },
    site:{
        type:String,
    },
    location:{
        type:MongooseMap
    }
},
{
    timestamps: true
}
)