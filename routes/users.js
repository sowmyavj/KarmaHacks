const express = require('express');
const router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const data = require("../data");
const userData = data.users;
const deedsData=data.deeds;
const uuidv1 = require('uuid/v4');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'effugio',
  api_key: '266718785839255',
  api_secret: 'YoIwSpXNsaiRXNNB1EDp_gGmhOs'
});
var setCookie = require('set-cookie-parser');
var xss = require("xss");

function getTodayDate(){
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!

  let yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd;
  } 
  if(mm<10){
    mm='0'+mm;
  } 
   today = dd+'/'+mm+'/'+yyyy;
  return today;
}
passport.use(new Strategy(
  async function(username, password, cb) {
      console.log("user: pass:"+username+" "+password);
      var user= await userData.getUserbyUserId(username);
      if(!user){
          return cb(null, false, { message: 'Unknown User'});
      }
      var isMatch = await userData.comparePassword(password, user.hashedPassword);
      if(isMatch){
        return cb(null, user);
      } else {
            return cb(null, false, { message: 'Invalid password'});
      }

}));

passport.serializeUser( function(user, cb) {
    cb(null, user._id);
  });
  
passport.deserializeUser(async function(id, cb) {
  var user = await userData.getUser(id);
  cb(null, user);
  
});


router.get('/login',
function(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {      
    res.render('users/login', { message: req.flash('error') });    
    
  }else{
    res.redirect('/profile');  
  }
});

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn("/"),
  async function (req, res) {
    let errors = [];
   

    try {
     res.render('users/profile', {
        errors: errors,
        hasErrors: false,
        updSuccess: false,
        user: req.user,
        profilePicID:req.user._id
      });
    }
    catch (e) {
      errors.push(e);
      res.render('users/profile', {
        errors: errors,
        hasErrors: true,
        updSuccess: false,
        user: req.user,
        profilePicID:req.user._id
      });
    }
  });


router.post("/profile", multipartMiddleware,async (req, res) => {
    let updatedProfileData = req.body;
    
    updatedProfileData.location = xss(req.body.location, {
      whiteList:          [],        // empty, means filter out all tags
      stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
      stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                     // to filter out its content
    });
    updatedProfileData.occupation = xss(req.body.occupation, {
      whiteList:          [],        
      stripIgnoreTag:     true,      
      stripIgnoreTagBody: ['script']
    });
    updatedProfileData.contact_info = xss(req.body.contact_info, {
      whiteList:          [],        
      stripIgnoreTag:     true,      
      stripIgnoreTagBody: ['script']
    });
    updatedProfileData.email = xss(req.body.email, {
      whiteList:          [],        
      stripIgnoreTag:     true,      
      stripIgnoreTagBody: ['script']
    });
    updatedProfileData.newPwd = xss(req.body.newPwd, {
      whiteList:          [],        
      stripIgnoreTag:     true,      
      stripIgnoreTagBody: ['script']
    });
    updatedProfileData.newPwdConfirm = xss(req.body.newPwdConfirm, {
      whiteList:          [],        
      stripIgnoreTag:     true,      
      stripIgnoreTagBody: ['script']
    });


  let errors = [];
  
  if(updatedProfileData.occupation.length===0){
    let error_msg="Valid occupation not provided";
    errors.push(error_msg);
  }
  if(updatedProfileData.email.length===0){
    let error_msg="Valid email not provided";
    errors.push(error_msg);
  }

  if ((updatedProfileData.newPwd) || (updatedProfileData.newPwdConfirm)){
    if (updatedProfileData.newPwd !== updatedProfileData.newPwdConfirm){
    //console.log("Coming into if");
    errors.push("New Password and Confirm New Password don't match");
    }
  } 
 if (errors.length > 0) {
    //console.log("Inside errors.length if");
    res.render('users/profile', {
      errors: errors,
      hasErrors: true,
      updSuccess: false,
      user: updatedProfileData,
      profilePicID:req.user._id
    });
    return;
  }

  try {
   let updatedUserProfile = await userData.updateUser(updatedProfileData);
    res.render('users/profile', {
      errors: errors,
      hasErrors: false,
      updSuccess: true,
      user: updatedProfileData,
      profilePicID:req.user._id
    });
    return;
  }
  catch (e) {
    errors.push(e);
    res.render('users/profile', {
      errors: errors,
      hasErrors: true,
      updSuccess: false,
      user: updatedProfileData,
      profilePicID:req.user._id
    });
  }
});

