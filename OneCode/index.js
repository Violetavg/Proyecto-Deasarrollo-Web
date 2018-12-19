var express = require("express");
var session = require("express-session");
var mysql = require("mysql");
//var passport = require("passport");
//var FacebookStrategy = require("passport-facebook").Strategy;
//var config = require("./configuracionApiKeys");
var bodyParser = require("body-parser");
var app = express();
var credenciales = {
        host: "localhost",
        user: "root",
        password: "",
        port: "3306",
        database: "one_code"
};

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: "ASDFSDF$%%aasdera", resave: true, saveUninitialized: true }));

var home = express.static("home");
app.use(
        function (peticion, respuesta, next) {
                if (peticion.session.correo) {
                        home(peticion, respuesta, next);
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

app.post("/login", function (peticion, respuesta) {
        var conexion = mysql.createConnection(credenciales);
        conexion.query("SELECT CODIGO_USUARIO, CODIGO_PLAN, CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CORREO=? AND CONTRASENIA=sha1(?)",
                [peticion.body.correo, peticion.body.contrasenia],
                function (err, data, fields) {
                        if (data.length > 0) {
                                peticion.session.correo = data[0].CORREO;
                                peticion.session.codigoUsuario = data[0].CODIGO_USUARIO;
                                data[0].estatus = 0;
                                console.log(data[0].CORREO);
                                respuesta.send(data[0]);
                        } else {
                                respuesta.send({ estatus: 1, mensaje: "Login fallido" });
                        }

                }
        );
});

app.get("/planes", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_PLAN, NOMBRE_PLAN FROM tbl_plan`;
        var planes = [];
        conexion.query(sql)
                .on("result", function (resultado) {
                        planes.push(resultado);
                })
                .on("end", function () {
                        response.send(planes);
                });
});

app.post("/insertar-usuario", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = 'INSERT INTO tbl_usuario(CODIGO_PLAN, NOMBRE, APELLIDO, CORREO, CONTRASENIA, NOMBRE_USUARIO) VALUES (?,?,?,?,sha1(?),?)';

        conexion.query(
                sql,
                [request.body.plan, request.body.nombre, request.body.apellido, request.body.correo, request.body.contrasenia, request.body.nombreusuario],
                function (err, result) {
                        if (err) throw err;
                        response.send(result);
                }
        );
});

app.get("/salir", function (peticion, respuesta) {
        peticion.session.destroy();
        respuesta.send("Sesión cerrada")
});

app.get("/obtener-usuario", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_USUARIO, CODIGO_PLAN, NOMBRE,CORREO, NOMBRE_USUARIO FROM tbl_usuario WHERE CODIGO_USUARIO = ?`;
        var usuarios = [];
        conexion.query(sql, request.session.codigoUsuario)
                .on("result", function (resultado) {
                        usuarios.push(resultado);
                })
                .on("end", function () {
                        response.send(usuarios);
                });
});

app.post("/crear-carpeta", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var filtros = [];
        if (request.body.carpetaContenedora == 0) {
                var sql = `INSERT INTO TBL_CARPETA(CODIGO_USUARIO_DUENIO, FECHA_CREACION, NOMBRE_CARPETA) VALUES (?,NOW(),?)`;
                filtros = [request.session.codigoUsuario, request.body.nombreCarpeta]
        } else {
                var sql = `INSERT INTO TBL_CARPETA(CODIGO_CARPETA_CONTENEDORA, CODIGO_USUARIO_DUENIO, FECHA_CREACION, NOMBRE_CARPETA) VALUES (?,?,NOW(),?)`;
                filtros = [request.body.carpetaContenedora, request.session.codigoUsuario, request.body.nombreCarpeta]
        }

        conexion.query(
                sql,
                filtros,
                function (err, result) {
                        if (err) throw err;
                        response.send(result);
                }
        );
});

app.post("/crear-proyecto", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var filtros = [];
        var idProyecto = 0;
        if (request.body.carpetaContenedora == 0) {
                var sql = `INSERT INTO TBL_PROYECTO(CODIGO_USUARIO_AUTOR, FECHA_CREACION, NOMBRE_PROYECTO, DESCRIPCION) VALUES (?,NOW(),?,?)`;
                filtros = [request.session.codigoUsuario, request.body.nombreProyecto, request.body.descripcionProyecto]
        } else {
                var sql = `INSERT INTO TBL_PROYECTO(CODIGO_CARPETA, CODIGO_USUARIO_AUTOR, FECHA_CREACION, NOMBRE_PROYECTO, DESCRIPCION) VALUES (?,?,NOW(),?,?)`;
                filtros = [request.body.carpetaContenedora, request.session.codigoUsuario, request.body.nombreProyecto, request.body.descripcionProyecto]
        }

        conexion.query(
                sql,
                filtros,
                function (err, result) {
                        if (err) throw err;
                        idProyecto = result.insertId;
                        response.send(result);
                        conexion.query(
                                `INSERT INTO tbl_archivos(COD_TIPO_ARCHIVO, CODIGO_PROYECTO, FECHA_ULTIMA_EDICION) VALUES (1,?,NOW())`,
                                [idProyecto],
                                function (err, result) {
                                        if (err) throw err;
                                }
                        );
                        conexion.query(
                                `INSERT INTO tbl_archivos(COD_TIPO_ARCHIVO, CODIGO_PROYECTO, FECHA_ULTIMA_EDICION) VALUES (2,?,NOW())`,
                                [idProyecto],
                                function (err, result) {
                                        if (err) throw err;
                                }
                        );
                        conexion.query(
                                `INSERT INTO tbl_archivos(COD_TIPO_ARCHIVO, CODIGO_PROYECTO, FECHA_ULTIMA_EDICION) VALUES (3,?,NOW())`,
                                [idProyecto],
                                function (err, result) {
                                        if (err) throw err;
                                }
                        );
                }
        );
});

