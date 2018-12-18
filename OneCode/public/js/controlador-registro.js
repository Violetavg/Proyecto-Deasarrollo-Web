$(document).ready(function(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/planes",
		dataType:"json",
		success:function(respuesta){
			for(var i=0; i<respuesta.length; i++){
				
				$("#selectPlanes").append('<option value="'+respuesta[i].CODIGO_PLAN+'">'+respuesta[i].NOMBRE_PLAN+'</option>');
			}
		}
	});

});

$("#btn-insertar").click(function(){
	//alert("Enviar mensaje: " + $("#txta-mensaje").val());
	var parametros = "plan="+$("#selectPlanes").val() +"&" +
					 "nombre="+$("#nombre").val() + "&"+
					 "apellido="+$("#apellido").val() + "&"+
                     "correo="+$("#correo").val() + "&"+
                     "contrasenia="+$("#contrasenia").val()+ "&"+
                     "nombreusuario="+$("#username").val();
	$.ajax({
		url:"/insertar-usuario",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
            window.location.href ="login.html";
			console.log(respuesta);
		}
	});
});