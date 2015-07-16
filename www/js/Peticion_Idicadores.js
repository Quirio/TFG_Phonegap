function Peticion_Indicadores(){

   $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function( data ) {
         for(var i=0; i<data.length; i++) {
            $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
        }
   });
/*
    $.ajax({
        type: "GET",
        url: 'http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json',
        dataType: "jsonp",
        //jsonp: "_callback",
        success: function (data) {
            alert("Entro");
            for(var i=0; i<data.length; i++) {
                $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
            }
        },

        error: function (jqXHR, textStatus, errorThrown) {
            alert("CAGO EN DIOS.");
        }
    }); */
}