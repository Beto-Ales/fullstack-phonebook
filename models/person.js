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
    const strNumber = String(val)                   // custom validation
    return strNumber.length >= 8
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true,
        unique: true
    },
    number: {
        type: Number,
        validate: {validator, message: `8 digits required`},
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