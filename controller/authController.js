const User = require('../models/user');

//region user authentication
const userAuthentication=async(req,res)=>{
    console.log(JSON.stringify(req.body))

    try {
        const user = await User.findByCredentials(req, res, req.body.email, req.body.password);
        if (user) {
            const token = await user.generateAuthToken();
            res.status(200).send({user, token});
        }
    } catch (error) {
        res.status(500).send('Server error ' + error);
    }
}
//endregion


module.exports = {
    userAuthentication


}
