require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

// morgon loggor for seeing the request information in console:
morgan.token('body', (req, res)=>{
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :body - :req[content-length]'))

// let persons = [
// 	  { 
// 		"name": "Arto Hellas", 
// 		"number": "040-123456",
// 		"id": 1
// 	  },
// 	  { 
// 		"name": "Ada Lovelace", 
// 		"number": "39-44-5323523",
// 		"id": 2
// 	  },
// 	  { 
// 		"name": "Dan Abramov", 
// 		"number": "12-43-234345",
// 		"id": 3
// 	  },
// 	  { 
// 		"name": "Mary Poppendieck", 
// 		"number": "39-23-6423122",
// 		"id": 4
// 	  }
// 	]

	app.get('/api/persons', (req, res, next)=>{
		Person.find({})
		.then(persons=>{
			res.json(persons.map(person=>
				person.toJSON()))})
		.catch(error=>next(error))
	})

	app.get('/info', (req, res)=>{
		const data = new Date()
		let length
		Person.find({})
		.then(persons =>{
			res.send('<p>' + (`Phonebook has info for ${persons.length} people`) + '</p>'  + '<p>' + (data) + '</p>' )
		})
		.catch(error=>next(error))
	})

	app.get('/api/persons/:id', (req, res, next) =>{
		const id = Number(req.params.id)
		Person.findById(req.params.id)
		.then(person=>{
			if (person){
			res.json(person.toJSON())
		}else{
			res.status(404).end()
		}
		})
		.catch(error=>next(error)
		)
	})

	app.delete('/api/persons/:id', (req, res, next)=>{
		Person.findByIdAndRemove(req.params.id)
		.then(result=>{
			res.status(204).end()
		})
		.catch(error=>next(error)
		)
	})

	app.post('/api/persons/', (req, res, next)=>{
		const content = req.body
		if (!content.name || !content.number){
			return res.status(400).json({error: 
				'name and number can not be missing!'})
		}
		const newPerson = new Person({
			name: content.name,
			number: content.number,
		})
		newPerson.save()
		.then(savedPerson=>{
			res.json(savedPerson.toJSON())
		})
		.catch(error=>next(error))
	})

	app.put('/api/persons/:id', (req, res)=>{
		const body = req.body
		const person = {
			name: body.name,
			number: body.number,
		}
		Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson=>{
			res.json(updatedPerson.toJSON())
		})
		.catch(error=>next(error))		
	})
 
	const unknownEndpoint = (request, response) => {
		response.status(404).send({ error: 'unknown endpoint' })
	  }
	  
	app.use(unknownEndpoint)

	const errorHandler = (error, req, res, next) =>{
		// console.error(error)
		if (error.name==='CastError' && error.kind === 'ObjectId'){
			return res.status(400).send({ error: 'malformatted id' })
		} else if (error.name === 'ValidationError') {
			return res.status(400).json({ error: error.message })}
		next(error)
	}
	app.use(errorHandler)
	
	const PORT = process.env.PORT ||3001
	app.listen(PORT, () =>{
		console.log(`Server is running is port ${PORT}!`)
	})