router.get('/dashboard',
  require('connect-ensure-login').ensureLoggedIn("/"),
  async function (req, res) {
<<<<<<< HEAD

=======
    console.log("get dashboard")
    let deedData = await deedsData.getDeedsForAllUsers(req.user._id);
    console.log(deedData);
    //console.log(Object.prototype.toString.call(deedData));
    /*
    //TESTING.. TO BE DELETED
>>>>>>> 53d56e8e6c728e5a6a8b843ce93d34bb22573885
    
    //TESTING.. TO BE DELETED
    /*
      let r1= await userData.getUser(req.user._id);
      console.log("*********   user details *************");
      console.log(r1);
      console.log("***********************************\n\n");

      let ex=  {
        _id:uuidv1(),
        user_id: req.user._id,
        description: "Added a new deed.. just testing",
        karmaCount: 2,
        hours: 2,
        dateOfDeed:"12/27/2018"
      }

    let r5= await deedsData.addDeed(ex);
    console.log("*********  add deed *************")
      console.log(r5);
      console.log("***********************************\n\n")


      let r2= await deedsData.getAllDeedsForUserId(req.user._id);
      console.log("*********   all deeds for user details *************");
      console.log(r2);
      console.log("***********************************\n\n");


      let r3= await deedsData.getDeed(r2[0]._id);
      console.log("*********   first deed details *************");
      console.log(r3);
      console.log("***********************************\n\n");

      let r6= await deedsData.calculateKarmaCount(r2[0]._id);
    console.log("*********  Karma count *************");
      console.log(r6);
      console.log("***********************************\n\n");

      r3.karmaCount = r6;
      let updDeed = deedsData.updateDeed(r3);


      let r4= await deedsData.getAllDeedRatings(r2[0]._id);
      console.log("*********   all ratings for first dees details *************");
      console.log(r4);
      console.log("***********************************\n\n");

      let kaScore = await userData.calculatePoints(req.user._id);
      console.log("*********  User's karma score *************");
      console.log(kaScore);
      console.log("***********************************\n\n");*/

       /*
    //TESTING.. TO BE DELETED -- END
    */

      res.render('users/dashboard', {
        user: req.user,
        deed : deedData 
        
                /*helpers: {
          toage: function (dob) { return getAge(dob); }
        } */
      },
      );
    
  });



  router.get('/delete/:id',
  require('connect-ensure-login').ensureLoggedIn("/"),
  async function (req, res) {
    
  //TODO: decide whether all data and posts from user to be deleted?
    
  removeUser = await userData.removeUser(req.params.id);
    name=req.user.name
    req.logout();
    res.render('users/deleted', {
      name: name, 
      
    });
  });



function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}


router.post('/dashboard',
  async function (req, res) {
    console.log("date")
    let date=getTodayDate()
    console.log(date)
    let deed={
            user_id: req.user._id,
            description: req.body.description,
            hours: req.body.hours,
            karmaCount: 0,
            dateOfDeed: date
    }
    let result = await deedsData.addDeed(deed)
    console.log("added deed:: ")
    console.log(result);
    let deedData = await deedsData.getDeedsForAllUsers(req.user._id);
    res.render('users/dashboard', {
      user: req.user,
      deed : deedData 
    },
    );
    
  });

router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    console.log('You are authenticated');
    res.redirect('/profile');
  });

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});


// Register
router.get('/register', async function (req, res) {
 try {
   res.render('users/register');
  }
  catch (e) {
    response.status(500).json({ error: e });
  }
});


