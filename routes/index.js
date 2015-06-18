var express = require('express');
var router = express.Router();

//Incluimos el controlador para las preguntas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
//La ruta es /
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//Añadimos un get para los autores
router.get('/author', quizController.author);

module.exports = router;
