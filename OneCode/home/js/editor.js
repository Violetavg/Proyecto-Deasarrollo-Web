function compilar(){
    var html = document.getElementById("html");
    var css = document.getElementById("css");
    var js = document.getElementById("javascript");
    var codigo = document.getElementById("codigo").contentWindow.document;

    document.body.onkeyup = function(){
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