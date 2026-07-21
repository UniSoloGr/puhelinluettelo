const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(number) {
        const parts = number.split('-')
        if (parts.length !== 2) {
          return false
        }

        const [firstPart, secondPart] = parts
        return (firstPart.length === 2 || firstPart.length === 3) && 
        /^\d+$/.test(firstPart) && 
        /^\d+$/.test(secondPart) && 
        number.length >= 8
        },
        message: props => `${props.value} is not a valid phone number!`
      },
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', phonebookSchema)