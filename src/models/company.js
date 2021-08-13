const mongoose = require('mongoose')

const company = new mongoose.Schema({
  razao_social: {
    type: String,
    required: true
  },
  nome_fantasia: {
    type: String, 
    required: true
  },
  cnpj: {
    type: Number, 
    required: true,
    unique: true,
  },
  informacoes: {
    type: Object, 
    required: true
  },
})

const Company = mongoose.model('Company', company)

module.exports = Company