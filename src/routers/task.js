const express = require('express')
const Tasks = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/task', auth, async (req, res)=>{
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {   
        res.status(400).send(error)
    }
    
})

router.get('/task',auth ,async (req,res)=>{
    const match={}
    const sort={}
    if(req.query.status){
        match.status = req.query.status === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'desc'? -1:1
    }
    try {
        
        await req.user.populate({
            path:'task',
            match,
            options:{
                limit: parseInt(req.query.limit),
                limit:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.task)
    } catch (error) {  
        res.status(500)
        res.send()
    }

})

router.get('/task/:id', auth,async (req, res)=>{
    const _id = req.params.id
    
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})


router.patch('/task/:id', auth,async(req, res)=>{
    const update = Object.keys(req.body)
    const allowedupdate = ['description', 'status']
    const isTaskOperation = update.every((update)=>
        allowedupdate.includes(update))

    if(!isTaskOperation){
        return res.status(400).send({error:'invalid operation'})
    }
    try {
        const task = await Tasks.findOne({ _id:req.params.id, owner:req.user._id })
        //const task = await Tasks.findById(req.params.id)
        if(!task){
            return res.status(404).send()
        }

        update.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.send(task)

    } catch (error) {
        res.status(400).send(error)
    }
})



router.delete('/task/:id', auth,async (req, res)=>{
    try {
        //const task = await Tasks.findByIdAndDelete(req.params.id,req.body)
        const task = await Tasks.findOneAndDelete({ _id:req.params.id, owner:req.user._id })
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports =router