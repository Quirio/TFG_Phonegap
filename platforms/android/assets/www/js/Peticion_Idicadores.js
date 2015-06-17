function Peticion_Indicadores(){
    var path = window.location.href.replace('index.html', '');
    alert(path + 'res/indicadores.json');
   $.getJSON( path + 'res/indicadores.json', function( data ) {
         for(var i=0; i<data.length; i++) {
            $("#SelectorDatos").append('<option value=' + data[i].Indicador + '%' + i + '>' + data[i].titulo + '</option>');
        }

    });


}