/**
 * Created by Alejandro on 20/03/2015.
 */
function CrearObjetoPeticion(){
    var ObjPeticion ={
        Indicador: $("#SelectorDatos").val(),
        GranularidadGeo:$("#SelectorGranularidadGeo").val(),
        RepresentacionGeo:$("#SelectRepresentacionGeo").val(),
        GranularidadTime:$("#SelectorGranularidadTime").val(),
        RepresentacionTime:$("#SelectRepresentacionTime").val()
    };

    return ObjPeticion;
}
//http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/POBLACION_HOMBRES/data?representation=GEOGRAPHICAL%5BES704%7CES705%5D%3ATIME%5B2011%5D&api_key=special-key

////añadimos Representacion a URL de consulta de datos.
function URLRepresentacion(objPeticion){
    if(objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null){
        //Buscando una formas más elegante de hacerlo.
        var RepresentacionGEO;
        var RepresentacionTIME;
        var URLRep = '';
        if(objPeticion.RepresentacionTime == null) {
            RepresentacionGEO = objPeticion.RepresentacionGeo;
            URLRep += 'representation=GEOGRAPHICAL%5B';
            for(var i = 0; i<RepresentacionGEO.length;i++){
                URLRep += RepresentacionGEO[i] + '%7C';
            }
            URLRep += '%5D';

        }
        else if(objPeticion.RepresentacionGeo == null) {
            RepresentacionTIME = objPeticion.RepresentacionTime;
            URLRep += 'representation=TIME%5B';
            for(var i = 0; i<RepresentacionTIME.length;i++){
                URLRep += RepresentacionTIME[i] + '%7C';
            }
            URLRep += '%5D';
        }
        else {
            RepresentacionTIME = objPeticion.RepresentacionTime;
            RepresentacionGEO = objPeticion.RepresentacionGeo;
            URLRep += 'representation=GEOGRAPHICAL%5B';

            for(var i = 0; i<RepresentacionGEO.length;i++){
                URLRep += RepresentacionGEO[i] + '%7C';
            }
            URLRep += '%5D%3ATIME%5B';

            for(var i = 0; i<RepresentacionTIME.length;i++){
                URLRep += RepresentacionTIME[i] + '%7C';
            }
            URLRep += '%5D';
        }
       return URLRep;
    }

}