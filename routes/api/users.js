const express = require('express');
const router =  express.Router();
const {check,validationResult} = require('express-validator')
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
// @route  POST api/users
// @desc   Test route
// @access Public
router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({min: 6})

],
   async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()})
    }

    const {name,email,password}= req.body;
    //console.log(req.body)'
    try{
        // see if user exists; get user gravatar; encrypt password; return jsonwebtoken
       let user = await User.findOne({email});
       if(user)
       {
           res.status(400).json({errors:[{msg: 'User already exists'}]});
       }
      const avatar = gravator.url(email,{
          s:'200',
          r:'pg',
          d:'mm'
      })
        user = new User({
            name,
            email,
            avatar,
            password
        });
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password,salt);

       await user.save();
           console.log(user.password);

        res.send('User route');
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
});

module.exports = router

// anything which return promise put await before that function