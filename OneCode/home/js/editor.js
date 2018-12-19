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
                    if(respuesta[i].CONTENIDO== null){
                        $("#tipoHtml").html(respuesta[i].CODIGO_ARCHIVO);
                    }else{
                        editorhtml.setValue(respuesta[i].CONTENIDO);
                        $("#tipoHtml").html(respuesta[i].CODIGO_ARCHIVO)
                    }
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 2){
                    if(respuesta[i].CONTENIDO== null){
                        $("#tipoCss").html(respuesta[i].CODIGO_ARCHIVO);
                    }else{
                        editorcss.setValue(respuesta[i].CONTENIDO);
                        $("#tipoCss").html(respuesta[i].CODIGO_ARCHIVO);
                    }
                }
                else if (respuesta[i].COD_TIPO_ARCHIVO == 3){
                    if(respuesta[i].CONTENIDO== null){
                        $("#tipoJs").html(respuesta[i].CODIGO_ARCHIVO);
                    }else{
                        editorjs.setValue(respuesta[i].CONTENIDO);
                    $("#tipoJs").html(respuesta[i].CODIGO_ARCHIVO);
                    }
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

$("#crearSnippet").click(function () {
    if ($("#NombreSnippet").val() == "")
        alert("El nuevo snippet debe tener nombre");
    else if ($("#contenidoSnippet").val() == "")
        alert("El contenido no puede ser vacío");
    else if ($("#tipoArchivoSnippet").val() == "-")
        alert("El nuevo snippet debe tener tipo de archivo");
    else {
        var parametros = "nombreSnippet=" + $("#NombreSnippet").val() + "&contenidoSnippet=" + $("#contenidoSnippet").val() + "&tipoArchivoSnippet=" + $("#tipoArchivoSnippet").val();
        $.ajax({
            url: "/crear-snippet",
            data: parametros,
            method: "POST",
            dataType: "json",
            success: function (respuesta) {
                alert("Snippet creado");
                $("#modalCrearSnippet").modal('toggle');
                $("#NombreSnippet").val("");
                $("#contenidoSnippet").val("");
            }
        });
    }
});

$("#buscarSnippet").click(function () {
    if ($("#NombreSnippetBuscar").val() == "")
        alert("Inserte un nombre para buscar snippet");
    else {
        var parametros = "nombreSnippet=" + $("#NombreSnippetBuscar").val();
        $.ajax({
            url: "/buscar-snippet",
            data: parametros,
            method: "POST",
            dataType: "json",
            success: function (respuesta) {
                console.log(respuesta);
                $("#contenidoSnippetEncontrado").html(respuesta.CONTENIDO);
                $("#tipoSnippetEncontrado").html(respuesta.NOMBRE_TIPO_ARCHIVO);
            }
        });
    }
});

$("#descargarHTML").click(function(){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editorhtml.getValue()));
    element.setAttribute('download', "codigo.html");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
});

$("#descargarCSS").click(function(){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editorcss.getValue()));
    element.setAttribute('download', "estilos.css");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
});

$("#descargarJavascript").click(function(){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editorjs.getValue()));
    element.setAttribute('download', "controlador.js");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
});