// Register User
router.post('/register', multipartMiddleware, async function(req, res){

	// Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('gender', 'Gender is required').notEmpty().not().equals('Select Gender');
    req.checkBody('isOrganisation', 'Please select if you represent an organisation or not ').notEmpty().not().equals('Select Organisation or not');
  	req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('dob', 'Date of birth is required and should be a date').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('occupation', 'Occupation is required').notEmpty();
    req.checkBody('user_id', 'Username is required').notEmpty();
	  req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
  var errors = req.validationErrors();
  //console.log(errors.length);
 // console.log(typeof(errors));
  
  //console.log("Filename :"+req.body.uploadPicture);
  var imageFile = req.files.uploadPicture.path;
  var imageFileName = xss(req.files.uploadPicture.name, {
    whiteList:          [],        // empty, means filter out all tags
    stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                   // to filter out its content
  });
 
if(!imageFileName) {
  let error_msg={"msg" :"Please select a profile picture for upload",
                 "param":"uploadPicture" };
    if(!errors){
      errors=[];
      errors.push(error_msg);
      //console.log(typeof(errors));
    }else{
      errors.push(error_msg);
    }
    console.log("no file selected!!");
  }else{

   // let ext = (imageFileName.split("."))[1];
    var ext = imageFileName.split(".").pop().toLowerCase();
    if(ext != "png" && ext !="jpg" ){
      let error_msg={"msg" :"Profile picture must be a .png or .jpg file",
      "param":"uploadPictureext" };
      if(!errors){
        errors=[];
        errors.push(error_msg);
        //console.log(typeof(errors));
      }else{
        errors.push(error_msg);
      }
    }
    console.log("ext is "+ext);

  }

  if(xss(req.body.user_id, {
    whiteList:          [],        // empty, means filter out all tags
    stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                   // to filter out its content
  })){
    user=await userData.getUserbyUserId(xss(req.body.user_id, {
      whiteList:          [],        // empty, means filter out all tags
      stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
      stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                     // to filter out its content
    }));
    if(user){
        console.log("Username "+user.name+" already exists");
        //let errorMessage="Username already exists";
        let error_msg={"msg" :"Username already exists",
        "param":"user_id" };
        if(!errors){
          errors=[];
          errors.push(error_msg);
          //console.log(typeof(errors));
        }else{
          errors.push(error_msg);
        }
    }
}

const newUser = {
  user_id: xss(req.body.user_id, {
    whiteList:          [],        // empty, means filter out all tags
    stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                   // to filter out its content
  }),
  hashedPassword: "",
  password: xss(req.body.password, {
    whiteList:          [],       
    stripIgnoreTag:     true,      
    stripIgnoreTagBody: ['script']
  }),
  name: xss(req.body.name, {
    whiteList:          [],       
    stripIgnoreTag:     true,      
    stripIgnoreTagBody: ['script'] 
  }),
  dob: xss(req.body.dob, {
    whiteList:          [],       
    stripIgnoreTag:     true,      
    stripIgnoreTagBody: ['script'] 
  }),
  gender: req.body.gender,
  location: xss(req.body.location, {
    whiteList:          [],       
    stripIgnoreTag:     true,      
    stripIgnoreTagBody: ['script'] 
  }),
  occupation: xss(req.body.occupation, {
    whiteList:          [],       
    stripIgnoreTag:     true,      
    stripIgnoreTagBody: ['script']
  }),
  orientation: req.body.orientation,
  contact_info: xss(req.body.contactInformation, {
    whiteList:          [],        // empty, means filter out all tags
    stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                   // to filter out its content
  }),
  email: xss(req.body.email, {
    whiteList:          [],        // empty, means filter out all tags
    stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                   // to filter out its content
  }),
};

if(newUser.user_id.length===0){
  let error_msg={"msg" :"Valid username not provided",
  "param":"user_id" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.password.length===0){
  let error_msg={"msg" :"Valid password not provided",
  "param":"password" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.name.length===0){
  let error_msg={"msg" :"Valid name not provided",
  "param":"name" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.dob.length===0){
  let error_msg={"msg" :"Valid date of birth not provided",
  "param":"dob" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.location.length===0){
  let error_msg={"msg" :"Valid location not provided",
  "param":"location" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.occupation.length===0){
  let error_msg={"msg" :"Valid occupation not provided",
  "param":"occupation" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}
if(newUser.email.length===0){
  let error_msg={"msg" :"Valid email not provided",
  "param":"email" };
  if(!errors){
    errors=[];
    errors.push(error_msg);
    //console.log(typeof(errors));
  }else{
    errors.push(error_msg);
  }
}

	if(errors){

    var errors_user={
      name:xss(req.body.name, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }) ,
      user_id:xss(req.body.user_id, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      password:xss(req.body.password, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      password2:xss(req.body.password2, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      dob:xss(req.body.dob, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      gender:req.body.gender,
      location:xss(req.body.location, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      occupation:xss(req.body.occupation, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      orientation:req.body.orientation,
      contactInformation:xss(req.body.contactInformation, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }),
      email:xss(req.body.email, {
        whiteList:          [],        // empty, means filter out all tags
        stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
        stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                       // to filter out its content
      }) ,
      budget:req.body.budgetPreference,
      locationpref:req.body.locationpref
    };

   
    res.render('users/register', {errors:errors,user:errors_user} );


  } else {
   
    addedUser=await userData.addUser(newUser,newUser.password);
    console.log("added new user");
    console.log(addedUser);
    if(imageFileName){
      //let result=await cloudinary.api.resource(imageFile); 
      console.log("imageFile :"+imageFile);
      var addedUserid=addedUser._id;
      var result =await cloudinary.uploader.upload(imageFile,{public_id:addedUserid});
      //console.log("Result :"+result); 
      console.log("Result :"+result.url); 
    
    } 
    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');  
    
	}
});
module.exports = router;