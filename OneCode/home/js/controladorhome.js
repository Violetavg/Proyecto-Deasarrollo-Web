/*$("#logout").click(function(){
    $.ajax({
        url: "/logout",
        success:function(respuesta){
            console.log("hola");
		}
    });
});
*/

$("#salir").click(function () {
    $.ajax({
        url: "/salir",
        success: function (respuesta) {
            window.location.href = "/login.html";
        }
    });
});

$("#btnCrearCarpeta").click(function () {
    if ($("#nombreCarpeta").val() == "")
        alert("La carpeta debe tener nombre");
    else {
        var parametros = "carpetaContenedora=" + $("#codigoCarpeta").text() + "&nombreCarpeta=" + $("#nombreCarpeta").val();
        $.ajax({
            url: "/crear-carpeta",
            data: parametros,
            method: "POST",
            dataType: "json",
            success: function (respuesta) {
                alert("Carpeta creada");
                $("#modalCrearCarpeta").modal('toggle');
                cargarCarpetas($("#codigoCarpeta").text());
                $("#nombreCarpeta").val("");
            }
        });
    }
});

$("#btnCrearProyecto").click(function () {
    if ($("#NombreProyecto").val() == "")
        alert("El nuevo proyecto debe tener nombre");
    else {
        var parametros = "nombreProyecto=" + $("#NombreProyecto").val() + "&descripcionProyecto=" + $("#descripcionProyecto").val() + "&carpetaContenedora=" + $("#codigoCarpeta").text();
        $.ajax({
            url: "/crear-proyecto",
            data: parametros,
            method: "POST",
            dataType: "json",
            success: function (respuesta) {
                alert("Proyecto creado");
                $("#modalCrearProyecto").modal('toggle');
                cargarProyectos($("#codigoCarpeta").text());
                $("#NombreProyecto").val("")
                $("#descripcionProyecto").val("")
            }
        });
    }
});

function cargarCarpetas(carpeta) {
    var parametros = "carpetaContenedora=" + carpeta
    $.ajax({
        url: "/cargar-carpetas",
        method: "GET",
        data: parametros,
        dataType: "json",
        success: function (respuesta) {
            console.log(respuesta);
            console.log("Hubo respuesta");
            $("#contenido").html("");  //limpia el contenido de carpetas
            for (var i = 0; i < respuesta.length; i++) {
                $("#contenido").append( //luego de aqui aplicar los estilos, poner nombre de carpeta, etc.
                    `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-12">
					<div class="estilosvideos">
					  <div class=" dimensiones">
						<a href="#" onclick="abrirCarpeta('${respuesta[i].NOMBRE_CARPETA}', ${respuesta[i].CODIGO_CARPETA});">
						  <h6>${respuesta[i].NOMBRE_CARPETA}</h6>
						</a>
					  </div>
		
					  <img src="img/glyphicons-145-folder-open.png" alt="" class="mr-2 rounded">
					</div>
				  </div>`
                );
            }
            cargarProyectos(carpeta);
        }
    });
}

function cargarProyectos(carpeta) {
    var parametros = "carpetaContenedora=" + carpeta
    $.ajax({
        url: "/cargar-proyectos",
        method: "GET",
        data: parametros,
        dataType: "json",
        success: function (respuesta) {
            console.log(respuesta);
            console.log("Hubo respuesta");
            $("#contenedorProyectos").html("");  //limpia el contenido de carpetas
            for (var i = 0; i < respuesta.length; i++) {
                $("#contenedorProyectos").append( //luego de aqui aplicar los estilos, poner nombre de carpeta, etc.
                    `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-12">
					<div class="estilosvideos">
					  <div class=" dimensiones">
						<a href="#" onclick="abrirProyecto(${respuesta[i].CODIGO_PROYECTO});">
						  <h6>${respuesta[i].NOMBRE_PROYECTO}</h6>
						</a>
					  </div>
		
					  <img src="" alt="" class="mr-2 rounded">
					</div>
				  </div>`
                );
            }
        }
    });
}
function abrirProyecto(codigo) {
    $.ajax({
        url: "/abrir-proyecto",
        data: "proyectoId="+ codigo,
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            window.location.href = "editor.html";
        }
    });

}

function abrirCarpeta(nombre, codigo) {
    $("#contenedorProyectos").html("");
    console.log("Ha abierto la carpeta");
    $("#encabezado").html(nombre);
    cargarCarpetas(codigo);
    $("#codigoCarpeta").html(codigo);
}

$("#btnCompartir").click(function () {
    if ($("#selectProyectos").val() == "")
        alert("Debe selecionar un proyecto");
    else if ($("#selectContactos").val() == "")
        alert("Debe selecionar con quien compartir");
    else {
        console.log($("#selectContactos").val());
        var arreglo = $("#selectContactos").val();
        for (var i = 0; i < arreglo.length; i++) {
            var parametros = "proyecto=" + $("#selectProyectos").val() + "&usuarioMiembro=" + arreglo[i];
            $.ajax({
                url: "/compartir-proyecto",
                data: parametros,
                method: "POST",
                dataType: "json",
                success: function (respuesta) {
                    alert("El proyecto ha sido compartido");
                }
            });
        }

    }
});
$(document).ready(function () {
    cargarCarpetas(0);

    $.ajax({
        url: "/select-contactos",
        dataType: "json",
        success: function (respuesta) {
            for (var i = 0; i < respuesta.length; i++) {

                $("#selectContactos").append('<option value="' + respuesta[i].CODIGO_USUARIO + '">' + respuesta[i].NOMBRE_USUARIO + '</option>');
            }
        }
    });

    $.ajax({
        url: "/select-proyectos",
        dataType: "json",
        success: function (respuesta) {
            for (var i = 0; i < respuesta.length; i++) {

                $("#selectProyectos").append('<option value="' + respuesta[i].CODIGO_PROYECTO + '">' + respuesta[i].NOMBRE_PROYECTO + '</option>');
            }
        }
    });

});