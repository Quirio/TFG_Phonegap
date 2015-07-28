function Peticion_Indicadores() {

    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function (data) {

        $("#SelectorDatos").empty();

        for (var i = 0; i < data.length; i++) {

            if($("#Selectcategoria").val() == data[i].categoria) {
                $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
                console.log(data[i].categoria,$("#Selectcategoria").val());
            }
        }

        $("#SelectorDiv").hide();
        $("#SelectIslas").val(null)
        $("#SelectorDatos").selectmenu("refresh");
        $("#SelectIslas").selectmenu("refresh");
    });
}