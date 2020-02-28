const mongoose = require('mongoose')

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