const User = require('../model/user')
const jwt = require('jsonwebtoken')

const {JWT_TOKEN} = process.env

const auth = async (req, resp, next) => {
    try {
        const token = req.get('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, JWT_TOKEN)
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        
        if (!user)
            throw new Error('Unauthorized')

        req.user = user
        req.token = token

        next()
    } catch (e) {
        resp.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth