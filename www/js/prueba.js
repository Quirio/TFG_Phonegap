var VectorIslas;
//Petición de prueba, datos sobre población de hombres por isla y año
function PeticionDatos(){
    $.ajax({
        url:"http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/POBLACION_HOMBRES/data?granularity=%3AGEOGRAPHICAL%5BISLANDS%5D&api_key=special-key"
        /* http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/indicators/POBLACION_HOMBRES/data?representation=GEOGRAPHICAL%5BES705%5D|MEASURE%5BABSOLUTE%5D|TIME%5B2013%5D&api_key=special-key"*/
        ,
        type:"GET",
        dataType: "jsonp",
        jsonp: "_callback",   
        success: SucessFunctionPeticionDatos ,
        error:function(jqXHR,textStatus,errorThrown)
        {
            alert("You can not send Cross Domain AJAX requests ");
        }
    });

};

function SucessFunctionPeticionDatos(data){

    var JSONobject = data;
    var NUMERO_ISLANDS = JSONobject.dimension.GEOGRAPHICAL.representation.size;
    var NUMERO_YEARS = JSONobject.dimension.TIME.representation.size;
    var NUMERO_VALORES = JSONobject.dimension.MEASURE.representation.size;
    var DatosISLANDSperYEAR = new Array(NUMERO_ISLANDS);

    //Array que contendrá los datos...
    for (var i = 0; i < NUMERO_ISLANDS; i++) {
        DatosISLANDSperYEAR[i] = new Array(NUMERO_YEARS);
        for (var j = 0; j < NUMERO_YEARS; j++) {
            DatosISLANDSperYEAR[i][j] = new Array(NUMERO_VALORES);
            for (var k = 0 ; k < NUMERO_VALORES; k++) {
                DatosISLANDSperYEAR[i][j][k] = 0;
            }
            //console.log("i: " + i + " " + "j: " + j);
        }
    }

    var pos = 0;
    //Llenamos el array con los datos....
    for (var i = 0; i < NUMERO_ISLANDS; i++) {
        //console.log("i: " + i);
        for (var j = 0; j < NUMERO_YEARS; j++) {
            //console.log("j: " + j);
            for (var k = 0 ; k < NUMERO_VALORES; k++) {
                if(!isNaN(parseFloat(JSONobject.observation[pos]))){
                    DatosISLANDSperYEAR[i][j][k] = parseFloat( JSONobject.observation[pos]);
                }
                pos += 1;
            }

        }
    }
    
    var text = '';
    for (var i = 0; i < NUMERO_ISLANDS; i++) {
        text += "Isla: " + VectorIslas[i].title.es + "\n";
        for (var j = 0; j < NUMERO_YEARS; j++) {
            text += " Año: " + j +"\n";
            for (var k = 0; k < NUMERO_VALORES; k++) {
                text += DatosISLANDSperYEAR[i][j][k] +"\n";
            }
        }
    }
    
    alert (text);
    
}


//petición para sonseguir los datos de las islas.
function Peticion_Islas(){
    
        $.ajax({
        type: "GET",
        url:"http://www.gobiernodecanarias.org/istac/indicators/api/indicators/v1.0/geographicalValues?geographicalGranularityCode=ISLANDS&api_key=special-key",
        dataType: "jsonp",
        jsonp: "_callback",
        success: function(data){
            VectorIslas = data;
            var JSONobject = data;
            var NUMERO_ISLANDS = 7;
            
            for (var i = 0; i < NUMERO_ISLANDS; i++) {
                alert("Isla: " + JSONobject[i].title.es + " Código: " + JSONobject[i].code);
             }
        },
        error:function(jqXHR,textStatus,errorThrown)
        {
            alert("You can not send Cross Domain AJAX requests ");
        }

    })
        
            PeticionDatos();

}
/*function SucessFunctionPeticionIslas(data){



}*/


