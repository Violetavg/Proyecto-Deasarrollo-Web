function compilar() {
    var html = document.getElementById("html");
    var css = document.getElementById("css");
    var js = document.getElementById("javascript");
    var codigo = document.getElementById("codigo").contentWindow.document;

    document.body.onkeyup = function () {
        codigo.open();
        codigo.writeln(
            html.value +
            "<style>" +
            css.value +
            "</style>" +
            "<script>" +
            js.value +
            "</script>"
        );
        codigo.close();
    };

}

compilar();

$(document).ready(function () {
    $.ajax({
        url: "/cargarInformacionProyecto",
        dataType: "json",
        success: function (respuesta) {
            console.log(respuesta);
            for (var i = 0; i < respuesta.length; i++) {
                if (respuesta[i].COD_TIPO_ARCHIVO == 1){
                    $("#html").html(respuesta[i].CONTENIDO);
                    $("#tipoHtml").html(respuesta[i].CODIGO_ARCHIVO);
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 2){
                    $("#css").html(respuesta[i].CONTENIDO);
                    $("#tipoCss").html(respuesta[i].CODIGO_ARCHIVO);
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 3){
                    $("#javascript").html(respuesta[i].CONTENIDO);
                    $("#tipoJs").html(respuesta[i].CODIGO_ARCHIVO);
                }
            }
        }
    });
});

$("#btnGuardarArchivos").click(function () {
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoHtml").text() + "&contenido=" + $("#html").val(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("html guardado con exito");
            
        }
    });
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoCss").text() + "&contenido=" + $("#css").val(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("css guardado con exito");
        }
    });
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoJs").text() + "&contenido=" + $("#javascript").val(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("js guardado con exito");
        }
    });
    
});
