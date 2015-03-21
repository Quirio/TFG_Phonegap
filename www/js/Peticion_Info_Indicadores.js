function Peticion_Info_Indicadores(Indicador){

    var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/' + Indicador + '?api_key=special-key';

    //Vaciamos Selectores.
    $(".Select").empty();

    $.ajax({
        type: "GET",
        url: URL,
        dataType: "jsonp",
        jsonp: "_callback",
        success: function(data){

            //Añadimos opcion base de granularidad geográfica.

            $("#SelectorGranularidadGeo").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Añadimos opcion base de representación geográfica.

            $("#SelectRepresentacionGeo").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Rellenamos los selectores geográficos.
            for(var i=0; i<data.dimension.GEOGRAPHICAL.granularity.length; i++){
                $("#SelectorGranularidadGeo").append('<option value=' + data.dimension.GEOGRAPHICAL.granularity[i].code + 'class="SelectOption" >' + data.dimension.GEOGRAPHICAL.granularity[i].title.es +'</option>');
                $("#SelectRepresentacionGeo").append('<optgroup id="'+data.dimension.GEOGRAPHICAL.granularity[i].code+'" label="' +data.dimension.GEOGRAPHICAL.granularity[i].title.es+ '"class="SelectOption" ></optgroup>');
            }

            //Rellenamos Selector de representacion geográfica
            for(var i=0; i<data.dimension.GEOGRAPHICAL.representation.length; i++)
                $("#" + data.dimension.GEOGRAPHICAL.representation[i].granularityCode).append('<option value="' + data.dimension.GEOGRAPHICAL.representation[i].code +"%"+ data.dimension.GEOGRAPHICAL.representation[i].granularityCode + '" class="SelectOption" >' + data.dimension.GEOGRAPHICAL.representation[i].title.es + ' </option>');

            $("#SelectorGranularidadGeo").selectmenu('refresh');
            $("#SelectRepresentacionGeo").selectmenu('refresh');

            //Añadimos opcion base de granularidad temporal.
            $("#SelectorGranularidadTime").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Añadimos opcion base de representación temporal.
            $("#SelectRepresentacionTime").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Rellenamos selectores temporales.
            for(var i=0; i<data.dimension.TIME.granularity.length; i++){
                $("#SelectorGranularidadTime").append('<option value="' + data.dimension.TIME.granularity[i].code + '" class="SelectOption" >' + data.dimension.TIME.granularity[i].title.es +'</option>');
                $("#SelectRepresentacionTime").append('<optgroup id="'+data.dimension.TIME.granularity[i].code+'" label="' +data.dimension.TIME.granularity[i].title.es+ '"class="SelectOption" ></optgroup>');
           }

            //Rellenamos Selector de representacion temporal
            for(var i=0; i<data.dimension.TIME.representation.length; i++)
                $("#" + data.dimension.TIME.representation[i].granularityCode).append('<option value=' + data.dimension.TIME.representation[i].code + "%"+ data.dimension.TIME.representation[i].granularityCode + ' class="SelectOption" >' + data.dimension.TIME.representation[i].title.es + ' </option>');

            $("#SelectorGranularidadTime").selectmenu('refresh');
            $("#SelectRepresentacionTime").selectmenu('refresh');

        },
        error:function(jqXHR,textStatus,errorThrown)
        {
            alert("You can not send Cross Domain AJAX requests ");
        }

    })

    $("#SelectorDiv").toggle();
}