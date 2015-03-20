/**
 * Created by Alejandro on 20/03/2015.
 */
function CrearObjetoPeticion(){
    var ObjPeticion ={
        Indicador: $("#SelectorDatos").val(),
        GranularidadGeo:$("#SelectorGranularidadGeo").val(),
        RepresentacionGeo:$("SelectRepresentacionGeo").val(),
        GranularidadTime:$("SelectorGranularidadTime").val(),
        RepresentacionTime:$("SelectRepresentacionTime").val()
    };

    return ObjPeticion;
}