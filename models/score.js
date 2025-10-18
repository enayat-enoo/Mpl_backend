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
    },
    matchDetails : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "match",
      required : true,
    }
})

const scoreModel = mongoose.model("scoreModel",scoreSchema)
scoreModel.syncIndexes();

module.exports = scoreModel