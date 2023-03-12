/* CARREGANDO MODULOS */
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin")
const path = require("path")
//const mongoose = require("mongoose");

/* CONFIGURAÇÕES */
// boryparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// handlebars
app.engine("handlebars", handlebars.engine({ defaulLayout: "main" }));
app.set("view engine", "handlebars");
// mongoose

// PUBLIC
app.use(express.static(path.join(__dirname, "public")))

/* ROTAS */
app.use("/admin", admin)


/* OUTROS */
const PORT = 8081
app.listen(PORT, () => {
  console.log("Servidor Rodando!")
})