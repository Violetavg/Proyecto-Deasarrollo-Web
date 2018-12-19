function compilar() {
    var codigo = document.getElementById("codigo").contentWindow.document;

    document.body.onkeyup = function () {
        codigo.open();
        codigo.writeln(
            editorhtml.getValue() +
            "<style>" +
            editorcss.getValue() +
            "</style>" +
            "<script>" +
            editorjs.getValue() +
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
                    editorhtml.setValue(respuesta[i].CONTENIDO);
                    $("#tipoHtml").html(respuesta[i].CODIGO_ARCHIVO);
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 2){
                    editorcss.setValue(respuesta[i].CONTENIDO);
                    $("#tipoCss").html(respuesta[i].CODIGO_ARCHIVO);
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 3){
                    editorjs.setValue(respuesta[i].CONTENIDO);
                    $("#tipoJs").html(respuesta[i].CODIGO_ARCHIVO);
                }
            }
        }
    });
});

$("#btnGuardarArchivos").click(function () {
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoHtml").text() + "&contenido=" + editorhtml.getValue(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("html guardado con exito");
            
        }
    });
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoCss").text() + "&contenido=" + editorcss.getValue(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("css guardado con exito");
        }
    });
    $.ajax({
        url: "/guardar-archivo",
        data: "codigoArchivo=" +$("#tipoJs").text() + "&contenido=" + editorjs.getValue(),
        method: "POST",
        dataType: "json",
        success: function (respuesta) {
            console.log("js guardado con exito");
        }
    });
    
});
