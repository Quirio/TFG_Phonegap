/**
 * Created by Alejandro on 16/03/2015.
 */
//Evento de onchange de selector de idicador en el panel de peticion.
function OnchangeSelectorDatos(){
    $(".tabs").tabs( "option", "active", 0 );
    Peticion_Info_Indicadores($("#SelectorDatos").val().split("%")[0],$("#SelectorDatos").val().split("%")[1]);
}

//Evento de cambio de los selectores de representacion para abril el panel.
function onclickBotonPeticion(){
    $(".tabs").tabs( "option", "active", 0 );
    Peticion_Datos(CrearObjetoPeticion());
}
