function Peticion_Info_Indicadores(Indicador,index_Indicador){

    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/Indicadores1.json', function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/' + Indicador + '?api_key=special-key';
        var Indicadores = data;
        console.log(URL);
        $.ajax({
            type: "GET",
            url: URL,
            dataType: "jsonp",
            jsonp: "_callback",
            success: function (data) {

                //Vaciamos Selectores.
                $(".Select").empty();


                //Rellenamos los selectores geográficos.
                for (var i = 0; i < data.dimension.GEOGRAPHICAL.granularity.length; i++) {
                    $("#SelectRepresentacionGeo").append('<optgroup id="' + data.dimension.GEOGRAPHICAL.granularity[i].code + '" label="' + data.dimension.GEOGRAPHICAL.granularity[i].title.es + '"class="SelectOption" ></optgroup>');
                }

                //Rellenamos Selector de representacion geográfica
                for (var i = 0; i < data.dimension.GEOGRAPHICAL.representation.length; i++)
                    if (data.dimension.GEOGRAPHICAL.representation[i].granularityCode == "MUNICIPALITIES")
                        $("#" + data.dimension.GEOGRAPHICAL.representation[i].granularityCode).append('<option value="' + data.dimension.GEOGRAPHICAL.representation[i].code + '%' + data.dimension.GEOGRAPHICAL.representation[i].title.es + '" class="SelectOption" >' + data.dimension.GEOGRAPHICAL.representation[i].title.es + ' </option>');

                $("#SelectRepresentacionGeo").selectmenu('refresh');

                //Rellenamos selectores temporales.
                for (var i = 0; i < data.dimension.TIME.granularity.length; i++) {
                    $("#SelectRepresentacionTime").append('<optgroup id="' + data.dimension.TIME.granularity[i].code + '" label="' + data.dimension.TIME.granularity[i].title.es + '"class="SelectOption" ></optgroup>');
                }

                //Rellenamos Selector de representacion temporal
                for (var i = 0; i < data.dimension.TIME.representation.length; i++) {
                    if(Indicadores[index_Indicador].time == "ANUAL")
                        $("#YEARLY").append('<option value=' + data.dimension.TIME.representation[i].code + ' class="SelectOption" >' + data.dimension.TIME.representation[i].title.es + ' </option>');
                    else  if(Indicadores[index_Indicador].time == "MENSUAL")
                        $("#MONTHLY").append('<option value=' + data.dimension.TIME.representation[i].code + ' class="SelectOption" >' + data.dimension.TIME.representation[i].title.es + ' </option>');


                }

                $("#SelectRepresentacionTime").selectmenu('refresh');

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("You can not send Cross Domain AJAX requests ");
            }

        })
    })

    $("#SelectorDiv").show();
}