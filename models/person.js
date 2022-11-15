const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error.message)
    })

function validator (val) {
    return /\d{3}-\d{5}/.test(val) || /\d{2}-\d{6}/.test(val)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true,
        unique: true
    },
    number: {
        type: String,
        validate: {validator, message: `8 digits required, and the format must be 55-555555 or 555-55555`},
        require: true
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)