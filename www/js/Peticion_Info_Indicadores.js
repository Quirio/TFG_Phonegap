function Peticion_Info_Indicadores(Indicador){

    var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/' + Indicador + '?api_key=special-key'

    $.ajax({
        type: "GET",
        url: URL,
        dataType: "jsonp",
        jsonp: "_callback",
        success: function(data){
            //borramos los labels para que no se repitan.
            $("#SelectorDiv").remove();

            //Encapsulamos los selectores de sesgo en un div para facilitar su uso.
            $("#Panel_Peticion").append('<div id = "SelectorDiv"></div>')

            //Por lo tanto introducimos los selectores a este div.
            //Añadimos selector de granularidad geográfica.
            $("#SelectorDiv").append('<label class="SelectLabel">Granularidad geográfica</label> <select id="SelectorGranularidadGeo" class = "Select"></select>');

            $("#SelectorGranularidadGeo").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Añadimos selectores de representación geográfica.
            $("#SelectorDiv").append('<label class="SelectLabel">Representacion Geográfica</label> <select id = "SelectRepresentacionGeográfica" class = "Select" multiple="multiple"></select>)')

            $("#SelectRepresentacionGeográfica").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Rellenamos los selectores.
            for(var i=0; i<data.dimension.GEOGRAPHICAL.granularity.length; i++){
                $("#SelectorGranularidadGeo").append('<option value=' + data.dimension.GEOGRAPHICAL.granularity[i].code + 'class="SelectOption" >' + data.dimension.GEOGRAPHICAL.granularity[i].title.es +'</option>');
                $("#SelectRepresentacionGeográfica").append("<optgroup label=" +data.dimension.GEOGRAPHICAL.granularity[i].title.es+ "></optgroup>");
            }

            //Añadimos selector de granularidad temporal.
            $("#SelectorDiv").append('<label class="SelectLabel">Granularidad temporal</label> <select id="SelectorGranularidadTime" class = "Select"></select>');

            $("#SelectorGranularidadTime").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Añadimos selectores de representación temporal.
            $("#SelectorDiv").append('<label class="SelectLabel">Representacion Temporal</label> <select id = "SelectRepresentacionTemporal" class = "Select" multiple="multiple"></select>)')

            $("#SelectRepresentacionTemporal").append('<option value= "nothing" class="SelectOption" > Ninguna </option>');

            //Rellenamos selectores.
            for(var i=0; i<data.dimension.TIME.granularity.length; i++){
                $("#SelectorGranularidadTime").append('<option value=' + data.dimension.TIME.granularity[i].code + 'class="SelectOption" >' + data.dimension.TIME.granularity[i].title.es +'</option>');
                $("#SelectRepresentacionTemporal").append("<optgroup id="+data.dimension.TIME.granularity[i].code+"label=" +data.dimension.TIME.granularity[i].title.es+ "></optgroup>");
           }

            //Rellenamos Selector de representacion temporal
            for(var i=0; i<data.dimension.TIME.representation.length; i++)
                $("#"+data.dimension.TIME.representation[i].granularityCode).append("<option value=" + data.dimension.TIME.representation[i].code+  "class="SelectOption" >"+ data.dimension.TIME.representation[i].title.es+ " </option>");



        },
        error:function(jqXHR,textStatus,errorThrown)
        {
            alert("You can not send Cross Domain AJAX requests ");
        }

    })
}