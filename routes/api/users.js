const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {check, validationResult } = require('express-validator');


const User = require('../../models/User');

// @route     POST api/users
// @desc      Register User
// @access    Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password','please enter a  password with 3 or more characker').isLength({min:3})
], async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name, email, password} = req.body;

     try{

    // See if user exists
      
     let user = await User.findOne({email});
     if(user){
         res.status(500).json({errors: [{msg: 'User Already exists'}]});
     }

    // Get users gravatar
       const avatar = gravatar.url(email, {
             s:'200',
             r:'pg',
             d: 'mm'
       });

       user = new User({
           name,
           email,
           avatar,
           password
       });

    // Encrpt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();


    // Return jsonwebtoken

    
    res.send("User Registered");
     }
     catch(err){
           console.error(err.message);
           res.status(500).send("Server Error");
     }


});

// router.get('/register', (req,res) => res.send("Register User"));


module.exports = router;