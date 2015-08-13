/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion) {

    $.getJSON( 'http://banot.etsii.ull.es/alu4403/Vistac/Indicadores.json', function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/';
        var Indicadores;
        var JSONindi = data;
        var Operadores;
        var flagmulfin = false;
        var derivadoflag = false;
        var superficieflag = false;
        var espacialflag = false;
        var espacialcal = false;
        var mulfin = 1;
        var IdicadoresURL = [];
        var DatosPeticiones = [];
        var DatosFinales =[];
        var RepURL = 1;
        var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];


        if(data[objPeticion.IndicadorNum].espacial == "SI") {
            espacialflag = true;
            if (data[objPeticion.IndicadorNum].opespacial == "SI") {
                espacialcal = true;
            }
        }

        //miramos si el indicador es derivado.
        if( data[objPeticion.IndicadorNum].derivado == "NO") {
            //añadimos indicador.
            URL += objPeticion.Indicador + '/data?';
        }

        else{
            derivadoflag = true;
            Indicadores = data[objPeticion.IndicadorNum].calculo.replace("(",'').replace(")",'').split(/\*|\+|\//);

            if(Indicadores[Indicadores.length-1]=="1000" || Indicadores[Indicadores.length-1]=="100"){
                mulfin = Indicadores.pop();
            }

            Operadores = data[objPeticion.IndicadorNum].calculo.replace("(",'').replace(")",'').match(/\W/g);
            //Console.log(Operadores);
            for(var i=0; i<Indicadores.length; i++)
                IdicadoresURL.push(URL + Indicadores[i] + '/data?');
            RepURL = Indicadores.length
        }

        var z =0;
        while(z < RepURL){

            //En caso de ser derivado tenemos que repetir una serie de peticiones por eso cambiamos url.
            if( data[objPeticion.IndicadorNum].derivado == "SI") {
                URL = IdicadoresURL[z];
                if(Indicadores[z]== "SUPERFICIE")
                    superficieflag = true;
            }

            //añadimos Representacion (si la hubiese)
            if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                URL += URLRepresentacion(objPeticion,superficieflag);
            }
           /* URL += '&';
            var Gtime;
            if (data[objPeticion.IndicadorNum].time == "MONTHLY")
                Gtime = "MONTHLY";
            else
                Gtime = "YEARLY";
            URL += 'granularity==GEOGRAPHICAL%5BMUNICIPALITIES%5D%3ATIME%5B' + Gtime + '%5D';*/

            URL += '&api_key=special-key';
            IdicadoresURL[z]=URL;
            z++;
        }

        console.log(data[objPeticion.IndicadorNum].time);
        console.log(URL);
        $("#TituloDatos").empty();
        $("#titulograficas").empty();

        //Peticion en caso de no derivado.
        if( data[objPeticion.IndicadorNum].derivado == "NO") {
            $.ajax({
                type: "GET",
                url: URL,
                dataType: "jsonp",
                jsonp: "_callback",
                success: function (data) {


                    console.log("Datos: ",data);
                    if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                        var POS0 = 0;
                        var POS1 = 1;
                        var POS2 = 2;
                        var i = 0;
                        var j = 0;
                        var TimeIndex = data.dimension.TIME.representation.size;
                        var GeoIndex = data.dimension.GEOGRAPHICAL.representation.size;
                        var MeasureIndex = data.dimension.MEASURE.representation.size;
                        var ArrayORdenGEO = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);
                        var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;
                        console.log("ArrayGeoRepresentacion: ",ArrayGeoRepresentacion);
                        var ArrayResultados = data.observation;
                        var ArrayDatosUtiles = [];
                        var n = ArrayResultados.length;

                        for(var i = 0; i<ArrayResultados.length; i++){
                            if(ArrayResultados[i] == null)
                                ArrayResultados[i] = 0;
                        }


                        $("#TituloDatos").append($("#SelectorDatos-button span").text());
                        $("#titulograficas").append($("#SelectorDatos-button span").text());
                        $("#TablaDatos").empty();

                        $("#TablaDatos").append('<thead><tr id="Titulo"></tr></thead><tbody id="Cuerpo"></tbody>');

                        $("#Titulo").append('<th></th>');
                        for (var i = 0; i < objPeticion.RepresentacionTime.length; i++) {
                            $("#Titulo").append('<th>' + objPeticion.RepresentacionTime[i] + '</th>');
                        }

                        $(window).on("orientationchange", function (event) {
                            $(".tabs").tabs("option", "active", 0);
                            CrearBarChart(data, objPeticion, ArrayORdenGEO,acumularflag,derivadoflag);
                        })


                        var acumularflag = false;
                        if(JSONindi[objPeticion.IndicadorNum].acumular == "SI")
                            acumularflag = true;


                        var l = 0;

                        for (var i = 0; i < objPeticion.RepresentacionGeo.length ; i++) {
                            var acumulado =0;
                            var index = ArrayGeoRepresentacion[ArrayORdenGEO[i]];
                            var z = index*(objPeticion.RepresentacionTime.length*MeasureIndex);
                            console.log("Indice: ", index, "ArrayResultados: ", ArrayResultados);
                            var indexnom = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                            $("#Cuerpo").append('<tr id="' + objPeticion.RepresentacionGeo[indexnom] + '"><th id="TituloVertical">' + objPeticion.RepresentacionGeonom[indexnom] + '</th></tr>');
                            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                                if(JSONindi[objPeticion.IndicadorNum].acumular == "SI") {
                                    acumulado += parseFloat(ArrayResultados[z]);
                                    $("#" + objPeticion.RepresentacionGeo[indexnom]).append('<th>' + acumulado +  '</th>');
                                }
                                else {
                                    $("#" + objPeticion.RepresentacionGeo[indexnom]).append('<th>' + ArrayResultados[z] + '</th>');
                                }
                                ArrayDatosUtiles[l] = ArrayResultados[z];
                                z += MeasureIndex ;
                                l++;
                            }
                        }

                        $("#TablaDatos").table("refresh");



                    }

                    CrearBarChart(data, objPeticion, ArrayORdenGEO,acumularflag,derivadoflag);
                    // if(espacialflag)
                     //   ComparacionEspacialND(ArrayDatosUtiles,espacialcal,objPeticion,data);
                  //  if(espacialflag)
                     //   ComparacionEspacial(Datos,Operacion,);

                }
            })
        }

        //peticiones en el caso de sí derivado.
        else {
            console.log("Derivado");
                superficieflag = false;
               URL=IdicadoresURL[0];
               PericionAJAXData(URL,0);

               function PericionAJAXData(URL,p) {

                   if(p >= Indicadores.length)
                        return;

                   $.ajax({
                       type: "GET",
                       url: URL,
                       dataType: "jsonp",
                       async: false,
                       jsonp: "_callback",
                       success: function (data) {

                           var d = p;

                           if(Indicadores[p]== "SUPERFICIE")
                               superficieflag = true;
                           //console.log(Indicadores[p],superficieflag);

                           if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                               var POS0 = 0;
                               var POS1 = 1;
                               var POS2 = 2;
                               var i = 0;
                               var j = 0;
                               var TimeIndex = data.dimension.TIME.representation.size;
                               var GeoIndex = data.dimension.GEOGRAPHICAL.representation.size;
                               var MeasureIndex = data.dimension.MEASURE.representation.size;
                               var ArrayORdenGEO = Object.keys(data.dimension.GEOGRAPHICAL.representation.index).reverse();
                               var ArrayResultados = data.observation.reverse();
                               var n = ArrayResultados.length;
                               var ArrayDatosIndicador = [];

                               for(var i = 0; i<ArrayResultados.length; i++){
                                   if(ArrayResultados[i] == null)
                                       ArrayResultados[i] = 0;
                               }

                               console.log(ArrayResultados );

                               var z = MeasureIndex-1;
                               for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                                   if(superficieflag && i!=0) {
                                       z = z + MeasureIndex;
                                   }
                                   for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                                       ArrayDatosIndicador.push(ArrayResultados[z]);
                                       if(!superficieflag) {
                                           z = z + MeasureIndex;
                                       }
                                   }
                               }

                               DatosPeticiones.push(ArrayDatosIndicador);
                              // console.log(DatosPeticiones);
                               $("#TablaDatos").table("refresh");

                           }

                           //console.log("Indicadorlenght: " + Indicadores.length, "DatosPeticionesleght: " +DatosPeticiones[0].length );
                           if (DatosPeticiones.length == Indicadores.length) {


                               for (var j = 0; j < DatosPeticiones[0].length; j++) {
                                   var indexop = 0;
                                   var DatoOPiqz = 0;
                                   var DatoOPderch = 0;
                                   var DivEncon = false;
                                   for (var z = 0; z < Indicadores.length; z++) {
                                      if (Operadores[indexop] == "/" && z>0) {
                                           DivEncon = true;
                                           indexop++;
                                       }

                                       if (!DivEncon) {
                                           if (z == 0) {
                                               DatoOPiqz = Operaciones(DatoOPiqz, parseFloat(DatosPeticiones[z][j]), "+");
                                           }
                                           else {
                                               DatoOPiqz = Operaciones(DatoOPiqz, parseFloat(DatosPeticiones[z][j]), Operadores[indexop]);
                                               indexop++;
                                           }
                                       }

                                       else {
                                           if (DatoOPderch == 0)
                                               DatoOPderch = Operaciones(DatoOPderch, parseFloat(DatosPeticiones[z][j]), "+");
                                           else {
                                               DatoOPderch = Operaciones(DatoOPderch, parseFloat(DatosPeticiones[z][j]), Operadores[indexop]);
                                               indexop++;
                                           }
                                       }

                                   }


                                   DatosFinales.push((DatoOPiqz / DatoOPderch)*mulfin);
                               }


                                $("#TituloDatos").append($("#SelectorDatos-button span").text());
                                $("#titulograficas").append($("#SelectorDatos-button span").text());
                                $("#TablaDatos").empty();

                                $("#TablaDatos").append('<thead><tr id="Titulo"></tr></thead><tbody id="Cuerpo"></tbody>');

                                $("#Titulo").append('<th></th>');
                                for (var i = 0; i < objPeticion.RepresentacionTime.length; i++) {
                                    $("#Titulo").append('<th>' + objPeticion.RepresentacionTime[i] + '</th>');
                                }

                               var z = 0;
                               for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                                   var acumulado =0;
                                   var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                                   $("#Cuerpo").append('<tr id="' + objPeticion.RepresentacionGeo[index] + '"><th id="TituloVertical">' + objPeticion.RepresentacionGeonom[index] + '</th></tr>');
                                   for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                                       if(JSONindi[objPeticion.IndicadorNum].acumular == "SI") {
                                           acumulado += parseFloat(DatosFinales[z]);
                                           $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + acumulado +  '</th>');
                                       }
                                       else
                                           $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + DatosFinales[z] + '</th>');
                                       z++ ;
                                   }
                               }

                            CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true);
                               $(window).on("orientationchange", function (event) {
                                   $(".tabs").tabs("option", "active", 0);
                                   CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true);
                               })

                           }

                           console.log(DatosFinales);


                       }
                   }).done(function(){
                       PericionAJAXData(IdicadoresURL[p+1],p+1);
                   });
               }

        }
    })
}

