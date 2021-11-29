const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nameOfCandidate:{
        type:String, 
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        minlength:10,
        maxlength:10
    },
    dob:{
        type:String
    },
    workExperience : String,
    resumeTitle : String,
    currentLocation : String,
    postalAddress : String,
    currentEmployer : String,
    currentDesignation : String
});

module.exports = mongoose.model('Person',dataSchema);
