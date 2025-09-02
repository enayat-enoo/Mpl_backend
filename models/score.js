const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    runs : {
        type : Number
    },
    wickets :   {
        type : Number
    },
    Overs : {
        type : Number
    },
    balls : {
        type : Number
    }
})

const scoreModel = mongoose.model("scoreModel",scoreSchema)

module.exports = scoreModel