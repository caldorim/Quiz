var express = require('express');
var router = express.Router();

//Incluimos el controlador para las preguntas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
//La ruta es /
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
//Si existe el parametro fuerza la entrada por el autoload
router.param('quizId', quizController.load);

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create); //Cuando creamos algo debe ser post

//Añadimos un get para los autores
router.get('/author', quizController.author);

module.exports = router;
