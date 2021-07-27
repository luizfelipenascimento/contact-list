const express = require('express')
require('./db/mongoose')

const app = express()
const userRouter = require('./routers/user')

app.use(express.json())
app.use(userRouter)

app.get('*', (req, resp) => {
    resp.sendStatus(404)
})

module.exports = app