const { response } = require('express');
const express = require('express');
const router = express.Router();
const userHelper = require("../helpers/user-helpers")


// Sign Up
router.post('/signup', (req, res) => {
    userHelper.doSignUp(req.body).then((response)=>{
        res.json(response);
    })
});


// Login
router.post('/login',(req,res)=>{
    userHelper.doLogin(req.body).then((response)=>{
        res.json(response);
    })
});

// Create Post
router.post('/createPost',(req,res)=>{
    console.log("createPost route working")
    userHelper.doCreatePost(req.body).then((response)=>{
        console.log(response)
        res.json(response);
    })
})


module.exports = router;
