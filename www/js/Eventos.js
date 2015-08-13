/**
 * Created by Alejandro on 16/03/2015.
 */

function OnchangeSelectorcate(){
    $(".tabs").tabs("option", "active", 0);
    $("#BotonPeticion").button("disable");
    $("#BotonRepresentacionGeoTodo").val("Seleccionar Todo");
    $("#BotonRepresentacionTimeTodo").val("Seleccionar Todo");
    $("#BotonRepresentacionGeoTodo").button( "refresh" );
    $("#BotonRepresentacionTimeTodo").button( "refresh" );
    Peticion_Indicadores();

}

//Evento de onchange de selector de idicador en el panel de peticion.
function OnchangeSelectorDatos(){
    if($("#SelectIslas").val() != null && $("#SelectorDatos").val() != "") {
        $(".tabs").tabs("option", "active", 0);
        $("#BotonPeticion").button("disable");
        Peticion_Info_Indicadores($("#SelectorDatos").val().split("%")[0], $("#SelectorDatos").val().split("%")[1]);
        $("#BotonRepresentacionGeoTodo").val("Seleccionar Todo");
        $("#BotonRepresentacionTimeTodo").val("Seleccionar Todo");
        $("#BotonRepresentacionGeoTodo").button( "refresh" );
        $("#BotonRepresentacionTimeTodo").button( "refresh" );
    }

    else{
        $("#SelectorDiv").hide();
    }
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


function onclickBotonTodogeo(){

    if($("#BotonRepresentacionGeoTodo").val() == "Seleccionar Todo" ) {
        $("#BotonRepresentacionGeoTodo").val("Deseleccionar Todo");
        $("#SelectRepresentacionGeo option").prop("selected", true);
        if( $("#SelectRepresentacionTime").val() != null){
            $("#BotonPeticion").button( "enable" );
            $("#BotonPeticion").button( "refresh" );
        }

    }
    else {
        $("#BotonRepresentacionGeoTodo").val("Seleccionar Todo");
        $("#SelectRepresentacionGeo").prepend('<option id=opcionvacia></option>');
        var myselect = $("#SelectRepresentacionGeo");
        myselect[0].selectedIndex=0;
        myselect.selectmenu("refresh");
        $("#opcionvacia").remove();
        $("#BotonPeticion").button( "disable" );
    }
    $("#BotonRepresentacionGeoTodo").button( "refresh" );
    $("#SelectRepresentacionGeo").selectmenu("refresh");


}

function onclickBotonTodotime(){


    if($("#BotonRepresentacionTimeTodo").val() == "Seleccionar Todo" ) {
        $("#BotonRepresentacionTimeTodo").val("Deseleccionar Todo");
        $("#SelectRepresentacionTime option").prop("selected", true);
        if( $("#SelectRepresentacionGeo").val() != null){
            $("#BotonPeticion").button( "enable" );
            $("#BotonPeticion").button( "refresh" );
        }

    }
    else {
        $("#BotonRepresentacionTimeTodo").val("Seleccionar Todo");
        $("#SelectRepresentacionTime").prepend('<option id=opcionvacia></option>');
        var myselect = $("#SelectRepresentacionTime");
        myselect[0].selectedIndex=0;
        myselect.selectmenu("refresh");
        $("#opcionvacia").remove();
        $("#BotonPeticion").button( "disable" );
    }
    $("#SelectRepresentacionTime").selectmenu("refresh");
    $("#BotonRepresentacionTimeTodo").button( "refresh" );
}



// checkboxTime checkboxGEO
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