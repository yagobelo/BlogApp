const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 3){
    erros.push({texto: "Nome invalido!"})
  }
  
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null || req.body.email.length < 3){
    erros.push({texto: "E-mail invalido!"})
  }

  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
    erros.push({texto: "Senha invalida!"})
  }

  if(req.body.senha.length < 4){
    erros.push({texto: "Senha muito curta!"})
  }

  if(req.body.senha2 != req.body.senha){
    erros.push({texto: "As senha estão diferentes, tente novamente!"})
  }

  if(erros.length > 0){
    res.render("usuarios/registro", {erros: erros})
  }else{

  }

})

module.exports = router