app.get("/cargar-carpetas", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var filtros = [];
        if (request.query.carpetaContenedora == 0) {
                var sql = `SELECT CODIGO_CARPETA, NOMBRE_CARPETA FROM TBL_CARPETA WHERE (CODIGO_USUARIO_DUENIO = ?) AND (CODIGO_CARPETA_CONTENEDORA IS NULL)`;
                filtros = [request.session.codigoUsuario];
        } else {
                var sql = `SELECT CODIGO_CARPETA, NOMBRE_CARPETA FROM TBL_CARPETA WHERE (CODIGO_USUARIO_DUENIO = ?) AND (CODIGO_CARPETA_CONTENEDORA = ?)`;
                filtros = [request.session.codigoUsuario, request.query.carpetaContenedora];
        }
        var carpetas = [];
        conexion.query(sql, filtros)
                .on("result", function (resultado) {
                        carpetas.push(resultado);
                })
                .on("end", function () {
                        response.send(carpetas);
                });
});

app.get("/cargar-proyectos", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var filtros = [];
        if (request.query.carpetaContenedora == 0) {
                var sql = `SELECT CODIGO_PROYECTO, NOMBRE_PROYECTO FROM TBL_PROYECTO WHERE (CODIGO_USUARIO_AUTOR = ?) AND (CODIGO_CARPETA IS NULL)`;
                filtros = [request.session.codigoUsuario];
        } else {
                var sql = `SELECT CODIGO_PROYECTO, NOMBRE_PROYECTO FROM TBL_PROYECTO WHERE (CODIGO_USUARIO_AUTOR = ?) AND (CODIGO_CARPETA = ?)`;
                filtros = [request.session.codigoUsuario, request.query.carpetaContenedora];
        }
        var carpetas = [];
        conexion.query(sql, filtros)
                .on("result", function (resultado) {
                        carpetas.push(resultado);
                })
                .on("end", function () {
                        response.send(carpetas);
                });
});

app.get("/select-proyectos", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_PROYECTO, NOMBRE_PROYECTO FROM TBL_PROYECTO WHERE CODIGO_USUARIO_AUTOR = ?`;
        var proyectos = [];
        conexion.query(sql, [request.session.codigoUsuario])
                .on("result", function (resultado) {
                        proyectos.push(resultado);
                })
                .on("end", function () {
                        response.send(proyectos);
                });
});

app.get("/select-contactos", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_USUARIO, NOMBRE_USUARIO
        FROM TBL_USUARIO A 
        WHERE (A.CODIGO_USUARIO IN(
            SELECT CODIGO_USUARIO_CONTACTO FROM TBL_CONTACTOS WHERE CODIGO_USUARIO = ?)) AND (CODIGO_USUARIO != ?)`;
        var contactos = [];
        conexion.query(sql, [request.session.codigoUsuario, request.session.codigoUsuario])
                .on("result", function (resultado) {
                        contactos.push(resultado);
                })
                .on("end", function () {
                        response.send(contactos);
                });
});

