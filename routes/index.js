const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');


const initializePassport = require('../passport-config');
const { application } = require('express');
initializePassport(
    passport, 
    email =>  users.find(user => user.email === email),
    id =>  users.find(user => user.id === id)
    )

const users = [];

router.get('/',checkAuthenticated , (req,res) => {
    res.render('index.ejs' , {name : req.user.name});
})


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
// }), async (req,res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     });
//     try{
//         //const salt = await bcrypt.genSalt(10);
//         const newUser = await user.save();
//         console.log(newUser, ' new user created');
//     }
//     catch(err){
//         console.log(err);
//     }

// })



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
        // users.push({
        //     id : Date.now().toString(),
        //     name : req.body.name,
        //     email : req.body.email,
        //     password : hashedPassword
        // })
        console.log(newUser, ' new user created');
        res.redirect('/login')
    }
    catch(err){
        console.log(err)
        res.redirect('/register')
    }
    console.log(users)
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
