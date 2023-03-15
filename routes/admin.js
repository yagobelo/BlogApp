const express = require("express");
//const { default: mongoose } = require("mongoose");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
  res.render("admin/index")
});

router.get("/posts", (req, res) => {
  res.send("Pagina de posts")
});

router.get("/categorias", (req, res) => {
  res.render("admin/categorias")
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {
  var erros = []

  if (!req.body.nome && req.body.nome == undefined || req.body.nome == null || req.body.nome.length <= 0) {
    erros.push({ texto: "Nome inválido!" })
  }

  if (!req.body.slug && req.body.slug == undefined || req.body.slug == null || req.body.slug.length <= 0) {
    erros.push({ texto: "Slug inválido!" })
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros })
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
      console.log("Categoria salva com sucesso!")
    }).catch((err) => {
      console.log("Houve um erro ao salvar a nova categoria: " + err)
    })
  }


})

module.exports = router