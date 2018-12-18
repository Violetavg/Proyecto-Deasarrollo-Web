$("#logout").click(function(){
    $.ajax({
        url: "/logout",
        success:function(respuesta){
            console.log("hola");
		}
    });
});