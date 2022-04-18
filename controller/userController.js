const User = require('../models/user')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')

console.log('in user controller')
const userController = {
    addNewUser: async (req, res) => {
        console.log('in add new user')
        try{
            const {name, email, password, phoneNumber, vasaID, role, site, token} = req.body;
            const user = await User.findOne({email})
            if(user) return res.status(400).json({msg: "the email already exists"})
            if(full_name ==="" || username === "" || email === "" || password === "" ){
                return  res.status(400).json ({msg:"Empty fields"})}
            
            //const user = await User.findByCredentials(req, res, req.body.email, req.body.password);
            const newToken = await User.generateAuthToken()
            const newUser = new User({
                name, email, password, phoneNumber, vasaID, role, site, token: newToken
            })

            await newUser.save()
            return res.status(200).json({message: "Registered successfully"});
        }
        catch{
            return  res.status(500).json({msg: e.message})
        }
    }
}

module.exports =  userController;