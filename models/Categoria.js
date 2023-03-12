const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Categoria = new Schema({
  nome: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  date: {
    type: date,
    default: Date.now()
  }
})

mongoose.model("categorias", Categoria)