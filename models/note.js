const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')
mongoose.connect(url).then(
    console.log('connected to MongoDB')
).catch(error => {
    console.log('sonething happened: ', error.message)
})

const noteSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate:{
            validator: (v) => {
                /*
                let count = 0
                let ans = true
                let count2 = 0
                if(v[2] != '-' || v[3] != '-'){
                    return false
                }
                for(const i = 0; i < v.length; i++){
                    count ++
                    if(v[i] === '-')
                }
                */
                return (/^\d{2}-\d+$/.test(v) || /^\d{3}-\d+$/.test(v))
            },
            message: (input) => `${input.value} is not a valid number`
        },
        required: true
    },
})


noteSchema.set('toJSON', {
    transform: (doc, ret ) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)