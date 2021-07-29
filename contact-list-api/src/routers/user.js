
const express = require('express')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../model/user')


const {JWT_TOKEN} = process.env 
const router = new express.Router()

router.post('/users', async (req, resp) => {
    try {
        const user = new User(req.body)
        await user.save()

        resp.status(201).send(user)
    } catch(e) {
        resp.status(400).send({error: e.message})
    }
})

router.post('/users/login', async (req, resp) => {    
    try {
        const {password, email} = req.body
        const user = await User.findByCredentials(email, password)
        const token = jwt.sign({ _id: user._id}, JWT_TOKEN)
        
        user.tokens.push({token})
        await user.save()
        resp.send({ user, token })
    } catch (e) {
        resp.status(400).send({error: e.message})
    }
})

router.get('/users/me', auth, async (req, resp) => {
    resp.send(req.user)
})

module.exports = router