/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion){
    var URL = 'http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/';

    console.log(objPeticion.RepresentacionTime);

    //añadimos indicador.
    URL +=  objPeticion.Indicador + '/data?';
    //añadimos Representacion (si la hubiese)
    URL += URLRepresentacion(objPeticion);
    URL += '&api_key=special-key';
    console.log(URL);
}

