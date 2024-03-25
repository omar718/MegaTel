//checking the the environment variables
if (process.env.NODE_ENV !== "production") {//checking wehther we are on a production or development environment
    require("dotenv").config() //loading the dotenv module and using its .config method to read .env file
}

const express = require("express"); //importing express module 

const path = require("path");  //importing path: essential for working with node js file and directory paths

const bcrypt = require('bcrypt'); //importing bcrypt module

const nodemailer = require ("nodemailer");//importing nodemailer module

const collection = require("./config"); //importing the collection module that we previously made accessible

const randomstring = require('randomstring');//importing random password generator

const app = express(); //creating an express application

const passport = require("passport")//importing passport module

const initializePassport = require("./passport-config")//importing the 'initialise' function that we previously made accessible

const flash = require("express-flash"); //importing flash module

const session = require("express-session"); //importing express-session module

const methodOverride = require("method-override"); //importing method-override module




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

//configuration of the session for security purposes
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}));

//configuration of the used modules
app.use(flash());
app.use(passport.initialize()); 
app.use(passport.session());

app.use(methodOverride("_method"));

//define the routes(when you type localhost:5000 you get the specific login page and not 404)
app.get("", (req, res) => {
    res.render("login");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/home", (req, res) => {
    res.render("home");//besides the home page we will also render the first name as a username 
});
//{username: req.data.firstName}


// Static file (allows the application to access the files of public package without the need for additional routing)
app.use(express.static("front"));

initializePassport(
    passport,
    email => collection.findOne({ email: email }), // Use exec() to return a promise
    id => collection.findOne({ id: id }) // Use exec() to return a promise
);

// Sign up User
// Configuring the register post functionality
app.post("/signup", async (req, res) => { //accessing the signup file using async function that has 2 parmeters req for the incoming data and res 
                                            //for sending

    /*
    try{
        //const { firstName, lastName, email, dateOfBirth, nationality, language, level } = req.body;

        // Valider les données
        /*if (!firstName || !lastName || !email || !dateOfBirth /*|| !nationality || !language || !level) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }*/

        // Créer un nouvel utilisateur dans la base de données
        /*const newUser = new User({
            firstName,
            firstName,
            email,
            dateOfBirth,
            nationality,
            language,
            level
        });
        */
        //random password generator
        function generateRPassword(length) {
            return randomstring.generate({
                length: length || 8, 
                charset: 'alphanumeric' 
            });
        }
        
        const randomPassword = generateRPassword();
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

        //ID generator
        const ID = Date.now().toString(); //generate and ID from date function
        const shortID= ID.slice(-8); //extracting an ID of only 8 digits

        //structuring the date format for date of birth
        const year = req.body.year;
        const month = req.body.month;
        const day = req.body.day;
        const birthdate = new Date(year, month - 1, day);

        // Récupérer les données du corps de la requête
        const data = { // object that contains the data
            id: shortID,
            firstName: req.body.firstName, // common request convention 
            lastName: req.body.lastName,
            email:req.body.email,
            dateOfBirth:birthdate,
            nationality: req.body.nationality,
            language: req.body.language,
            level: req.body.level,
            password: hashedPassword // Replace the original password with the hashed one
        }
    
        /* Check if the username already exists in the database
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            res.send('User already exists. Please choose a different username.');}
            else {
        */
            

            
            //email verification
            /*
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth:{
                    
             
                }
            
            });


            let message = await transporter.sendMail({
                from:"silverdude47@gmail.com",
                to: data.email,
                subject:"password",
                text:"your password is "+randomPassword,
            })
            */

            //inserting data into the data base and not executing the following code until it resolves(await)
            const userdata = await collection.insertMany(data); 
            res.redirect('login');
            console.log(userdata + "you should recieve an email with the password"+ randomPassword);

    
            /*email error message (not  used)
            
            transporter.sendMail(message).then(()=>{
             return res.status(201).json ({msg: "you should recieve an email"})
            }).catch(error=>{
                return res.status(500).json ({error})
            })

        }}
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');

        }
        */
});

// Login user 

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
}))
/*
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
*/


//authentification
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next()
}

//logout
app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/login")
    })
})









