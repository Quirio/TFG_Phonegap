function Peticion_Indicadores() {

    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
        }
    });
}