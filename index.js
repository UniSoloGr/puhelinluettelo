require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const apiPersons= '/api/persons'

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(requestLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get(apiPersons, (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then((persons) => {
    response.send(`
      <p>Phonebook has in for for ${persons.length} people</p>
      <p>${date.toString()}</p>
    `)
  })
})

app.get(apiPersons + '/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post(apiPersons, (request, response, next) => {
  const errorMessage = (message) => {
    return response.status(400).json({
      error: `${message}`
    })
  }
  const body = request.body

  if (!body.name) {
    return errorMessage('name missing')
  }

  if (!body.number) {
    return errorMessage('number missing')
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })


  person.save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put(apiPersons + '/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete(apiPersons + '/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})