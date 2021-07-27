const mongoose = require('mongoose')

const { DATABASE_URL } = process.env

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, //search for database index
    useFindAndModify: false
}).catch(e => console.log('database error:', e))
