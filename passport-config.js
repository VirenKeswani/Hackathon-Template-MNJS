const { authenticate } = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport , getUserByEmail , getUserById){
    const authenticateUser =  async(email, password, done) => {
        // const user =  getUserByEmail(email);

        const user = await User.findOne({email: email});
        //console.log(getUserByEmail(email));

        
        if(user == null){
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            let userpass = await user.password

            if (await bcrypt.compare(password, user.password)) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          } catch (e) {
            return done(e)
          }
        }

        

    
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    })
    // passport.use(new LocalStrategy(
    //     function(username, password, done) {
    //       User.findOne({ username: username }, function (err, user) {
    //         if (err) { return done(err); }
    //         if (!user) { return done(null, false); }
    //         if (!user.verifyPassword(password)) { return done(null, false); }
    //         return done(null, user);
    //       });
    //     }
    //   ));
}

module.exports = initialize;