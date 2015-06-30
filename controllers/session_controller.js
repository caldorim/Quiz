//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) { //Si hay usuario logado pasamos al siguiente MW
		next();
	}
	else { //En caso contrario redireccionamos a la ventana de login
		res.redirect('/login');
	}
};


//GET /login  -- Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};  //Reseteamos los errores

	res.render('sessions/new', {errors: errors});
};

//POST /login  -- Crear la sesión
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	//Practica 9: variable para controlar el tiempo
	var ahora = (new Date()).getTime();
	var timeout = 30000 + ahora;
	console.log("Entrando en session_controller...");
	console.log("Ahora:   "+ahora);
    console.log("Timeout: "+timeout);

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) { //si hay error retornamos los mensajes de error de sesión
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}

		// Crear req.session.user y guardar campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = { id: user.id, username: user.username, timeout: timeout};
		res.redirect(req.session.redir.toString()); //redirección al path anterior al login
	});
};

//DELETE /logout  -- Destruir sesión
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());  //redireción al path anterior al login
};