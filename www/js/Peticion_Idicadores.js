function Peticion_Indicadores(){

    $.ajax({
        type: "GET",
        url:"http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators?api_key=special-key",
        dataType: "jsonp",
        jsonp: "_callback",
        success: function(data){
            for(var i=0; i<data.total; i++)
                $("#SelectorDatos").append('<option value=' + data.items[i].id + '>' + data.items[i].title.es +'</option>');

        },
        error:function(jqXHR,textStatus,errorThrown)
        {
            alert("You can not send Cross Domain AJAX requests ");
        }

    })
}