app.get("/select-usuarios", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_USUARIO, NOMBRE_USUARIO
        FROM TBL_USUARIO A 
        WHERE (A.CODIGO_USUARIO NOT IN(
            SELECT CODIGO_USUARIO_CONTACTO FROM TBL_CONTACTOS WHERE CODIGO_USUARIO = ?)) AND (CODIGO_USUARIO != ?)`;
        var usuarios = [];
        conexion.query(sql, [request.session.codigoUsuario, request.session.codigoUsuario])
                .on("result", function (resultado) {
                        usuarios.push(resultado);
                })
                .on("end", function () {
                        response.send(usuarios);
                });
});

app.post("/compartir-proyecto", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = 'INSERT INTO tbl_grupos_de_trabajo (CODIGO_PROYECTO, CODIGO_USUARIO_MIEMBRO, FECHA_COMPARTIDO) VALUES (?, ?, NOW())';

        conexion.query(
                sql,
                [request.body.proyecto, request.body.usuarioMiembro],
                function (err, result) {
                        if (err) throw err;
                        response.send(result);
                }
        );
});

app.get("/cargar-proyectosCompartidasConmigo", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT NOMBRE_PROYECTO FROM tbl_proyecto A 
        INNER JOIN tbl_grupos_de_trabajo B
        ON A.CODIGO_PROYECTO = B.CODIGO_PROYECTO
        WHERE B.CODIGO_USUARIO_MIEMBRO = ? 
        GROUP BY A.CODIGO_PROYECTO`;
        var carpetasCompartidas = [];
        conexion.query(sql, [request.session.codigoUsuario])
                .on("result", function (resultado) {
                        carpetasCompartidas.push(resultado);
                })
                .on("end", function () {
                        response.send(carpetasCompartidas);
                });
});

app.post("/abrir-proyecto", verificarAutenticacion, function(request, response){
        request.session.codigoProyecto = request.body.proyectoId
        response.send({mensaje:"idPoryecto guardado"});
});

app.get("/cargarInformacionProyecto", function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT CODIGO_ARCHIVO, COD_TIPO_ARCHIVO, CONTENIDO FROM TBL_ARCHIVOS WHERE CODIGO_PROYECTO = ?`;
        var archivos = [];
        conexion.query(sql, [request.session.codigoProyecto])
                .on("result", function (resultado) {
                        archivos.push(resultado);
                })
                .on("end", function () {
                        response.send(archivos);
                });
});

app.post("/guardar-archivo", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `UPDATE TBL_ARCHIVOS SET CONTENIDO = ? , FECHA_ULTIMA_EDICION = NOW() WHERE CODIGO_ARCHIVO = ?`
        conexion.query(
                sql,
                [request.body.contenido, request.body.codigoArchivo],
                function (err, result) {
                        if (err) throw err;
                        response.send({mensaje:"guardado"});
                }
        );
        
});

app.post("/crear-snippet", verificarAutenticacion, function (request, response) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `INSERT INTO TBL_SNIPPETS(CODIGO_TIPO_ARCHIVO, NOMBRE_SNIPPET, CONTENIDO) VALUES (?,?,?)`;
        var filtros = [request.body.tipoArchivoSnippet, request.body.nombreSnippet, request.body.contenidoSnippet]

        conexion.query(
                sql,
                filtros,
                function (err, result) {
                        if (err) throw err;
                        response.send(result);
                }
        );
})

app.post("/buscar-snippet", function (peticion, respuesta) {
        var conexion = mysql.createConnection(credenciales);
        var sql = `SELECT A.CODIGO_TIPO_ARCHIVO, A.CONTENIDO, A.NOMBRE_SNIPPET, B.NOMBRE_TIPO_ARCHIVO
        FROM tbl_snippets A
        INNER JOIN tbl_tipo_archivo B ON A.CODIGO_TIPO_ARCHIVO = B.CODIGO_TIPO_ARCHIVO 
        WHERE LOWER(NOMBRE_SNIPPET) LIKE LOWER(?)`;
        var filtros = [peticion.body.nombreSnippet]

        conexion.query(
                sql,
                filtros,
                function (err, data, fields) {
                        if (data.length > 0) {
                                data[0].estatus = 0;
                                respuesta.send(data[0]);
                        } else {
                                respuesta.send({ estatus: 1, mensaje: "Snippet no encontrado" });
                        }
                }
        );
});


app.listen(8111, function () { console.log("Servidor Iniciado"); });