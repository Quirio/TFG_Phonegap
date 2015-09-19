function Peticion_Info_Indicadores(Indicador,index_Indicador){

    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/' + Indicador + '?api_key=special-key';
        var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];
        var IslasSeleccionadas = $("#SelectIslas").val();
        var Indicadores = data;

        if(Indicadores[index_Indicador].time == "YEARLY")
            $("#TemporalLabel").text("Años");
        else
            $("#TemporalLabel").text("Meses");

        if(Indicadores[index_Indicador].geo == "MUNICIPAL")
            $("#GeoLabel").text("Municipios");
        else
            $("#GeoLabel").text("Islas");

        $.ajax({
            type: "GET",
            url: URL,
            dataType: "jsonp",
            jsonp: "_callback",
            success: function (data) {
                $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/RelacionMunicipiosIslas.json', function( Relacion ) {

                        //Vaciamos Selectores.
                        $(".Select").empty();

                        //Rellenamos los selectores geográficos.
                        if(Indicador != "ENERGIA_ELECTRICA_DISPONIBLE") {
                            for (var i = 0; i < IslasSeleccionadas.length; i++) {
                                $("#SelectRepresentacionGeo").append('<optgroup id="' + Islas[IslasSeleccionadas[i]].replace(" ", "") + '" label="' + Islas[IslasSeleccionadas[i]] + '"class="SelectOption" data-icon=" carat-r" ></optgroup>');
                                IslasSeleccionadas[i] = Islas[IslasSeleccionadas[i]];
                            }
                        }


                        //Rellenamos Selector de representacion geográfica

                        if(Indicador == "ENERGIA_ELECTRICA_DISPONIBLE") {
                            for (var i = 0; i < data.dimension.GEOGRAPHICAL.representation.length; i++) {
                                if (data.dimension.GEOGRAPHICAL.representation[i].granularityCode == "ISLANDS"){
                                    $("#SelectRepresentacionGeo").append('<option value="' + data.dimension.GEOGRAPHICAL.representation[i].code + '%' + data.dimension.GEOGRAPHICAL.representation[i].title.es + '" class="SelectOption" >' + data.dimension.GEOGRAPHICAL.representation[i].title.es + ' </option>');
                                }

                            }
                        }
                        else {
                            for (var i = 0; i < data.dimension.GEOGRAPHICAL.representation.length; i++) {
                                if (data.dimension.GEOGRAPHICAL.representation[i].granularityCode == "MUNICIPALITIES" && IslasSeleccionadas.indexOf(Relacion[data.dimension.GEOGRAPHICAL.representation[i].code].island) != -1) {
                                    var NombreComarca = Relacion[data.dimension.GEOGRAPHICAL.representation[i].code].comarca;
                                    if (NombreComarca != ".") {
                                        NombreComarca = Relacion[data.dimension.GEOGRAPHICAL.representation[i].code].comarca.split('%')[1];
                                        var NombreComarcaid = NombreComarca.replace(/ /g, "");
                                        if ($("#" + NombreComarcaid).length == 0)
                                            $("#" + Relacion[data.dimension.GEOGRAPHICAL.representation[i].code].island.replace(" ", "")).append('<optgroup id="' + NombreComarcaid + '" label="' + NombreComarca + '"class="SelectOption" data-icon=" carat-r" ></optgroup>');
                                        $("#" + NombreComarcaid).append('<option value="' + data.dimension.GEOGRAPHICAL.representation[i].code + '%' + data.dimension.GEOGRAPHICAL.representation[i].title.es + '" class="SelectOption" >' + data.dimension.GEOGRAPHICAL.representation[i].title.es + ' </option>');


                                    }
                                    else
                                        $("#" + Relacion[data.dimension.GEOGRAPHICAL.representation[i].code].island.replace(" ", "")).append('<option value="' + data.dimension.GEOGRAPHICAL.representation[i].code + '%' + data.dimension.GEOGRAPHICAL.representation[i].title.es + '" class="SelectOption" >' + data.dimension.GEOGRAPHICAL.representation[i].title.es + ' </option>');

                                }
                            }
                        }

                            $("#SelectRepresentacionGeo").selectmenu('refresh');

                            //Rellenamos selectores temporales.
                            for (var i = 0; i < data.dimension.TIME.granularity.length; i++) {
                                $("#SelectRepresentacionTime").append('<optgroup id="' + data.dimension.TIME.granularity[i].code + '" label="' + data.dimension.TIME.granularity[i].title.es + '"class="SelectOption" ></optgroup>');
                            }

                            //Rellenamos Selector de representacion temporal
                            for (var i = 0; i < data.dimension.TIME.representation.length; i++) {
                                if (data.dimension.TIME.representation[i].granularityCode == Indicadores[index_Indicador].time)
                                    $("#YEARLY").append('<option value=' + data.dimension.TIME.representation[i].code + ' class="SelectOption" >' + data.dimension.TIME.representation[i].title.es + ' </option>');
                                else if (data.dimension.TIME.representation[i].granularityCode == Indicadores[index_Indicador].time)
                                    $("#MONTHLY").append('<option value=' + data.dimension.TIME.representation[i].code + ' class="SelectOption" >' + data.dimension.TIME.representation[i].title.es + ' </option>');


                            $("#SelectRepresentacionTime").selectmenu('refresh');
                        }
                        });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    alert("Imposible Conectar con el servidor. ");
                }

            })
    })

    $("#SelectorDiv").show();
}