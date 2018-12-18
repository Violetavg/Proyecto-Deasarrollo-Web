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