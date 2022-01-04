const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('build'))

app.use(express.json())     // json-parser

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



const totalPeople = persons.length

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${totalPeople} people</p><br/><p>${new Date()}</p>`)       // Since the parameter is a string, express automatically sets the value of the Content-Type header 
})                                          // to be text/html. The status code of the response defaults to 200.

app.get('/api/persons', (request, response) => {
    response.json(persons)                        // Express automatically sets the Content-Type header with the appropriate value of application/json
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find(note => note.id == id)      // notice the == and not === becouse request.params.id is string, and not an integer
    if (note) {
        response.json(note)   
    } else {
        response.status(404).end()
    }    
})



app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(note => note.id))
    : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {

    const body = request.body                       // Without the json-parser, the body property would be undefined    

    let nameIsNotUnique = false

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    persons.forEach((person) => {
        if (
            JSON.stringify(person. name.toLocaleLowerCase()) === JSON.stringify(body.name.toLocaleLowerCase())
        ) {
            return response.status(400).json({error: 'Name must be unique'}), nameIsNotUnique = true
        
        }
    })

    if (nameIsNotUnique) {
        return
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
        // date: new Date(),        
    } 
    
    persons = persons.concat(person)    
    response.json(person)
    
})



const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})