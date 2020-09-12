const express = require('express');
const bcryptjs= require('bcryptjs');
const mongoose= require('mongoose');

const User= require('../models/User.model.js');

const router = express.Router();

router.get('/signup', (req, res, next) => {
    res.render('auth/signup', {})
})

const salt = bcryptjs.genSaltSync(10)

router.post('/signup', (req, res, next) => {
    console.log('valeurs', req.body);

    const plainPassword = req.body.password;

    const hashed = bcryptjs.hashSync(plainPassword, salt);
    console.log('hashed=', hashed);
    
    User.create({
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashed
    }).then(user => {
        res.send('user créé!')
    }).catch(err => {

        if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
            // re-afficher le formulaire
      
            console.log('Error de validation mongoose !')
      
            res.render('auth/signup', {
              errorMessage: err.message
            })
          } else {
            next(err) // hotline
          }

        
    })
})


//ITERATION 2
// créer GET login
router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

// créer POST login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  
  if(!email || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        res.render('auth/login', {errorMessage: 'Incorrect email/password'})
        return;
      }

      if (bcryptjs.compareSync(password, user.passwordHash)) {
        console.log('user ok', user)

        req.session.user = user

        res.send('loggué!')
      } else {
        res.render('auth/login', {errorMessage: 'Incsorrect email/password'})
      }
    })
    .catch(err => {
      next(err)
    })

})

//créer main

router.get('/main', (req, res, next) => {
  
    res.render('main');
  
})

router.get('/private', (req, res, next) => {
  if(!req.session.user){
    res.redirect('/login')
  } else {
    res.render('private', {user : req.session.user})
  }
})


module.exports = router;