//http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/ALOJATUR_ABIERTOS/data?representation=GEOGRAPHICAL%5B38001%7C38006%5D%3ATIME%5B2015M04%7C2015M05%7C2015M06%5D&api_key=special-key
//Comparación Espacial para no derivados
function ComparacionEspacialND(DatosMunicipios,Operacion,objPeticion,InfoPeticion){

    var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/'+objPeticion.Indicador;

    var IslasSelect = $("#SelectIslas").val();
    var CodeIslas = ["ES709", "ES706", "ES707", "ES703", "ES705", "ES708", "ES704"];
    var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];
    var RepresentacionTIME = objPeticion.RepresentacionTime.reverse();
    var RepresentacionGEO = [];
    var ContieneMunicipios = [false,false,false,false,false,false,false];

    console.log("Islas Seleccionadas: ",IslasSelect);

    for(var i = 0; i<IslasSelect.length; i++)
        RepresentacionGEO[i] = CodeIslas[IslasSelect[i]];


    URL += '/data?representation=GEOGRAPHICAL%5B';

    for(var i = 0; i<RepresentacionGEO.length;i++){
        if(i+1 != RepresentacionGEO.length)
            URL += RepresentacionGEO[i] + '%7C';
        else
            URL += RepresentacionGEO[i];
    }
    URL += '%5D%3ATIME%5B';


    for (var i = 0; i < RepresentacionTIME.length; i++) {
        if (i + 1 != RepresentacionTIME.length)
            URL += RepresentacionTIME[i] + '%7C';
        else
            URL += RepresentacionTIME[i];
    }

    URL += '%5D&api_key=special-key';

    console.log(URL);

    $.ajax({
        type: "GET",
        url: URL,
        dataType: "jsonp",
        async: false,
        jsonp: "_callback",
        success: function (data) {
            $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/RelacionMunicipiosIslas.json', function( Relacion ) {
                $("#SelectComp").empty();
                //array con orden de municipios.
                var ArrayordenMun = Object.keys(InfoPeticion.dimension.GEOGRAPHICAL.representation.index).reverse();
                var NombreMun = [];
                for(var i=0; i<ArrayordenMun.length; i++){
                    NombreMun[i] = Relacion[ArrayordenMun[i]].title;
                }

                console.log("ArrayordenMun: ", ArrayordenMun, "NombreMun: ", NombreMun, "Datos Municipios: ", DatosMunicipios);

                //Array con orden de islas.
                var ArrayordenIs = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);


                //Obtener Array de datos utiles de la isla.
                var ArrayResultados = data.observation;
                var MeasureIndex = data.dimension.MEASURE.representation.size;
                var DatosUtilesIsla = [];
                var z =  0;
                for (var i = 0; i < ArrayordenIs.length; i++) {
                    DatosUtilesIsla[ArrayordenIs[i]] = [];
                    for(var j=0; j<RepresentacionTIME.length;j++){
                        DatosUtilesIsla[ArrayordenIs[i]][RepresentacionTIME[j]] = ArrayResultados[z];
                         z = z + MeasureIndex ;

                    }

                }

                console.log("Dato Isla: ",ArrayResultados,"Array Orden Isla: ", ArrayordenIs,"Array datos utiles: ", DatosUtilesIsla);

                var ArrayDatosFinal = [];

                //LLevamos a cabo la comparación.
                for (var i = 0; i<ArrayordenMun.length; i++){
                    var DatosRelacion = Relacion[ArrayordenMun[i]];
                    var codeIsla = CodeIslas[Islas.indexOf(DatosRelacion.island)];
                    ContieneMunicipios[Islas.indexOf(DatosRelacion.island)] = true;
                    ArrayDatosFinal[ArrayordenMun[i]] = [];
                    for(var j =0; j<RepresentacionTIME.length; j++) {
                        var resultado;
                        var l = i+j;
                        if (Operacion) {
                            resultado = (parseFloat(DatosMunicipios[l])/parseFloat(DatosUtilesIsla[codeIsla][RepresentacionTIME[j]]))*100;
                            ArrayDatosFinal[ArrayordenMun[i]][RepresentacionTIME[j]] ={
                                "Dato":""+resultado,
                                "CodigoIsla":codeIsla,
                                "NombreIsla": Islas[CodeIslas.indexOf(codeIsla)]
                            };
                           // console.log("resultados: ", ArrayDatosFinal);
                        }

                        else {
                            ArrayDatosFinal[ArrayordenMun[i]][RepresentacionTIME[j]] ={
                                "Dato":""+DatosUtilesIsla[codeIsla][RepresentacionTIME[j]],
                                "CodigoIsla":codeIsla,
                                "NombreIsla": Islas[CodeIslas.indexOf(codeIsla)]
                            };
                        }
                    }
                }

                //Rellenamos selectable de comparación espacial.
                for(var i = 0; i< IslasSelect.length; i++){
                    if(ContieneMunicipios[IslasSelect[i]]){
                        for(var j=0; j<RepresentacionTIME.length;j++){
                            //<option value="011">Territorio y usos del suelo</option>
                            $("#SelectComp").append('<option value="' + CodeIslas[IslasSelect[i]] +'%'+ RepresentacionTIME[j] +'"> Datos de la isla ' +  Islas[IslasSelect[i]] + ' en el año '+ RepresentacionTIME[j]+  '</option>');
                        }
                    }

                }

                $("#SelectComp").selectmenu("refresh");

                //LLamamos a la funcion para crear la comparación
                if (Operacion) {
                    CrearCircularChart(ArrayDatosFinal, IslasSelect, Islas, CodeIslas, ArrayordenMun, NombreMun, RepresentacionTIME);
                    $("#SelectComp").change(function() {
                        CrearCircularChart(ArrayDatosFinal, IslasSelect, Islas, CodeIslas, ArrayordenMun, NombreMun, RepresentacionTIME);
                    });

                }

                else{

                }
                console.log("DatosMunicipios: ",DatosMunicipios);
                console.log("Array Orden: ",ArrayordenMun,"Array Nombre: ",NombreMun);
                console.log("Dato Isla: ", ArrayResultados ,"Array Orden Isla: ", ArrayordenIs);

            });
        }
    });


}

function Operaciones (Dato1,Dato2,op){
    //console.log(Dato1,Dato2,op);
    switch (op){
        case "+":
            return Dato1+Dato2;
            break;
        case "*":
            return Dato1*Dato2;
            break;
        case "/":
            return Dato1/Dato2;
            break;
    }
}


function Geo(index,n,GeoIndex) {
    return index % (n / GeoIndex);
}

function Time(index,n,Geoindex,TimeIndex){
    return index % ((n/Geoindex)/TimeIndex);
}


