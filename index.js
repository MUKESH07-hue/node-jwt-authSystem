const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
//importing routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

//connecting to databse
mongoose.connect('mongodb://localhost:27017/BlogApi', () => {
    console.log('connected to database');
});

// app middleware
app.use(express.json());

//route middleware
app.use('/api/users', authRoute);
app.use('/api', postRoute);


app.listen(3000, () => {
    console.log('serving on port 3000');
})