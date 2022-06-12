const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please enter email'],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email invalid!')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        trim: true,
        minlength: [7, 'Minimum password length is 6 characters'],
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("not a valid password, you can't contain  ' in your password" + value);
            }
        }
    },
    phoneNumber: {
        type:Number,
        required: [true, 'please enter phone number']
    },
    gender: {
        type:String 
    },
    vasaID:{
        type:String,
        //required: true
    },
    role: {
        type: Number,
        default: 0
    },
    site:{
        type:String,
    },
    token:{
        token: {
            type: String,
            //required: true
        }
    }
},
{
    timestamps: true
}
)

// fire a function before doc saved to db bcrypt password
userSchema.pre('save', async function(next) {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

// region userSchema Method that can be accessed directly from User
userSchema.statics.findByCredentials = async (req, res, email, password) => {
    const user = await users.findOne({email})//.populate('role');
    if (!user) {
        await res.status(400).json({errors: [{message: 'Invalid Credentials'}]});
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        await res.status(400).json({errors: [{message: 'Invalid Credentials'}]});
    }

    return user;
};

// region userSchema Method that can be accessed from User individual instance
// userSchema.methods.generateAuthToken = async function () {
//     const user = this;
//     // const token = jwt.sign({"_id": user._id.toString(),"name":user.name}, "123456789");
//     const token = jwt.sign({"name":user.name}, "123456789")
//     user.tokens = user.tokens.concat({token});
//     await user.save();
//     return token;
// };

const User = mongoose.model('users', userSchema);

module.exports = User;