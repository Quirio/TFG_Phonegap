/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion){
    var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/';

    //añadimos indicador.
    URL +=  objPeticion.Indicador + '/data?';
    //añadimos Representacion (si la hubiese)
    if(objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null){
        URL += URLRepresentacion(objPeticion);
        URL += '&';
    }
    if(objPeticion.GranularidadTime != null || objPeticion.GranularidadGeo != null)
        URL += URLGranularidad(objPeticion);
    URL += '&api_key=special-key';
    console.log(URL);
}

