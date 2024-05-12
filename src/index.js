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

const fs = require('fs');//fs=file system this module is required to read to html file related to the email verification

const multer = require("multer"); //this module is used for for the pictures upload



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


// Static file (allows the application to access the files of public package without the need for additional routing)
app.use(express.static("front"));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,'..')));

//error messages configuration
initializePassport(
    passport,
    email => collection.findOne({ email: email }), // Use exec() which is "{}" to return a promise that the function understands
    id => collection.findOne({ id: id }), // Use exec() which is "{}" to return a promise that the function understands 
);

//configuring the upload destination for the folders in the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join('views/uploads')) // Destination folder to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use original filename
    }
});

const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed')); // Reject the file
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });


// Sign up User
// Configuring the register post functionality
app.post("/signup",checkNotAuthenticated,upload.single("file"), async (req, res) => { //accessing the signup file using async function that has
                                                                //2 parmeters req for the incoming data and res for sending
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
        
        //ID generator
        const ID = Date.now().toString(); //generate and ID from date function
        const shortID= ID.slice(-8); //extracting an ID of only 8 digits

        //structuring the date format for date of birth
        const year = req.body.year;
        const month = req.body.month;
        const day = req.body.day;
        const birthdate = new Date(year, month-1, day);
        //retrieving the file path
        const picPath = req.file.path;

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
            picPath:picPath
        }
    
        // Check if the email already exists in the database
        const existingUser = await collection.findOne({ email: data.email });
        if (existingUser) {
            req.flash("error","Email already exists. Please choose another email")
            return res.redirect('signup')}
        else {
            const userdata = await collection.insertMany(data); 
            res.sendFile(path.join(__dirname, '/../front/popup.html'));
            console.log(userdata + "you should recieve an email with the password ");
            
        }}
        catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');

        }
        
});

// Login user 

app.post("/login",checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/workspace",
    failureRedirect: "/login",
    failureFlash: true
}))

//admin

app.post("/adminn",upload.single("file"), async (req, res) => {
//getting the user omar zroud
// Function to retrieve user data based on email
async function getUserByEmail(email) {
    return await collection.findOne({ email: email });
}
const userEmail = 'omarzroud23@gmail.com'; // Replace with the user's email you want to retrieve
const data = await getUserByEmail(userEmail);
console.log(data); // Print the user data retrieved from the database
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
password: hashedPassword, // Replace the original password with the hashed one
//email verification
            // Read the mail file that will be sent asynchronously
            fs.readFile('front/mail.html', 'utf8', async (err, mail) => {
                if (err) {
                    console.error('Error reading HTML file:', err);
                    return;
                }
            
                // Replace the placeholders{} with their actual values
                const emailContent = mail.replace('{{password}}', randomPassword).replace('{{name}}', data.firstName).
                replace('{{id}}', data.id);
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth:{
                        user:process.env.USER,
                        pass:process.env.APP_PASSWORD,
                    }
                
                });
                // Send the email with the updated HTML content
                let message = await transporter.sendMail({
                    from: "Mega Tel",
                    to: data.email,
                    subject: "User credentials",
                    html: emailContent,
                    attachments: [{
                        filename: 'logo noir2.png',
                        path: __dirname +'/../front/logo noir2.png',
                        cid: 'logo' //same cid value as in the html img src
                    }]
                    
                });
            });
    
            //inserting data into the data base and not executing the following code until it resolves(await)
            const userdata = await collection.updateOne(
                { email: userEmail },
                { $set: { password: hashedPassword } }
            );
            res.sendFile(path.join(__dirname, '/../front/popupEmail.html'));

})
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
            res.render("workspace");
        }
    }
    catch {
        res.send("wrong Details");
    }
});
*/
//define the routes(when you type localhost:5000 you get the specific login page and not 404)
app.get("",checkNotAuthenticated, (req, res) => {
    res.render("login");
});
app.get("/login",checkNotAuthenticated, (req, res) => {
    res.render("login");
});
app.get("/signup",checkNotAuthenticated, (req, res) => {
    res.render("signup",{messages:req.flash()}); //besides the signup form we will also render the signup errors when they occur
});
app.get("/workspace",checkAuthenticated, (req, res) => {
    res.render("workspace",{name: req.user.firstName,picPath: req.user.picPath});//besides the workspace page we will also render the first name as a username 
});
app.get("/admin", (req, res) => {
    res.render("adminn");
});
//authentification
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/workspace")
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









