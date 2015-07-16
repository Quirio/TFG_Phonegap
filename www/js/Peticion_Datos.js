/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion) {

    $.getJSON( 'http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/';

        //añadimos indicador.
        URL += objPeticion.Indicador + '/data?';
        //añadimos Representacion (si la hubiese)
        if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
            URL += URLRepresentacion(objPeticion);
        }
        URL += '&';
        var Gtime;
        if(data[objPeticion.IndicadorNum].time == "MENSUAL")
            Gtime = "MONTHLY";
        else
            Gtime = "YEARLY";
        URL += 'granularity==GEOGRAPHICAL%5BMUNICIPALITIES%5D%3ATIME%5B' + Gtime + '%5D';

        // URL += 'granularity==GEOGRAPHICAL%5B' + ;

        URL += '&api_key=special-key';
        console.log(URL);
        $.ajax({
            type: "GET",
            url: URL,
            dataType: "jsonp",
            jsonp: "_callback",
            success: function (data) {

                $("#TituloDatos").empty();
                $("#titulograficas").empty();

                if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                    var POS0 = 0;
                    var POS1 = 1;
                    var POS2 = 2;
                    var i = 0;
                    var j = 0;
                    var TimeIndex = data.dimension.TIME.representation.size;
                    var GeoIndex = data.dimension.GEOGRAPHICAL.representation.size;
                    var MeasureIndex = data.dimension.MEASURE.representation.size;
                    var ArrayORdenGEO = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);
                    var ArrayResultados = data.observation;
                    var n = ArrayResultados.length;

                    $("#TituloDatos").append($("#SelectorDatos-button span").text());
                    $("#titulograficas").append($("#SelectorDatos-button span").text());
                    $("#TablaDatos").empty();

                    $("#TablaDatos").append('<thead><tr id="Titulo"></tr></thead><tbody id="Cuerpo"></tbody>');

                    $("#Titulo").append('<th></th>');
                    for(var i=0; i<objPeticion.RepresentacionTime.length;i++){
                        $("#Titulo").append('<th>' + objPeticion.RepresentacionTime[i] + '</th>');
                    }

                    var z=0;
                    console.log(ArrayORdenGEO);
                    console.log(objPeticion.RepresentacionTime);

                    for(var i=0; i<objPeticion.RepresentacionGeo.length; i++){
                        var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                        $("#Cuerpo").append('<tr id="'+objPeticion.RepresentacionGeo[index]+'"><th id="TituloVertical">'+ objPeticion.RepresentacionGeonom[index] +'</th></tr>');
                        for(var j=0; j<objPeticion.RepresentacionTime.length; j++){
                            $("#"+objPeticion.RepresentacionGeo[index]).append('<th>'+ ArrayResultados[z] +'</th>');
                            z = z+3;
                        }
                    }

                    $( "#TablaDatos" ).table( "refresh" );

                }

                CrearBarChart(data,objPeticion,ArrayORdenGEO);
            }
        })
    })
}



function Geo(index,n,GeoIndex) {
    return index % (n / GeoIndex);
}

function Time(index,n,Geoindex,TimeIndex){
    return index % ((n/Geoindex)/TimeIndex);
}




