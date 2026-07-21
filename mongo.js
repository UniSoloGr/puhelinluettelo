require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://raceer:${password}@klusteri.6u46jbz.mongodb.net/phonebook?appName=Klusteri`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const phonebookSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', phonebookSchema)

const newEntry = (name, phone) => {
  const note = new Person({
    name: name,
    phone: phone,
  })

  note.save().then(result => {
    console.log('note saved!')
    console.log(result)
    mongoose.connection.close()
  })
}

const getAllEntries = () => {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const phone = process.argv[4]
  newEntry(name, phone)
} else if (process.argv.length === 3) {
  getAllEntries()
}