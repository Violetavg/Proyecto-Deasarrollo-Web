$("#salir").click(function () {
    $.ajax({
        url: "/salir",
        success: function (respuesta) {
            window.location.href = "/login.html";
        }
    });
});