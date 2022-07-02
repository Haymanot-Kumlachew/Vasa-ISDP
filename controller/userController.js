//const bodyParser = require('body-parser');
const User = require('../models/user');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');


const userController = {
    addNewUser: async (req, res) => {
        try{
            const {
                name, 
                email, 
                password, 
                phoneNumber, 
                vasaID, 
                role, 
                site, 
                token
            } = req.body;
            const user = await User.findOne({email})
            if(user) return res.status(200).json({message: "the email already exists", status: 'error'})
            if(name ==="" || email === "" || password === "" ){
                return  res.status(200).json ({message:"Empty fields", status:'error'})
            };
            
            const newUser = new User({
                name, 
                email, 
                password, 
                phoneNumber, 
                vasaID, 
                role, 
                site, 
                token
            });

            await newUser.save()
            return res.status(200).json({message: "Registered successfully", status:'success'});
        }
        catch(error){
            return  res.status(500).json({message: error.message})
        }
    },
    login: async (req, res) =>{
        try{
            const {email, password,} = req.body;

            if (email == "" || password == "") res.json({
                status: "error", 
                message: "Empty credentials supplied"
            })
            //check if user exists
            var user = await User.findOne({email})
            if (!user) return res.status(200).json({message: "User not found", status: 'error'})
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch)
                return res.status(400).json({message: "Incorrect password."})

                 user = await User.findOne({email}).select('-password')
            // If login success , create access token and refresh token
            const accessToken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/api/users/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.status(200).json({
                accessToken, 
                message: "Login Successful", 
                data: user, 
                status: 'success'})
        }
        catch(error){
            return res.status(500).json({message: error.message, status: 'error'})
        }
    },
    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/api/users/refresh_token'})
            return res.json({message: "Logged out"})
        } catch (error) {
            return res.status(500).json({message: error.message, status: 'error'})
        }
    },
    getUser: async (req, res) =>{
        try {
            let user = await User.findById(req.user.id).select('-password')
            if(!user) return res.status(200).json({
                message: "User does not exist.", 
                status: 'error'
            })

            res.status(200).json({data: user})
        } catch (error) {
            console.log("the error is " + error.message)
            return res.status(500).json({message: error.message})
        }
    },
    deleteUser:  ('/:id',(req, res) => {
        try {
            const userID = req.query.id;
            User.findByIdAndDelete(userID, function (error, docs){
                if (error){
                    console.log(error)
                }
                else{
                    return res.status(201).json({
                        message:"user successfully deleted", 
                        status: 'success'
                    });
                }
            })
        } catch (error) {
            res.status(500).send({message: 'Server error: ' + error.message, status: 'error' });
    
        }
    }),
    updatePassword: async (req, res) => {
        console.log("update password controller");
        try {
            const  userId  =  req.user.id;
            const pass =  bcrypt.genSaltSync(10)
            const newPassword = await bcrypt.hashSync(req.body.password, pass);
            const user = await User.findOneAndUpdate(
                {_id: userId}, 
                { password: newPassword}, 
                {new: true}
                );
            if(user) return res.status(200).json({
                message:"password updated successfully", 
                status: 'success'
            });
            }
            catch(error)
            {
                return res.status(500).json({message: error.message, status: 'error'})
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
                // await res.status(201).json({message: "update successful", user});
                await res.status(201).json({message: "update successful", status: 'success'});
            }
        }catch(error){
            return res.status(500).json({message: error.message, status: 'error'})
        }
    },
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(200).json({
                message: "Please Login or Register", 
                status: 'error'})
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) =>{
                if(error) return res.status(200).json({message: "Not authenticated", status: 'error'})

                const accesstoken = createAccessToken({id: user.id})

                return res.status(200).json({
                    accesstoken, 
                    message:'token refreshed', 
                    status:'success'
                })
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message, 
                status: 'error'
            })
        }
    },
    listAllUsers: async (req, res) => {
        try{
            let users = await User.find({})
            await res.status(201).json({
                data: users, 
                message:'list of users generated', 
                status: 'success'
            })
        }  catch(error){
            res.status(500).send({message: error.message, status: 'error'});
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