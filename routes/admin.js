const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
const {eAdmin} = require("../helper/eAdmin")

router.get("/", eAdmin, (req, res) => {
  res.render("admin/index")
});

router.get("/posts", eAdmin, (req, res) => {
  res.send("Pagina de posts")
});

router.get("/categorias", eAdmin, (req, res) => {
  Categoria.find().sort({ date: "desc" }).lean().then((categorias) => {
    res.render("admin/categorias", { categorias: categorias })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as categorias!")
    res.redirect("/admin")
  })
});

router.get("/categorias/add", eAdmin, (req, res) => {
  res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) => {
  var erros = []

  if (!req.body.nome || req.body.nome == undefined || req.body.nome == null || req.body.nome.length <= 0) {
    erros.push({ texto: "Nome inválido!" })
  }

  if (!req.body.slug || req.body.slug == undefined || req.body.slug == null || req.body.slug.length <= 0) {
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
      req.flash("success_msg", "Categoria criada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao salvar a categoria!")
      res.redirect("/admin")
    })
  }
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
  Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
    res.render("admin/editcategorias", { categoria: categoria })
  }).catch((err) => {
    req.flash("error_msg", "Esta categoria não exite.")
    res.redirect("/admin/categorias")
  })
})

router.post("/categorias/edit", eAdmin, (req,res) => {
  var erros = []

  if (!req.body.nome || req.body.nome == undefined || req.body.nome == null || req.body.nome.length <= 0) {
    erros.push({ texto: "Nome Inválido."})
  }

  if (!req.body.slug || req.body.slug == undefined || req.body.slug == null || req.body.slug.length <= 0) {
    erros.push({ texto: "Slug inválido."})
  }

  if (erros.length > 0) {
    res.render("admin/editcategorias", { erros: erros })
  } else {
    Categoria.findByIdAndUpdate({_id:req.body.id}).sort({data: 'desc'}).then((categoria) =>{
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug
      categoria.save().then(() => {
        req.flash("success_msg", "Categoria editada com sucesso.")
        res.redirect("/admin/categorias")
      }).catch((err) => {
        req.flash("error_msg", "houve um erro interno ao salvar a edição da categoria.")
        res.redirect("/admin/categorias")
      })
    }).catch((err) =>{
      console.log(err)
      req.flash("error_msg", "Houve um erro ao editar a categoria.")
      res.redirect("/admin/categorias")
    })
  }
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
  Categoria.deleteOne({_id: req.body.id}).then( () => {
    req.flash("success_msg", "Categoria deletada com sucesso!")
    res.redirect("/admin/categorias")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao deletar categoria!")
    res.redirect("/admin/categorias")
  })
})

router.get("/postagens", eAdmin, (req, res) => {

  Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens) => {
    res.render("admin/postagens", {postagens: postagens})
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as postagens")
    res.redirect("/admin")
  })
})

router.get("/postagens/add", eAdmin, (req, res) => {
  Categoria.find().lean().then((categorias) => {
    res.render("admin/addpostagem", {categorias: categorias})
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao carregar formulario!")
    res.redirect("/admin")
  })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
  var erros = []

  if (req.body.categoria == 0 ){
    erros.push({texto: "Categoria invalida, resgistre uma categoria"})
  }
  if (erros.length > 0){
    res.render("admin/addpostagem", {erros: erros})
  }else{
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }
    new Postagem(novaPostagem).save().then(() => {
      req.flash("success_msg", "Postagem criada com sucesso!")
      res.redirect("/admin/postagens")
    }).catch((err) => {
      req.flash((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a postagem!")
        res.redirect("/admin/postagens")
      })
    })
  }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

  Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
    Categoria.find().lean().then((categorias) => {
      res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar as categorias.")
      res.redirect("/admin/postagens")
    })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao editar a postagem.")
    res.redirect("admin/postagens")
  })
})

router.post('/postagens/edit', eAdmin, (req, res) => {

  Postagem.findByIdAndUpdate({_id:req.body.id}).sort({data: 'desc'}).then((postagem) => {

      postagem.titulo = req.body.titulo
      postagem.slug = req.body.slug
      postagem.descricao = req.body.descricao
      postagem.conteudo = req.body.conteudo
      postagem.categoria = req.body.categoria

      postagem.save().then(() => {

          req.flash('success_msg', 'Postagem atualizada com sucesso')
          res.redirect('/admin/postagens')
      }).catch((err) => {
          req.flash('error_msg', 'Erro na atualização da postagem')
          res.redirect('/admin/postagens')
      })
  }).catch((err) => {
      req.flash('error_msg', 'Houve um erro na edição da postagem ' )
      res.redirect('/admin/postagens')
  })

})

router.post("/postagens/deletar", eAdmin, (req, res) => {
  Postagem.deleteOne({_id: req.body.id}).then(() => {
    req.flash("success_msg", "Postagem deletada com sucesso.")
    res.redirect("/admin/postagens")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao deletar a postagem")
    res.redirect("/admin/postagens")
  })
})



module.exports = router