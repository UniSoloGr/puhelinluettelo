const express = require('express')
const app = express()
const cors = require('cors')

const apiPersons= "/api/persons"
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
console.log(persons)

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get(apiPersons, (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toString()}</p>
  `)
})

app.get(apiPersons + '/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete(apiPersons + '/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = (max) => {
  return Math.floor(Math.random() * max)
}

app.post(apiPersons, (request, response) => {
  const errorMessage = (message) => {
    return response.status(400).json({
      error: `${message}`
    })
  }
  const body = request.body

  if (!body.name) {
    errorMessage(`name missing`)
  } else if (!body.number) {
    errorMessage('number missing')
  } else if (persons.find(person => person.name === body.name)) {
    errorMessage('name must be unique!')
  }

  const id = generateId(10**6)

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})