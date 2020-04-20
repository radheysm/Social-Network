const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
// @route     GET api/profile/me
// @desc      GET current user's profile
// @access    Private

router.get('/me',auth, async(req, res)=> {
          try{
              const profile = await Profile.findOne({user:req.user.id}).populate('user',
              ['user','avatar']);
            // console.log(req.user.user.id);
              if(!profile){
                  return res.status(400).json({msg:"There is no profile for this user"});
              }

              res.send(profile);

          }
          catch(err){
              console.log(err.message);
              res.status(500).send("Server Error");
          }
});



// @route     POST api/profile
// @desc      Create or Update User's profile
// @access    Private


router.post('/', [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
    ], async(req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return res.status(400).json({errors:errors.array()});
        }
         const{company,website,location,bio,status,githubusername,
        skills,youtube,facebook,twitter,instagram,linkedin} = req.body;

        //Build profile object

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim());

        }

        // Build Social Objects
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;




        // console.log(profileFields.skills);
        // res.send(req.body);
        try {
            let profile = await Profile.findOne({user:req.user.id});
            // console.log(req.user.id);
            if(profile){
                //update
                // profile = await Profile.findById(req.user.id, (err, profileFields)=>{
                //         id(err);
                        
                //         {$set:profileFields} 
                // })
                profile = await Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set: profileFields},
                    {new:true}
                    );
                    return res.json(profile);
            }

            //create
              profile = new Profile(profileFields);
              await profile.save();
              return res.json(profile);



            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});



// @route     GET api/profile
// @desc      GET all profile
// @access    Public


router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

// @route     GET api/profile/user/:user_id
// @desc      GET profile by user id
// @access    Public


router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:"Profile Not found"});
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        // console.log(err.kind);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({msg:"Profile Not found"});
        }
        res.status(500).send("Server Error");
        
    }
});

// @route     DELETE api/profile
// @desc      delete profile, user & post;
// @access    Public


router.delete('/',auth, async (req,res)=>{
    try {
        // @todo - remove user's post

        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        // Remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg:"User Deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});


// @route     PUT api/profile/experince
// @desc      Add profile experience
// @access    Private


router.put('/experience', [auth,
  [
      check('title','Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
  ]
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id});
        console.log(profile.experience);
        profile.experience.unshift(newExp);
        console.log(profile.experience);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route     DELETE api/profile/experince/:exp_id
// @desc      delete experience from profile
// @access    Private

router.delete('/experience/:exp_id',auth, async(req,res)=>{


    try {
        const profile = await Profile.findOne({user:req.user.id});

        // Get the remove index
         const removeIndex = profile.experience.map(item =>item.id).indexOf(req.params.exp_id);
         profile.experience.splice(removeIndex,1);
         await profile.save();
         res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});



module.exports = router;