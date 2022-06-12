const express = require("express");
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const fs = require('fs');
const path = require('path')


const userRoute = require('./routes/user')
const reportRoute = require('./routes/clockReport')
const connectDB = require('./config/db');

connectDB();

const app = express() ;
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors());

app.use('/api/users', userRoute);
app.use('/api/report', reportRoute);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Listening on port ${port}`));