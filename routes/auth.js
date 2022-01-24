const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//import validation
const { registerValidation, loginValidation } = require('../validation');
const user = require('../models/User');

//register route
router.post('/register', async (req, res) => {

    //lets validate data before we make a user
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    //check if user is lareday presnt in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('email already exists!!')
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating a user
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        await user.save();
        res.status(400).send({ user: user._id })
    }
    catch (err) {
        res.status(400).send(err);
    }
});


//login route
router.post('/login', async (req, res) => {
    //lets validate data before we login
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    //check if user is correct or not
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Invalid email or password')
    }


    //check if the password is correct or not
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(400).send('Invalid eamil or password')
    }

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    return res.cookie("cookie", token, {
        httpOnly: true,
    }).status(200).json({
        message: "Succesfully logged in",
        data: token
    })
})

//logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("cookie").status(200).json({
        message: "logged out ",
    });
});

module.exports = router;