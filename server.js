const express = require("express");
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
//const path = require('path')


const userRoute = require('./routes/user')
const connectDB = require('./config/db');

connectDB();

const app = express() ;
app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.use('/api/user', userRoute);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}`));