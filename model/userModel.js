const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    userClass: {
        type: String
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female"],
            message: 'Gender can only either Male or Female.'
        },
        // required: true
    },
    email: {
        type: String,
        // unique: true
    },
    passWord: {
        type: String
    }
});


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;