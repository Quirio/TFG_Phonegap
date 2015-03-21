/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion){
    var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/';

    var ejemplo = objPeticion.RepresentacionTime[0].split('%');

    //añadimos indicador.
    URL +=  objPeticion.Indicador + '/data?';
    //añadimos Representacion (si la hubiese)
    URLRepresentacion(objPeticion);
}

