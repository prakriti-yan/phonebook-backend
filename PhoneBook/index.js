const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.json())
// app.use(morgan('tiny'))


morgan.token('body', (req, res)=>{
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time ms - :body - :req[content-length]'))

let persons = [
	  { 
		"name": "Arto Hellas", 
		"number": "040-123456",
		"id": 1
	  },
	  { 
		"name": "Ada Lovelace", 
		"number": "39-44-5323523",
		"id": 2
	  },
	  { 
		"name": "Dan Abramov", 
		"number": "12-43-234345",
		"id": 3
	  },
	  { 
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122",
		"id": 4
	  }
	]

	app.get('/api/persons', (req, res)=>{
		res.json(persons)
	})

	app.get('/', (req, res)=>{
		res.send('<h>Hello world!</h>')
	})

	app.get('/info', (req, res)=>{
		const data = new Date()
		const text = `Phonebook has info for ${persons.length} people`
		res.send('<p>' + (text) + '</p>'  + '<p>' + (data) + '</p>' )
	})

	app.get('/api/persons/:id', (req, res) =>{
		const id = Number(req.params.id)
		const person = persons.find(person=>person.id === id)
		if (person){
			res.json(person)
		}else{
			res.status(404).end()
		}
	})

	app.delete('/api/persons/:id', (req, res)=>{
		const id = Number(req.params.id)
		persons = persons.filter(person=>person.id !== id)
		res.status(204).end()
	})

	app.post('/api/persons/', (req, res)=>{
		const content = req.body
		
		if (!content.name || !content.number){
			return res.status(400).json({error: 
				'name and number can not be missing!'})
		}
		else if (persons.find(person=> person.name === content.name)){
			return res.status(400).json({error: 
				'name must be unique!'})
		}
		
		const newPerson = {
			name: content.name,
			number: content.number,
			id: Math.floor(Math.random()* 500),
		}
		persons = persons.concat(newPerson)
		res.json(newPerson)
	})

	const unknownEndpoint = (request, response) => {
		response.status(404).send({ error: 'unknown endpoint' })
	  }
	  
	  app.use(unknownEndpoint)

	const PORT = 3001
	app.listen(PORT, () =>{
		console.log(`Server is running is port ${PORT}!`)
	})
