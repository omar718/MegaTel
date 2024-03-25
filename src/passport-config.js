//this file is related to the user authentification
const LocalStrategy = require("passport-local").Strategy //importing the passport-local module and its trategy method to define that 
                                                        //the authentification will be via a username and a password
const bcrypt = require("bcrypt")


function initialize(passport, getUserByEmail, getUserById){
    // Function to authenticate users
    const authenticateUsers = async (email, password, done) => {
        // Get users by email
        try{
        const user = await getUserByEmail(email)
        if (!user){
            return done(null, false, {message: "No user found with that email"})
        }
            const passwordMatched = await bcrypt.compare(password, user.password);
            if(passwordMatched){
                return done(null, user)
            } else{
                return done (null, false, {message: "Password Incorrect"})
            }
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize