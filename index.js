//importing dependencies
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

//using dotenv
require('dotenv').config()

//import note to use MongoDB database
const Note = require('./models/note')

//use cors
app.use(cors())
//to use frontend
app.use(express.static('build'))
app.use(express.json())

//Testing morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :playJson '))
morgan.token('playJson', (req, res) => {
  //const stringPerson = JSON.stringify(req.body)
  //console.log(stringPerson)
  return JSON.stringify(req.body)
})

const errorHandler = (error, req, rep, next) => {
  console.log(error.message)

  if(error.name === "CastError"){
    return rep.status(400).send( {error: 'malFormatted Id' } )
  }
  else if (error.name === "ValidationError"){
    return rep.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(400).json.send( {error: "unknown endpoint"} )
}

const currentDate = new Date()

let d = currentDate[Symbol.toPrimitive]('string')

console.log(currentDate[Symbol.toPrimitive]('string'))

let persons = []

app.get('/info', (request, response) => {
  Note.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${d}<p/>`)
  })
})

app.get('/api/persons', (request, response) => {
  Note.find({}).then(persons => {
    console.log(persons[1]._id)
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Note.findById(request.params.id).then(person=> {
    response.json(person)
  })
})


app.delete('/api/persons/:id', (req, rep) => {
  Note.findByIdAndRemove(req.params.id).then(
    result => {rep.status(204).end()}
  ).catch(error => next(error))
})

app.post('/api/persons' , (req, rep, next) => {
  const bod = req.body
  console.log(bod)
  //const stringPerson = json.stringify(bod)
  /*
  if(!bod.name || !bod.number){
    return rep.status(400).json({
      error: "The name or number is missing"
    })
  }
  
  /*
  for(const per of persons){
    if(per.name.toLowerCase() === bod.name.toLowerCase()){
      return rep.status(400).json({
        error: "The name already exists in the book "
      })
    }
  }
  */
  const person = new Note({
    name: bod.name,
    number: bod.number
  })
  person.save().then(newPerson => {
    rep.json(newPerson)
  }).catch(error => next(error))
}) 

app.put('/api/persons/:id', (req, rep, next) => {
  const bod= req.body
  //console.log(JSON.stringify(bod))

  const person = {
    name: bod.name,
    number: bod.number
  }
  Note.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: "query"}).then(
    result => rep.json(result)
  ).catch(
    error => next(error)
  )
  
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT)
console.log(`Server running on port ${PORT}`)