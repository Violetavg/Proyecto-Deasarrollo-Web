/*$("#logout").click(function(){
    $.ajax({
        url: "/logout",
        success:function(respuesta){
            console.log("hola");
		}
    });
});
*/

$("#salir").click(function(){
	$.ajax({
		url:"/salir",
		success:function(respuesta){
			window.location.href ="/login.html";
		}
	});
});

$("#btnCrearCarpeta").click(function () {
	if ($("#nombreCarpeta").val() == "")
        alert("La carpeta debe tener nombre");
	else {
		var parametros = "carpetaContenedora=" + $("#carpetaContenedora").val() + "&nombreCarpeta=" + $("#nombreCarpeta").val();
		$.ajax({
			url: "/crear-carpeta",
			data: parametros,
			method: "POST",
			dataType: "json",
			success: function (respuesta) {
				alert("Carpeta creada");
			}
		});
	}
});

function cargarCarpetas(carpeta){
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
						<a href="#" onclick="abrirCarpeta()">
						  <h6>${respuesta[i].NOMBRE_CARPETA}</h6>
						</a>
					  </div>
		
					  <img src="img/glyphicons-145-folder-open.png" alt="" class="mr-2 rounded">
					</div>
				  </div>`
                );
            }
        }
    });
}

function abrirCarpeta(){
	alert("Ha abierto la carpeta")
}

$("#btnCompartir").click(function () {
    if ($("#selectProyectos").val() == "")
        alert("Debe selecionar un proyecto");
    else if ($("#selectContactos").val() == "")
            alert("Debe selecionar con quien compartir");
	else {
        console.log($("#selectContactos").val());
        var arreglo = $("#selectContactos").val();
        for (var i = 0; i < arreglo.length; i++){
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
        success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				
				$("#selectContactos").append('<option value="'+respuesta[i].CODIGO_USUARIO+'">'+respuesta[i].NOMBRE_USUARIO+'</option>');
			}
		}
    });

    $.ajax({
        url: "/select-proyectos",
        dataType: "json",
        success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				
				$("#selectProyectos").append('<option value="'+respuesta[i].CODIGO_PROYECTO+'">'+respuesta[i].NOMBRE_PROYECTO+'</option>');
			}
		}
    });

});