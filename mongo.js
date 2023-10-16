const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster0.vzqds2z.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Note = mongoose.model('Note', noteSchema)

if(process.argv.length === 3){
    
    Note.find({}).then(results => {
        console.log('phonebook: ')
        for(const result of results ){
            console.log(`${result.name} ${result.number}`)
        }
        mongoose.connection.close()
    })
}

else{
    const note = new Note({
        name: newName,
        number: newNumber  
    })

    note.save().then(result => {
        console.log(`added ${result.name} ${result.number} `)
        mongoose.connection.close()
    })
}
