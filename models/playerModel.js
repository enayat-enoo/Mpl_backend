const mongoose = require('mongoose')

const playerSchema =  new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    number : {
        type : Number,
        required : true,
        unique : true
    },
    role : {
        type : String,
        required : true
    },
    mohallaName : {
        type : String,
        required : true
    }
},{timestamps : true})

const player =mongoose.model('players',playerSchema);

module.exports = player