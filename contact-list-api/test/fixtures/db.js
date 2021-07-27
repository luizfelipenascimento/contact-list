const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { db } = require('../../src/model/user')
const User = require('../../src/model/user')

const {JWT_TOKEN} = process.env

const userOne = {
    password: 'test123456!',
    birthday: '1990-01-01',
    email: 'helumn@test.com',
    name: 'Helumn',
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    password: 'test123456!',
    birthday: '1990-01-01',
    email: 'urdrandin@test.com',
    name: 'Urdrandin',
    tokens: [ {
        token: jwt.sign({_id: userTwoId}, JWT_TOKEN)
    }]
}

const userThree = {
    password: 'test123456!',
    birthday: '1990-01-01',
    email: 'junlay@test.com',
    name: 'Junlay',
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new User(userThree).save()
}

module.exports = {
    setupDatabase,
    userOne,
    userTwo,
    userThree
}