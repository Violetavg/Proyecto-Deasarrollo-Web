var express = require("express");
var session = require("express-session");
var mysql = require("mysql");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var config = require("./configuracionApiKeys");
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



//configuracion de passport
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

app.listen(8111, function(){ console.log("Servidor Iniciado");});