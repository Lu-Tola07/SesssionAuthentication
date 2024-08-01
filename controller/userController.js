const userModel = require("../model/userModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const passport = require("passport");



exports.createUser = async (req, res) => {
    try {
        const {userName, userClass, gender, email, passWord} = req.body;

        const user = await userModel.create(req.body);

        // const bcryptPassword = await bcrypt.genSaltSync(10);
        // const hashedPassword = await bcrypt.hashSync(passWord, bcryptPassword);
        
        // const data = {
        //     userName,
        //     userClass,
        //     gender,
        //     email: email.toLowerCase(),
        //     passWord: hashedPassword
        // };

        // await user.save();
        
        if(user) {
            res.status(200).json({
                message: `A new user ${user.userName}, has been created.`,
                data: user
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.homePage = async (req, res) => {
    try {
        const findName = await userModel.findOne({email: req.session.user});
        console.log(req.session);
        // if(!req.isAuthenticated) {
        //     return res.status(401).json("Permission denied, kindly log in.")
        // } else {
        //     return res.status(200).json("Welcome to my homepage.")
        // }
        if(!req.session.user) {
            return res.status(401).json({
                message: "Permission denied, kindly log in."
            })
        } else {
            return res.status(200).json({
                message: "Welcome to my homepage," + findName.userName
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.logIn = async (req, res) => {
    try {
        const {passWord, email} = req.body;

        const checkUser = await userModel.findOne({email});
        if(!checkUser) {
            return res.status(404).json("User not found.")
        }

        if(checkUser.passWord != passWord) {
            return res.status(400).json("Incorrect password.")
        }

        req.session.user = checkUser.email;

        res.status(200).json({
            message: "Login successful.",
            data: checkUser
        })
        // console.log(req);

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.logOut = (req, res) => {
    req.session.destroy()
    res.status(200).json({
        message: "Logged out."
    })
};

exports.signGoogle = passport.authenticate('google', {scope: ['email', 'profile']});

exports.redirectGoogle = passport.authenticate("google", {
    successRedirect: "/api/v1/auth/google/success",
    failureRedirect: "/api/v1/auth/google/failure"
});

exports.successGoogleRedirect = async (req,res) => {
    try {
        // await console.log(req.user._json);
        if(req.user) {
            email = req.user._json.email
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                message: "The user with this email " + email + " already exist."
            })
        } else {
            const user = await userModel.create({
                userName: req.user._json.name,
                picture: req.user._json.picture,
                email: req.user._json.email,
                sub: req.user._json.sub
            })
        }

        return res.status(200).send({
            message: "Successful."
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
