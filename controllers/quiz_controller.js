var models = require('../models/models.js'); //models.js importa a su vez a quiz

//Función que sustituye los posibles acentos en las vocales
function limpiarAcentos(str) {
	return str.replace(/[áàäâ]/gi,"a").replace(/[éèëê]/gi,"e").replace(/[íìïî]/gi,"i").replace(/[óòöô]/gi,"o").replace(/[úùüû]/gi,"u");
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
  var buscarTema = req.query.searchTema||"";
  buscar = "%" + buscar.toLowerCase().replace(/ /g,"%") + "%"; //Sustituimos los espacios en blanco por %
  buscarTema = "%" + buscarTema + "%";
  console.log("Cadena a buscar: "+buscar+". Tema a buscar: "+buscarTema);

  La siguiente consulta no funciona en heroku
  models.Quiz.findAll({where: ["lower(pregunta) like ? and tema like ?", buscar, buscarTema], order: "pregunta"}).then(function(quizes) {
  	res.render('quizes/index.ejs', { quizes: quizes, errors: []});
  }).catch(function(error) { next(error);})
};

exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  //Limpiamos los acentos y convertimos todo a minúsculas para flexibilizar
  var queryResp = req.query.respuesta||"";
  var quizResp  = req.quiz.respuesta||"";
  queryResp = limpiarAcentos(queryResp.toLowerCase());
  quizResp = limpiarAcentos(quizResp.toLowerCase());
  if (queryResp === quizResp) resultado = "Correcto";
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});	
};

// GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build({ //crea objeto quiz (build es de sequelize)
		  //Los campos deben ser iguales a los campos de la tabla
          pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"
		});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz ); //lo inicializa con el objeto body (paso de parámetros)

	quiz.validate().then(  //validate() la construye automaticamente sequelize
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}
			else {
				//guarda en la DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["pregunta", "respuesta", "tema"]}) //solo los campos necesarios para evitar virus
				.then(function(){ res.redirect('/quizes');}); //Redirección HTTP (URL relativo) lista de preguntas, pues /quizes/create no tiene vista asociada
			}
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; //autoload de instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// put /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}
		else {
			req.quiz  
			.save({ fields: ["pregunta", "respuesta", "tema"] })     //save: guarda campos necesarios en DB
			.then(function(){ res.redirect('/quizes'); }); //Redirección HTTP a lista de preguntas (URL relativo)
		}
	});
};

// DELETE: /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

// GET /author
exports.author = function(req, res) {
  res.render('author', {autor: 'Joaqu&iacute;n Caldito', errors: []});
};