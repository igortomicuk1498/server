var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render("index", {
    title: "Мои контакты",
    emailsVisible: true,
    emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
    phone: "+1234567890"
  });

});

module.exports = router;
