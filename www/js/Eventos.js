/**
 * Created by Alejandro on 16/03/2015.
 */
//Evento de onchange de selector de idicador en el panel de peticion.
function OnchangeSelectorDatos(){
    $(".tabs").tabs( "option", "active", 0 );
    $("#BotonPeticion").button( "disable" );
    Peticion_Info_Indicadores($("#SelectorDatos").val().split("%")[0],$("#SelectorDatos").val().split("%")[1]);
}

//Evento de cambio de los selectores de representacion para abril el panel.
function onclickBotonPeticion(){
    $(".tabs").tabs( "option", "active", 0 );
    Peticion_Datos(CrearObjetoPeticion());
}

function OnchangebotonesGranularidad(){
    if($("#SelectRepresentacionGeo").val() == null || $("#SelectRepresentacionTime").val() == null)
        $("#BotonPeticion").button( "disable" );
    else
        $("#BotonPeticion").button( "enable" );
    $("#BotonPeticion").button( "refresh" );

}

//Evento para limpiar petición.
function onclickBotonLimpiar(){
    //Limpiamos el selectable de geografica.
    $("#SelectRepresentacionGeo").prepend('<option id=opcionvacia></option>');
    var myselect = $("#SelectRepresentacionGeo");
    myselect[0].selectedIndex=0;
    myselect.selectmenu("refresh");
    $("#opcionvacia").remove();

    //Limpiamos el selectable temporal
    $("#SelectRepresentacionTime").prepend('<option id=opcionvacia></option>');
    var myselect = $("#SelectRepresentacionTime");
    myselect[0].selectedIndex=0;
    myselect.selectmenu("refresh");
    $("#opcionvacia").remove();
    $("#BotonPeticion").button( "disable" );
}

/*
 <label class="select">Datos a Consultar</label>
 <select id="SelectorDatos" onchange="OnchangeSelectorDatos()">
 </select>
 <div id = "SelectorDiv">

 <label class="SelectLabel">Representacion Geográfica</label>
 <select id ="SelectRepresentacionGeo" class = "Select" multiple="multiple" data-native-menu="false"></select>

 <label class="SelectLabel">Representacion Temporal</label>
 <select id ="SelectRepresentacionTime" class = "Select" multiple="multiple" data-native-menu="false"></select>

 <input id="BotonLimpiar" type="button" value="Reiniciar" onclick="onclickBotonLimpiar()">
 <input id="BotonPeticion" type="button" value="Enviar" onclick="onclickBotonPeticion()">
 */