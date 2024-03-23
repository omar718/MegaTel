const mongoose = require('mongoose'); //importing mongoose library to be able to interact with the mongodb data base
const connect = mongoose.connect("mongodb://localhost:27017"); //connecting to the mongo data base server

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Creating Schema (colomons of the database)
const SignUpschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//linking the SignUpschema to the database collection(table) "members"
const collection = new mongoose.model("members", SignUpschema);

module.exports = collection; //making the collection accessible by the other files