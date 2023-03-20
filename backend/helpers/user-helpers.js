const client = require('../config/connection');
let objectId = require('mongodb').ObjectId
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const collections = require("../config/collections")
const fs = require('fs-extra');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAVHMZYIHXA54VHQWX',
    secretAccessKey: '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'
});


const s3 = new AWS.S3({ params: { Bucket: 'bucket_name' } })

module.exports = {
    doSignUp: (data) => {
        return new Promise(async (resolve, reject) => {
            const userExist = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).findOne({ email: data.email })
            if (userExist) {
                resolve({ status: "fail", message: "This email is already registered" })
            }
            if (!userExist) {
                data.password = await bcrypt.hash(data.password, 10)
                const signUp = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).insertOne({
                    email: data.email,
                    username: data.username,
                    posts: 0,
                    following: 0,
                    followers: 0,
                    password: data.password,
                    active: true,
                    date: Date.now()
                })
                if (signUp) {
                    resolve({ status: "success", message: "Account created. Please login." })
                }
            }
        })
    },

    doLogin: (data) => {
        return new Promise(async (resolve, reject) => {
            const userExist = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).findOne({ email: data.email })
            if (!userExist) {
                resolve({ status: "fail", message: "This email is doesn't exist" })
            } if (userExist) {
                bcrypt.compare(data.password, userExist.password).then((status) => {
                    if (status) {
                        console.log("login success in node server")
                        const token = jwt.sign({ userId: userExist._id }, config.secretKey, { expiresIn: '1h' });
                        resolve({ status: "success", message: "Login successfull", token: token, user: userExist })
                    } else {
                        resolve({ status: "fail", message: "Password is incorrect" })
                    }
                })
            }
        })
    },

    doCreatePost: (data) => {
        return new Promise(async (resolve, reject) => {
            const postDetails = {
                postOwnerId: data.userData._id,
                postOwnerName: data.userData.username,
                likesCount: 0,
                commentsCount: 0,
                description: data.description,
                date: Date.now(),
            }
            const post = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).insertOne(postDetails).then((response) => {
                if (response.insertedId) {
                    const postId = response.insertedId.toString();
                    console.log(postId)
                    resolve({status:"success" , postId:postId })
                    
                    // console.log(postId)
                    // const s3Params = {
                    //     Bucket: 'post-video-storage',
                    //     Key: `${postId}.mp4`, // set the Key parameter to the response ID
                    //     Body: fileContents,
                    //     ContentType: `video/mp4`
                    // };
                    // s3.putObject(s3Params, (err, data) => {
                    //     if (err) {
                    //         console.log(`Error uploading file : ${err}`)
                    //     } else {
                    //         console.log(`File uploaded successfully. File location : ${data.Location}`)
                    //     }
                    // })
                }
            })
        })
    }
}