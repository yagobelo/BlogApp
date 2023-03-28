module.exports = {
  eAdmin: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error_msg", "Você precisa ser um Admin!")
    res.redirect("/")
  }
}