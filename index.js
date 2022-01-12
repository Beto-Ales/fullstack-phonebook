const express = require('express')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())     // json-parser

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }

    next(error)
}

const requestLogger = (request, response, next) => {
    console.log('Method', request.method)
    console.log('Path', request.path)
    console.log('Body', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/info', (request, response) => {

    let totalPeople

    Person.find({}).then(persons => {
        totalPeople = persons.length
    })
    .then(result => {
        response.send(`<p>Phonebook has info for ${totalPeople} people</p><br/><p>${new Date()}</p>`)
    })  
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }        
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {

    const body = request.body    

    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'Name or number missing'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,        
    })
    
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
    
})

app.put('/api/persons/:id', (request, response, next) => {
    
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

app.use(errorHandler)



const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// heroku
// https://sleepy-badlands-39412.herokuapp.com/
// https://sleepy-badlands-39412.herokuapp.com/api/persons