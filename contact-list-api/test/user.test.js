const request = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const User = require('../src/model/user')
const jwt = require('jsonwebtoken')
const {JWT_TOKEN} = process.env

const {setupDatabase, userOne, userTwo} = require('./fixtures/db')

let userData

beforeEach(async () => {
    await setupDatabase()
    userData = {
        name: 'luiz felipe',
        birthday: new Date(1995,1, 26),
        password: 'lf00023!',
        email: 'luiz@test.com'
    }
})

test('Should singup a new user', async () => {   
    const response = await request(app)
    .post('/users')
    .send(userData)
    .expect(201)

    const user = await User.findById(response.body._id)
    expect(JSON.stringify(user)).toBe(JSON.stringify(response.body))
})

test('Should encrypt password on singup', async () => {

    const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201)

    const user = await User.findById(response.body._id)
    expect(user.password).not.toBe(userData.password)
    expect(bcrypt.compareSync(userData.password, user.password)).toBe(true)
})

test('Should not allow invalid email', async () => {
    
    userData.email = 'luiztest'

    const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400)
})

test('Should not allow invalid birthday', async () => {

    userData.birthday = 'asdasd'

    const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400)
})

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'test123456!'
        })
        .expect(200)

    const token = response.body.token
    expect(token).not.toBe(undefined)
    
    const user = await User.findById(response.body.user._id)
    expect(token).toBe(user.tokens[0].token)
})

test('Should not login an unexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'email1@test.com',
            password: 'asdasd!32'
        })
        .expect(400)
})

test('Should not login with wrong password', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'asdasdawe2131'
        })
        .expect(400)
})

test('should not get profile unauthenticated', async () => {
    await request(app)
        .get('/users/me')
        .expect(401)
})

test('Should not get profile with invalid token', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer asdasdaiojwoiejqmdqoiwjeui')
        .expect(401)
})

test('Should not get profile with not registered token', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + jwt.sign({_id: userTwo.id}, JWT_TOKEN))
        .expect(401)
})

test('Should get profile for user', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userTwo.tokens[0].token)
        .expect(200)
    
    const userProfile = response.body
    const user = await User.findById(userProfile._id)

    expect(userProfile).not.toBe(undefined)
    expect(JSON.stringify(userProfile)).toEqual(JSON.stringify(user))
})

test('Should login and get access to authorized services', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'test123456!'
        })
        .expect(200)
    
    const token = response.body.token
    
    const user = await User.findOne({_id: response.body.user._id, 'tokens.token': token})
    
    expect(user.tokens[0].token).toBe(token)

    expect(token).not.toBe(undefined)
    
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
})

test('User Should add a new contact', async () => {

})

test('User Should not add a new contact unauthenticated', async () => {

})

