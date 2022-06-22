const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const mongoose = require('mongoose');
const db = mongoose.connection

const initializePassport = require('../passport-config');
const { find } = require('../models/user');

initializePassport(
    passport,
    email => User.findOne({email: email}),
    id => User.findOne({id:id})
    )

    console.log('here');

router.get('/',checkAuthenticated , async(req,res) => {
    
    let users

    // var id = req.user.id;
    // User.findOne({_id: id}, function (err, user) {
    //     if (err) return res.json(400, {message: `user ${id} not found.`});
    
    //     // make sure you omit sensitive user information 
    //     // on this object before sending it to the client.
    //     //res.json(user);
    //     res.render('index.ejs' , {users : user});
    //   });
 
    users =await  User.find();
    try {
       
        users = await User.find({email : sessionEmail},{name: 1, _id: 0});
        var namefinal = users[0].name;
        console.log(namefinal);
    
    } catch {
        users = []
      }
      res.render('index.ejs', {
        users: namefinal
      })
      console.log(users,this.name);
    console.log("req.user is  ",users.values(users).name);
    //res.render('index.ejs' , {users : users});
})


// router.get('/:id',checkAuthenticated , async(req,res) => {
//     let user
//     user = await User.findOne({id: req.params.id});
//     res.render('index.ejs' , {user : user});
// }
// )


let sessionEmail = ''

router.get('/login',checkNotAuthenticated , (req,res) => {

    res.render('login.ejs', {
        layout: 'login.ejs',
    });


})

router.post('/login',checkNotAuthenticated, (req , res)=>{sessionEmail = req.body.email
    console.log(sessionEmail);
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    
}
// ,passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true,

// }));
)(req,res);
}
)




router.get('/register',checkNotAuthenticated ,(req,res) => {
    res.render('register.ejs', {
        layout: 'register.ejs',
        user : new User()
    });

})

router.post('/register', checkNotAuthenticated ,async(req,res) => {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });
    try{
        const newUser = await user.save();

        console.log(newUser, ' new user created');
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        res.redirect('/register')
    }
    console.log(user)
    //res.send("works")
})


router.delete('/logout', (req,res) => {
    req.logOut(function(err){
        if(err){
            console.log(err)
        }
    });
    res.redirect('/login');
}
)


function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
function checkNotAuthenticated(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

module.exports = router;
