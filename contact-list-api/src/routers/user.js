
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

router.post('/users/me/contact', auth, async (req, resp) => {
    try {
        const {user} = req
        const newContact = {...req.body}

        const registeredContact = await User.findOne({ email: newContact.email}) 
        

        if (registeredContact) {
            user.contacts.push(registeredContact._id)            
        } else {
            user.contacts_unregistered.push(newContact)
        }

        await user.save()

        resp.sendStatus(201)
    } catch (e) {
        resp.sendStatus(400)
    } 
})

router.post('/users/me/avatar', auth, async (req, resp) => {
    
})

module.exports = router