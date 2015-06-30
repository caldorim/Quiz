//Importar paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

//Importar enrutadores
var routes = require('./routes/index');
//var users = require('./routes/users'); //no se requiere

//Crear aplicación
var app = express();

// view engine setup
//Instalar generador de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
//Instala los middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('caldo-quiz miriadax'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials()); //con () para generar el MW a instalar

//Helpers dinámicos
app.use(function(req, res, next) {
    //guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    //hacer visible req.session en las vistas, para evitar pasarlo por parámetro
    res.locals.session = req.session;
    next();
});

//MW para el control de sesión
app.use(function(req, res, next) {
    var tiempoInactivo = 30000;
    var ahora = (new Date()).getTime();
    var nuevoTimeout = tiempoInactivo + ahora;
    console.log("---------------------------------------------------------------");
    console.log("Entrando en app.use...");
    console.log("Ahora:   "+ahora);
    
    if (req.session.user) { //Si estamos logados
        console.log("Timeout: "+req.session.user.timeout);
        if (req.session.user.timeout > ahora) { //Si aun no ha expirado
            console.log("Actualizando timeout");
            console.log("---> Valor antiguo: "+req.session.user.timeout);
            req.session.user.timeout = nuevoTimeout; //Actualizamos el timeOut
            console.log("---> Valor nuevo:   "+req.session.user.timeout);
        }
        else {
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log("TIMEOUT: Cerramos la sesion");
            req.session.destroy(); //Si la sesión ha expirado cerramos
        }
    }
    next();
});

//Instalar enrutadores
app.use('/', routes);
//app.use('/users', users); //no se requiere

// catch 404 and forward to error handler
//Resto de rutas: generar error 404 de HTTP
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//Gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
//Gestión de errores de producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
