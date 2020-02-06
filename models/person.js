const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url=process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser:true })
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type:String, 
		required: true, 
		unique: true, 
		minlength: 3
	},
	number: {
		type:String, 
		required: true, 
		unique: true, 
		minlength: 8
	}
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



// const person = new Person({
//     name: `${name}`,
//     number: `${number}`,
// })

// if (name && person){
// person.save().then(response=>{
//     console.log('person saved:', response)
//     mongoose.connect.close()
// })}

// else {
    
//     Person.find({}).then(result=>{
//         console.log('phonebook:')
//         result.forEach(person=>{
//             console.log(person.name, person.number)
//         })
//         mongoose.connect.close()
//     })
// }