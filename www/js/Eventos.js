/**
 * Created by Alejandro on 16/03/2015.
 */
//Evento de onchange de selector de idicador en el panel de peticion.
function OnchangeSelectorDatos(){
    Peticion_Info_Indicadores($("#SelectorDatos").val());
}

//Evento de cambio de los selectores de representacion para abril el panel.
function onclickBotonPeticion(){
    Peticion_Datos(CrearObjetoPeticion());
}
