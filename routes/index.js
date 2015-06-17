var express = require('express');
var router = express.Router();

//Incluimos el controlador para las preguntas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
//La ruta es /
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET de preguntas */
//La ruta es /quizes/question
router.get('/quizes/question', quizController.question);

/* GET de respuestas */
//La ruta es /quizes/answer
router.get('/quizes/answer', quizController.answer);

//Añadimos un get para los autores
router.get('/author', quizController.author);

module.exports = router;
