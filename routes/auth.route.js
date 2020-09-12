const express = require('express');
const bcryptjs= require('bcryptjs');

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
    }).then(userFromDB => {
        res.send('user créé!')
    }).catch(err => {
        next(err)
    })
})

module.exports = router;