// Definición del modelo de Quiz (cómo es la tabla quiz)
//pregunta y respuesta son las columnas de la tabla
//en quiz.sqlite se guardarán los datos de esta tabla
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz',
		                   { pregunta:  DataTypes.STRING,
		                     respuesta: DataTypes.STRING,
		                    });
}