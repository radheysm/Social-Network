const express = require('express');
const router = express.Router();
const request = require('request');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {check, validationResult} = require('express-validator');
const config = require('config');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename:function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
          cb(null,true);
      }
      else{
          cb(null, false);
      }
};

const upload = multer({
    storage:storage, 
    limits:{
    fileSize:1024 * 1024 * 5 
     },
     fileFilter:fileFilter
});


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
    [check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()]
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
            profileFields.skills = skills.toString().split(',').map(skill => skill.trim());

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
        // Remove posts
        await Post.deleteMany({user:req.user.id});
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

// @route     PUT api/profile/img
// @desc      Add profile Image
// @access    Private

router.post('/img', [auth, upload.single('profileImage')
  ], async (req,res)=>{
      try {
          const profile = await Profile.findOne({user:req.user.id});
        //   console.log("1");
        //   console.log(profile);
        //   console.log(req.file.path);
        //   console.log("2");
          profile.profileImage = req.file.path;
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


// @route     PUT api/profile/education
// @desc      Add profile education
// @access    Private

router.put('/education',[auth, [
  check('school', 'school name is required').not().isEmpty(),
  check('degree','Degree is required').not().isEmpty(),
  check('fieldofstudy','Feild of Study is required').not().isEmpty(),
  check('from','from date is required').not().isEmpty()

]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({user:req.user.id});
        
        profile.education.unshift(newEdu);

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});
// @route     DELETE api/profile/education/:edu_id
// @desc      delete education from profile
// @access    Private

router.delete('/education/:edu_id',auth, async(req,res)=>{


    try {
        const profile = await Profile.findOne({user:req.user.id});

        // Get the remove index
         const removeIndex = profile.education.map(item =>item.id).indexOf(req.params.edu_id);
         profile.education.splice(removeIndex,1);
         await profile.save();
         res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

// @route     GET api/profile/github/:username
// @desc      Get user repos from Github;
// @access    Public


router.get('/github/:username',(req,res)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}`,method:'GET',
            headers:{'user-agent':'node.js'}
        };
        request(options, (error, response, body) =>{
             if(error) console.error(error);

             if(response.statusCode !==200){
                 return res.status(404).json({msg:'No Github profile found'});
             }

             res.json(JSON.parse(body));
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
})
module.exports = router;