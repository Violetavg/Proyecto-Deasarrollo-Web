function cargarCompartidoConmigo(){
	$.ajax({
        url: "/cargar-carpetasCompartidasConmigo",
        method: "GET",
        dataType: "json",
        success: function (respuesta) {
			console.log(respuesta);
			console.log("Hubo respuesta");
            $("#contenidoCompartido").html("");  //limpia el contenido de carpetas
            for (var i = 0; i < respuesta.length; i++) {
                $("#contenidoCompartido").append( //luego de aqui aplicar los estilos, poner nombre de carpeta, etc.
                    `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-12">
					<div class="estilosvideos">
					  <div class=" dimensiones">
						<a href="editor.html" >
						  <h6>${respuesta[i].NOMBRE_PROYECTO}</h6>
						</a>
					  </div>
					</div>
				  </div>`
                );
            }
        }
    });
}


$(document).ready(function () {
    cargarCompartidoConmigo();

});