const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
    firstTeam : {
        type : String,
        required : true,
    },
    secondTeam : {
        type : String,
        required: true,
    },
    date : {
        type : String
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userModel",
        required : true
    }
},{timestamps : true})

const match = mongoose.model("match",matchSchema);
match.syncIndexes();

module.exports = match