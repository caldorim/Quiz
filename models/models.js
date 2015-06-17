var path = require('path');

//Cargar Modelo ORM. Construiremos el modelo con sequelize
var Sequelize = require('sequelize');

//Usar BBDD SQLite. Sequelize es la clase de la BD
var sequelize = new Sequelize(null, null, null, 
	                         {dialect: "sqlite", storage: "quiz.sqlite"} );

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
//exportar definición de tabla Quiz para que se pueda usar en otros lugares de la aplicación
exports.Quiz = Quiz; 

//sequelize.sync() crea e inicializa tabla de preguntas en DB
//success(..) ejecuta el manejador una vez creada la tabla
sequelize.sync().success(function() {
  Quiz.count().success(function (count) {
    if (count === 0) {  //la tabla se inicializa solo si está vacía
    	Quiz.create({ pregunta: 'Capital de Italia',
                      respuesta: 'Roma' })
    	.success(function(){console.log('Base de datos inicializada')});
    };
  });
});