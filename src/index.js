const express = require("express"); //importing express module 

const path = require("path");  //importing path: essential for working with node js file and directory paths

const bcrypt = require('bcrypt'); //importing bcrypt module

const nodemailer = require ("nodemailer");//importing nodemailer module

const collection = require("./config"); //importing the collection module that we previously made accessible

const randomstring = require('randomstring');//importing random password generator

const app = express(); //creating an express application



// Define Port for Application(server)
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

//use EJS as the view engine (to allow dynamic html content by embedding javascript code within html template)
app.set("view engine", "ejs");

// convert data into json format (common language between browser and server)
app.use(express.json());

app.use(express.urlencoded({ extended: false }));//encoding the urls that has a post request without using complex libraries 

//define the routes(when you type localhost:5000 you get the specific login page and not 404)
app.get("", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});



// Static file (allows the application to access the files of public package without the need for additional routing)
app.use(express.static("public"));


// Sign up User
app.post("/signup", async (req, res) => { //accessing the signup file using async function that has 2 parmeters req for the incoming data and res 
                                            //for sending

    const data = { // object that contains the data
        name: req.body.username, // common request convention 
        password: req.body.password,
        email:req.body.email
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    try{
        if (existingUser) {
            res.send('User already exists. Please choose a different username.');}
            else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed one

            //random password generator
            function generateRPassword(length) {
                return randomstring.generate({
                    length: length || 8, 
                    charset: 'alphanumeric' 
                });
            }
            
            const randomPassword = generateRPassword();

            //email verification
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth:{
                    user:"silverdude47@gmail.com",
                    pass:"fvts oczk pvbt hxrt"
             
                }
            
            });


            let message = await transporter.sendMail({
                from:"silverdude47@gmail.com",
                to: data.email,
                subject:"password",
                text:"your password is "+randomPassword,
            })

            //inserting data into the data base and not executing the following code until it resolves(await)
            const userdata = await collection.insertMany(data); 
            res.send('User registered successfully.');
            console.log(userdata + "you should recieve an email with the password"+ randomPassword);

    
            /*email error message (not  used)
            
            transporter.sendMail(message).then(()=>{
             return res.status(201).json ({msg: "you should recieve an email"})
            }).catch(error=>{
                return res.status(500).json ({error})
            })*/

        }}
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');

        }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot be found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});








