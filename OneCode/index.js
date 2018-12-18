var express = require("express");
var session = require("express-session");
var mysql = require("mysql");
//var passport = require("passport");
//var FacebookStrategy = require("passport-facebook").Strategy;
//var config = require("./configuracionApiKeys");
var bodyParser = require("body-parser");
var app = express();
var credenciales = {
        host:"localhost",
        user:"root",
        password:"",
        port:"3306",
        database: "one_code"
};

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({secret:"ASDFSDF$%%aasdera", resave: true, saveUninitialized:true}));

var home = express.static("home");
app.use(
    function(peticion,respuesta,next){
        if (peticion.session.correo){
                home(peticion,respuesta,next);    
        }
        else
            return next();
    }
);

function verificarAutenticacion(peticion, respuesta, next) {
        if (peticion.session.correo)
            return next();
        else
            respuesta.send("ERROR, ACCESO NO AUTORIZADO");
    }


/*/configuracion de passport
passport.serializeUser(function(user, done){
        done(null, user);
});
passport.deserializeUser(function(obj, done){
        done(null, obj);
});

//configuración autenticado con facebook
passport.use(new FacebookStrategy({
        clientID : config.facebook.id,
        clientSecret : config.facebook.secret,
        callbackURL : '/auth/facebook/callback',
        profileFields : ['id', 'displayName']
        }, function(accessToken, refreshToken, profile, done){
                var conexion = mysql.createConnection(credenciales);
                conexion.query("SELECT * FROM tbl_usuario WHERE CODIGO_USUARIO = '"+profile.id+"'",
                              function(error, user){
                                        if(error){
                                                return done(error)
                                        }
                                        if(!error && user!= null){ 
                                                return done(null, user);
                                        }
                                        var newUserMysql = new Object();
                                        newUserMysql.CODIGO_USUARIO = profile.id;
                                        
                                        newUserMysql.nombre = profile.displayName;
                                        var insertQuery = "INSERT INTO tbl_usuario (CODIGO_USUARIO, NOMBRE, NOMBRE_USUARIO) VALUES ('"+profile.id+"','"+profile.displayName+"','"+profile.displayName+"')";
                                        console.log(insertQuery);
                                        conexion.query(insertQuery, function(error){
                                                if(error){
                                                    return done(error);
                                                }else{
                                                     newUserMysql.id = rows.insertId;
                                                     return done(null, newUserMysql);     
                                                }
                                        });
                                        
                              }
                );
        }
));

app.use(passport.initialize());
app.use(passport.session());


app.get('/logout', function(){
        req.logout();
        res.redirect('/login.html');
});
//ruta para autenticarse con facebook
 app.get('/auth/facebook', passport.authenticate('facebook'));

// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect:'/miOneCode.html', failureRedirect: '/login.html'}));
*/

app.post("/login", function(peticion, respuesta){
        var conexion = mysql.createConnection(credenciales);
        conexion.query("SELECT CODIGO_USUARIO, CODIGO_PLAN, CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CORREO=? AND CONTRASENIA=sha1(?)",
            [peticion.body.correo, peticion.body.contrasenia],
            function(err, data, fields){
                    if (data.length>0){
                        peticion.session.correo = data[0].CORREO;
                        peticion.session.codigoUsuario = data[0].CODIGO_USUARIO;
                        data[0].estatus = 0;
                        console.log(data[0].CORREO);
                        respuesta.send(data[0]); 
                    }else{
                        respuesta.send({estatus:1, mensaje: "Login fallido"}); 
                    }
                        
             }
        ); 
});

app.get("/planes", function(request, response){
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_PLAN, NOMBRE_PLAN FROM tbl_plan`;
        var planes = [];
        conexion.query(sql)
        .on("result", function(resultado){
            planes.push(resultado);
        })
        .on("end",function(){
            response.send(planes);
        });   
});
   
app.post("/insertar-usuario", function(request, response){
        var conexion = mysql.createConnection(credenciales);
        var sql = 'INSERT INTO tbl_usuario(CODIGO_PLAN, NOMBRE, APELLIDO, CORREO, CONTRASENIA, NOMBRE_USUARIO) VALUES (?,?,?,?,sha1(?),?)';
        
        conexion.query(
            sql,
            [request.body.plan, request.body.nombre, request.body.apellido,request.body.correo, request.body.contrasenia, request.body.nombreusuario],
            function(err, result){
                if (err) throw err;
                response.send(result);
            }
        ); 
});

app.get("/salir", function(peticion, respuesta){
        peticion.session.destroy();
        respuesta.send("Sesión cerrada")
});

app.get("/obtener-usuario", verificarAutenticacion, function(request, response){
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_USUARIO, CODIGO_PLAN, NOMBRE,CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CODIGO_USUARIO = ?`;
        var usuarios = [];
        conexion.query(sql, request.session.codigoUsuario)
        .on("result", function(resultado){
            usuarios.push(resultado);
        })
        .on("end",function(){
            response.send(usuarios);
        });   
    });

app.listen(8111, function(){ console.log("Servidor Iniciado");});