//const bodyParser = require('body-parser');
const User = require('../models/user')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
    addNewUser: async (req, res) => {
        try{
            const {name, email, password, phoneNumber, vasaID, role, site, token} = req.body;
            const user = await User.findOne({email})
            if(user) return res.status(400).json({msg: "the email already exists"})
            if(name ==="" || email === "" || password === "" ){
                return  res.status(400).json ({msg:"Empty fields"})}
            
            const newUser = new User({
                name, email, password, phoneNumber, vasaID, role, site, token
            })

            await newUser.save()
            return res.status(200).json({message: "Registered successfully"});
        }
        catch(e){
            return  res.status(500).json({msg: e.message})
        }
    },
    login: async (req, res) =>{
        try{
            const {email, password,} = req.body;

            if (email == "" || password == "") res.json({status: "Failed", message: "Empty credentials supplied",})
            //check if user exists
            const user = await User.findOne({email})
            if (!user) return res.status(400).json({msg: "User not found"})
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch)
                return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/api/users/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({accesstoken, msg: "Login Successful"})
        }
        catch(e){
            return res.status(500).json({msg: e.message})
        }
    },
    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/api/users/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) =>{
        try {
            let user = await User.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user)
        } catch (err) {
            console.log("the error is " + e.message)
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser:  ('/:id',(req, res) => {
        try {
            const userID = req.query.id;
            User.findByIdAndDelete(userID, function (err, docs){
                if (err){
                    console.log(err)
                }
                else{
                    return res.status(201).json("user successfully deleted");
                }
            })
        } catch (error) {
            res.status(500).send('Server error: ' + error);
    
        }
    }),
    updatePassword: async (req, res) => {
        console.log("update password controller");
        try {
            const  userId  =  req.user.id;
            const pass =  bcrypt.genSaltSync(10)
            const newPassword = await bcrypt.hashSync(req.body.password, pass);
            const user = await User.findOneAndUpdate({_id: userId}, { password: newPassword}, {new: true});
            if(user) return res.status(200).json("password updated successfully");
            }
            catch(err)
            {
                return res.status(500).json({msg: err.message})
            }
    },
    updateUserInfo: async (req, res) => {
        const {name,
            gender,
            email,
            phoneNumber,
            site
        } = req.body;
        const userID = req.query.id;
        console.log("user ID is " + userID)
        try{
            let user = await User.findOneAndUpdate(
                {_id: userID},
                {
                    $set: {
                        name,
                        gender,
                        email,
                        phoneNumber,
                        site
                    }
                })
            await user.save()
            if (user) {
                // await res.status(201).json({msg: "update successful", user});
                await res.status(201).json({msg: "update successful"});
            }
        }catch(e){
            return res.status(500).json({msg: e.message})
        }
    },
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Not authenticated"})

                const accesstoken = createAccessToken({id: user.id})

                return res.json({user, accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listAllUsers: async (req, res) => {
        try{
            let users = await User.find({})
            await res.status(201).json({
                users})
        }  catch(e){
            res.status(500).send(e);
        }
    }   
}
const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports =  userController;