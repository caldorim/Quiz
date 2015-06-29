var express = require('express');
var router = express.Router();

//Incluimos el controlador para las preguntas
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
//La ruta es /
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
//Si existe el parametro fuerza la entrada por el autoload
router.param('quizId', quizController.load);

//Definición de rutas de sesión
router.get('/login', sessionController.new);       //formulario de login
router.post('/login', sessionController.create);   //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create); //Cuando creamos algo debe ser post
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);


//Añadimos un get para los autores
router.get('/author', quizController.author);

module.exports = router;
