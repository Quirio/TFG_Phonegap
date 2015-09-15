function Peticion_Indicadores() {

    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function (data) {

        $("#FooterDentro").hide();
        $("#SelectorDatos").empty();

        for (var i = 0; i < data.length; i++) {
            if($("#Selectcategoria").val() == data[i].categoria) {
                $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
            }
        }

        $("#SelectorDiv").hide();
        $("#SelectIslas").val(null)
        $("#SelectorDatos").selectmenu("refresh");
        $("#SelectIslas").selectmenu("refresh");


        if($("#Selectcategoria").val() == "071") {
            $("#SelectorDiv").show();
            $(".tabs").tabs("option", "active", 0);
            $("#BotonPeticion").button("disable");
            Peticion_Info_Indicadores($("#SelectorDatos").val().split("%")[0], $("#SelectorDatos").val().split("%")[1]);
            $("#BotonRepresentacionGeoTodo").val("Seleccionar Todo");
            $("#BotonRepresentacionTimeTodo").val("Seleccionar Todo");
            $("#BotonRepresentacionGeoTodo").button("refresh");
            $("#BotonRepresentacionTimeTodo").button("refresh");
        }
    });
}