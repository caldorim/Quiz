var models = require('../models/models.js'); //models.js importa a su vez a quiz

// GET /quizes/question
exports.question = function(req, res) {
  //findAll() devuelve un array con el contenido de la tabla
  models.Quiz.findAll().success(function(quiz){ 
    res.render('quizes/question', { pregunta: quiz[0].pregunta});
  })
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
	if (req.query.respuesta === quiz[0].respuesta) {
		res.render('quizes/answer', {respuesta: 'Correcto'});
	}
	else {
	    res.render('quizes/answer', {respuesta: 'Incorrecto'});	
	}
  })
};

// GET /author
exports.author = function(req, res) {
  res.render('author', {autor: 'Joaqu&iacute;n Caldito'});
};