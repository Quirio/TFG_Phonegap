/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion) {

    $.getJSON( "indicadores.json", function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/';

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
        $.ajax({
            type: "GET",
            url: URL,
            dataType: "jsonp",
            jsonp: "_callback",
            success: function (data) {

                $("#TituloDatos").empty();
                $("#datoslist").empty();

                if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                    var POS0 = 0;
                    var POS1 = 1;
                    var POS2 = 2;
                    var i = 0;
                    var j = 0;
                    var TimeIndex = data.dimension.TIME.representation.size;
                    var GeoIndex = data.dimension.GEOGRAPHICAL.representation.size;
                    var MeasureIndex = data.dimension.MEASURE.representation.size;
                    var ArrayResultados = data.observation;
                    var n = ArrayResultados.length;

                    $("#TituloDatos").append(objPeticion.IndicadorName);

                    for (var index = 0; index < n; index += 3) {

                        if (objPeticion.RepresentacionGeo != null) {
                            if (Geo(index, n, GeoIndex) == 0) {
                                $("#datoslist").append('<li data-role="list-divider">' + objPeticion.RepresentacionGeonom[i] + '</li>');
                                i++;
                                j = 0;
                            }
                        }

                        if (objPeticion.RepresentacionTime != null) {
                            if (Time(index, n, GeoIndex, TimeIndex) == 0) {
                                $("#datoslist").append('<li data-role="list-divider">' + objPeticion.RepresentacionTime[j] + '</li>');
                                j++;
                            }
                        }


                        $("#datoslist").append('<li data-role="list-divider"> Dato Absoluto </li>');
                        $("#datoslist").append('<li>' + ArrayResultados[index + 2] + '</li>');


                    }
                }

                $("#datoslist").listview("refresh");

                //  console.log(Resultados);
                CrearBarChart(data,objPeticion);
            }
        })
    })
    /*

     */
}



function Geo(index,n,GeoIndex) {
    return index % (n / GeoIndex);
}

function Time(index,n,Geoindex,TimeIndex){
    return index % ((n/Geoindex)/TimeIndex);
}




