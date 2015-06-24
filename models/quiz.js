// Definición del modelo de Quiz (cómo es la tabla quiz)
//pregunta y respuesta son las columnas de la tabla
//en quiz.sqlite se guardarán los datos de esta tabla
module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Quiz', { 
			pregunta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "·Falta Pregunta"}}
			},
		    respuesta: {
		    	type: DataTypes.STRING,
		    	validate: { notEmpty: {msg: "·Falta Respuesta"}}
		    },
		    tema: {
		    	type: DataTypes.STRING,
		    	//values: ['otros', 'humanidades', 'ocio', 'ciencia', 'tecnologia'],
		    	//validate: { notEmpty: {msg: "·Falta Tema"}}
		    	validate: { isIn: [['otros', 'humanidades', 'ocio', 'ciencia', 'tecnologia']]  }
		    }
		});
}