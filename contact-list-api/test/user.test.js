const request = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const User = require('../src/model/user')

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


