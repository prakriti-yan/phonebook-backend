const mongoose = require('mongoose')

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

const url=process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser:true })
.then(result=>{
    console.log('Connected to MongoDB!')
})
.catch((error)=>{
    console.log('error connecting to mongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
// const Person = mongoose.model('Person', personSchema)

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

