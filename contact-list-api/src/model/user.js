const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minLength: 8
    },

    birthday: {
        type: Date,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('This email is not valid!')
            }
        }
    },

    phones: [{
        phone: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isMobilePhone(value, 'pt-BR')) {
                    throw new Error('Not a valid phone number!')
                }
            }            
        }
    }],

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps: true
})


userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) 
        user.password = await bcrypt.hash(user.password, 8)

    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne({email})

    if (!user) 
        throw new Error('Unable to login!')
    
    const isMatch = bcrypt.compareSync(password, user.password) 


    if (!isMatch) 
        throw new Error('Unable to login!')

    return user
}

userSchema.methods.toJSON = function() {
    const {_id, name, birthday, email, createdAt, updatedAt} = this.toObject()
    const publicProfile = {
        _id, name, birthday, email, createdAt, updatedAt
    }

    return publicProfile
}


const User = mongoose.model('User', userSchema)

module.exports = User