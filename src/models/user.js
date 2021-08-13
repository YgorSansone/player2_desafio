const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email é invalido!')
      }
    }
  },
  senha: {
    type: String,
    required: true,
    trim: true,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User