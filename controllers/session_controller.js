//En caso de haber perdido la sesion no se puede redireccionar, por lo que iriamos a la raíz
function redireccionar(req) {
	var dir = "/";	
	if (req.session && req.session.redir ) {
		dir = req.session.redir.toString();
	}
	return dir;
}

//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session && req.session.user) { //Si hay usuario logado pasamos al siguiente MW
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
		res.redirect(redireccionar(req)); //redirección al path anterior al login
	});
};

//DELETE /logout  -- Destruir sesión
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(redireccionar(req));  //redireción al path anterior al login
};