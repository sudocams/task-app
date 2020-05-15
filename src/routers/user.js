const express = require('express')
const User =require('../models/user')
const router = new express.Router()
const sharp = require('sharp')
const{ sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
const multer = require('multer')
const auth = require('../middleware/auth')

router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res)=>{
    try {
        
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
        
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token
        }) 
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async(req, res)=>{
    try {
        req.user.tokens =[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//this can be used to fetch things by id, if no profile is needed in the app
// router.get('/users/:id', async (req, res)=>{
//     const _id =req.params.id

//     try {
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     } 
// })

router.patch('/users/me', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedupdate = ['name', 'email','password','age']
    const isTaskOperation = updates.every((update)=>
        allowedupdate.includes(update))

    if(!isTaskOperation){
        return res.status(400).send({error:'invalid operation'})
    }
    try {
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()
        
    
        res.send(req.user)
    } catch (error) {
        res.status(400)
        res.send(error)
    }
})

router.delete('/users/me', auth,async (req, res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})



const upload = multer({ 
    limits:{
        fileSize:1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please it must be an image'))
        }
        cb(undefined, true)
    }
  })
  
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
  },(error, req, res, next )=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar -undefined
    await req.user.save()
    res.send()

})

router.get('/users/:id/avatar', async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})
module.exports = router 