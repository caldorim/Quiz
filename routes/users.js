var express = require('express');
var router = express.Router();

/* GET users listing. */
//Aunque venga como '/', realmente es '/users', pues en el fichero app.js lo invocamos así,
//así que la '/' aquí indica de donde se parte, en este caso equivale a '/users'
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
