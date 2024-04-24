//this file is related to the user authentification
const LocalStrategy = require("passport-local").Strategy //importing the passport-local module and its trategy method to define that 
                                                        //the authentification will be via a username and a password
const bcrypt = require("bcrypt")
const collection = require("./config");
//this function will later be used for the password verification the function has async because it returns a promise a promise is 
//is an object that signals the completion or failure of an async operation
async function password_verif(password,identifier,done){
    if (password) {
        return done(null, identifier)//done uses 2 parameters : null refers to no errors during auth and user is object authentified
                                    // if there is an error like the first example false refers to no authentification
    } else {
        return done (null, false, {message: " Incorrect password"})}
}

function initialize(passport, getUserByEmail, getUserById){
    // Function to authenticate users with email
    const authenticateUsers = async (email,password,done) => {
        // Get users by email
        try{
        const user = await getUserByEmail(email)
        if (!user){
            const userID = await getUserById(email)
            if (!userID){
                return done(null, false, {message: "No user found with that email or ID"})} // return done is used to signal the completion of 
                                                                                // the authentification process
                const IDpasswordMatched = await bcrypt.compare(password, userID.password);
                return password_verif(IDpasswordMatched,userID,done);//check the password verification above
            }
            
            const passwordMatched = await bcrypt.compare(password, user.password);
            return password_verif(passwordMatched,user,done);

        } catch (e) {
            console.log(e);
            return done(e)
        }
    }
    //defining the email strategy authentification    
    passport.use(new LocalStrategy({usernameField: 'text'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        collection.findOne({ id: id })
        .then(user => {
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        })
        .catch(err => done(err));
});
        //return done(null, getUserById(id))
    
}

module.exports = initialize