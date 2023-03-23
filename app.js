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
const Postagem = mongoose.model("postagens")

/* CONFIGURAÇÕES */
// sessão
app.use(session({
  secret: "cursodenode",
  resave: true,
  saveUninitialized: true
}))
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
mongoose.connect("mongodb://localhost/blogapp").then(() => {
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

app.get("/404", (req, res) => {
  res.send("Erro 404!")
})

app.use("/admin", admin)

/* OUTROS */
const PORT = 8081
app.listen(PORT, () => {
  console.log("Servidor Rodando!")
})