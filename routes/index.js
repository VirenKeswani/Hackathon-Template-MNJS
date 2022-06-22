const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');


const initializePassport = require('../passport-config');

initializePassport(
    passport,
    email => User.findOne({email: email}),
    id => User.findOne({id:id})
    )

    

router.get('/',checkAuthenticated , async(req,res) => {
    
    let users
    ////users =await  User.find();
    try {
        users = await User.find({user : req.user});
      } catch {
        users = []
      }
      res.render('index.ejs', {
        users: users
      })
    console.log("req.user is  ", req.user);
    //res.render('index.ejs' , {users : users});
})
const sessionEmail = ''

router.get('/login',checkNotAuthenticated , (req,res) => {

    res.render('login.ejs', {
        layout: 'login.ejs',
    });
})

router.post('/login',checkNotAuthenticated ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));



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
        res.redirect('/login')
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
