var express = require("express"); //Importar el framework express
        var app = express(); //Inicializar la aplicacion con express
        app.use(express.static("public")); //Publicar un directorio de archivos estaticos
        app.listen(8001);//Levantar el servidor y escuchar en el puerto indicado