var models = require('../models/models.js'); //models.js importa a su vez a quiz

//Función que sustituye los espacios en blanco por % y añade sendos % al comienzo y al final
function limpiarAcentos(str) {
	var a = "%" + str.replace(/ /g,"%") + "%";
}

//Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
      	req.quiz = quiz;
      	next();  //para que se ejecuete el MW correspondiente
      }
      else {
      	next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error);});
};

exports.index = function(req, res) {
  //Se captura el parámetro "search" (ver /quizes/index.ejs) para filtrar
  var buscar = req.query.search||"";
  buscar = "%" + buscar.replace(/ /g,"%") + "%"; //Sustituimos los espacios en blanco por %
  console.log("Cadena a buscar: "+buscar);

  models.Quiz.findAll({where: ["pregunta like ?", buscar]}).then(function(quizes) {
  	res.render('quizes/index.ejs', { quizes: quizes});
  }).catch(function(error) { next(error);})
};

exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) resultado = "Correcto";
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});	
};

// GET /author
exports.author = function(req, res) {
  res.render('author', {autor: 'Joaqu&iacute;n Caldito'});
};