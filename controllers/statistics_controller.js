var models = require('../models/models.js');

exports.statistics = function(req, res) {
	console.log('Entrando en statistics...');
	var errors = req.session.errors || {};
	req.session.errors = {};  //Reseteamos los errores
	var estadisticas = {
		numPreguntas: 0,
		numComentarios : 0,
		comentariosMedios: 0,
		sinComentarios: 0,
		conComentarios: 0
	};

  	//Cuenta para las estadísticas. Realmente solo nos hace falta consultar el número de preguntas,
  	//el de comentarios y las preguntas con comentarios. El resto se calcula a partir de estos.
  	models
  		.Quiz
  		.findAll({ //Por alguna razón no funciona bien el count y hay que hacerlo con un findAll
  			//Hacemos un inner join (required a true) de las tablas Quiz y Comment
  			include: [ { model: models.Comment, as: models.Comment.tableName, required: true }]})
  		.then(function (innerJoin) { //Cálculo de preguntas con comentarios
  			estadisticas.conComentarios = innerJoin.length;
  			return models.Quiz.count();
  		})
  		.then(function(numPreguntas) { //Cálculo de número de preguntas
  			estadisticas.numPreguntas = numPreguntas;
  			return models.Comment.count();
  		})
 		.then(function(numComentarios) { //Cálculo de número de comentarios
  			estadisticas.numComentarios = numComentarios;
  			//Con los tres valores que tenemos ya podemos calcular el resto
  			if (estadisticas.numComentarios != 0) { //Para evitar división por 0
				estadisticas.comentariosMedios = (estadisticas.numPreguntas / estadisticas.numComentarios).toFixed(2);
			}
			estadisticas.sinComentarios = estadisticas.numPreguntas - estadisticas.conComentarios;
			res.render('quizes/statistics', {estadisticas: estadisticas, errors: errors} );
  		})
  		.catch(function(error) { console.log(error);})
};