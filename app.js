/* CARREGANDO MODULOS */
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);

/* CONFIGURAÇÕES */
// sessão
app.use(session({
  secret: "cursodenode",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next();
})
// bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// handlebars
app.engine("handlebars", handlebars.engine({ defaulLayout: "main" }));
app.set("view engine", "handlebars");
// mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1/blogapp").then(() => {
  console.log("Banco de Dados Conectado!")
}).catch((err) => {
  console.log("Houve um erro ao se conectar: " + err)
})
// PUBLIC
app.use(express.static(path.join(__dirname, "public")))

/* ROTAS */
app.get("/", (req, res) => {
   Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
    res.render("index", {postagens: postagens})
   }).catch((err) => {
    req.flash("error_msg", "houve um erro interno")
    res.redirect("/404")
   })
})

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
    if(postagem){
      res.render("postagem/index", {postagem:postagem})
    }else{
      req.flash("error_msg", "Essa postagem não existe!")
      res.redirect("/")
    }
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro interno!")
    res.redirect("/")
  })
})

app.get("/categorias", (req, res) => {
  Categoria.find().lean().then((categorias) => {
    res.render("categorias/index", {categorias: categorias})
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro interno ao listar as categorias.")
    res.redirect("/")
  })
})

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({slug: req.params.slug}).lean().then((categorias) => {
    if(categorias){
      Postagem.find({categoria: categorias._id}).lean().then((postagens) => {
        res.render("categorias/postagens", {postagens: postagens, categorias: categorias})
      }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao listar os posts.")
        res.redirect("/")
      })
    }else{
      res.flash("error_msg", "Essa categoria não existe")
      res.redirect("/")
    }
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria")
    res.redirect("/")
  })
})

app.get("/404", (req, res) => {
  res.send("Erro 404!")
})

app.use("/admin", admin)
app.use("/usuarios", usuarios)

/* OUTROS */
const PORT = 8081
app.listen(PORT, () => {
  console.log("Servidor Rodando!")
})