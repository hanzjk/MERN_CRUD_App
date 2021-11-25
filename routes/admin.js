const express = require('express');
const admin = require('../models/admin');


const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const config = require('config');

const auth = require('../middleware/auth');

const nodemailer = require('nodemailer')

const crypto =require('crypto')
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'hanzjk.98@gmail.com',
        pass: 'teddydoggY123'
    }
});
//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//

//register new administrator
router.post('/administrator/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ msg: 'Please enter all fields' })
    //Check for existing username
    admin.findOne({ username })
        .then(admin_user => {
            if (admin_user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            let newAdmin = new admin(req.body);

            //Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                    if (err) throw err;
                    newAdmin.password = hash;
                    newAdmin.save()
                        .then(admin_user => {

                            jwt.sign(
                                { id: admin_user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        admin: {
                                            id: admin_user.id,
                                            username: admin_user.username
                                        }

                                    })
                                    
                                }
                            )


                        });
                });
            });

        });
});

router.post('/email',(req,res)=>{
    transporter.sendMail({
        to: 'hansijayanika@gmail.com',
        from: "hanzjk.98@gmail.com",
        subject: "signup success",
        text: 'hello world!'
    }).then(()=>{
        return res.send("Email Send")
     })
})
//log in administrator
router.post('/administrator/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ msg: 'Please enter all fields' })
    //Check for existing username
    admin.findOne({ username })
        .then(admin_user => {
            if (!admin_user) {
                res.status(400).json({ msg: 'User Does not exists' });
            }

            //validate password
            bcrypt.compare(password, admin_user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Password is invalid' });

                    jwt.sign(
                        { id: admin_user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                admin: {
                                    id: admin_user.id,
                                    username: admin_user.username
                                }

                            })
                        }
                    )
                });




        });
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */
//get logged admin details
router.get('/administrator/:id', (req, res) => {

    admin.findById(req.params.id).select('-password')
        .then(admin => {
            return res.status(200).json({
                success: true,
                admin
            });
        })

});


router.post('/administrator/reset-password',(req,res)=>{

    const { username } = req.body;

    if (!username ) return res.status(400).json({ msg: 'Please enter the username' })

    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        admin.findOne({username:req.body.username})
        .then(admin=>{
            if(!admin){
                return res.status(400).json({msg:"User does not exists with that email"})
            }
            admin.resetToken = token
            admin.expireToken = Date.now() + 3600000
            admin.save().then((result)=>{
                transporter.sendMail({
                    to: admin.username,
                    from: "hanzjk.98@gmail.com",
                    subject: "signup success",
                    html:`<p>You are requested for password reset</p> 
                    <h5>Click this <a href="http://localhost:3000/resetPassword/${token}">link</a> to reset the password</h5> `
                        
                }).then(()=>{
                    res.json({message:"check your email"})                 })
            })

        })
    });
})


router.post('/new-password',(req,res)=>{
   const newPassword = req.body.password
   const sentToken = req.body.token
   admin.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(admin=>{
       if(!admin){
           return res.status(400).json({msg:"Try again session expired"})
       }
       bcrypt.hash(newPassword,12).then(hashedpassword=>{
          admin.password = hashedpassword
          admin.resetToken = undefined
          admin.expireToken = undefined
          admin.save().then((saveduser)=>{
              res.json({message:"password updated successfully"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
})



module.exports = router;
