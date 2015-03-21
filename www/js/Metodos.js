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

////añadimos Representacion a URL de consulta de datos.
function URLRepresentacion(objPeticion){
    if(objPeticion.RepresentacionTime != 'nothing' || objPeticion.RepresentacionGeo != 'nothing'){

        var URLRep='representation=';
        var TipoRep = [];
        var Rep = [];
        var Representacion = objPeticion.RepresentacionTime.concat(objPeticion.RepresentacionGeo);
        for(var i=0; i<Representacion.length;i++) {
            var Representacion_aux = Representacion[i].split('%');
            console.log(Representacion_aux[0]);
            Rep[i] = Representacion_aux[0];
            TipoRep[i] = Representacion_aux[1];
        }

        console.log(TipoRep);
        console.log(Rep);

        var TiposVisitados = [];
        var TextoporTipo = [];
        TextoporTipo[0]= '';
        var count = 0

        for(var i=0; i<Representacion.length;i++){
            if(TiposVisitados[TipoRep[i]] != undefined)
                TextoporTipo[TiposVisitados[TipoRep[i]]] += '%7C' + Rep[i];

            else{
                TiposVisitados[TipoRep[i]] = count;
                TextoporTipo[TiposVisitados[TipoRep[i]]] = '';
                count++;
                TextoporTipo[TiposVisitados[TipoRep[i]]] += TipoRep[i] + '%5B' + Rep[i];
            }
        }

        var URLREP = '';
        for(var i=0; i<TextoporTipo.length; i++) {
            URLREP += TextoporTipo[i] += '%5D';
        }

        alert(URLREP);


    }

}