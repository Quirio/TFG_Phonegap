/**
 * Created by Alejandro on 19/03/2015.
 */

function Peticion_Datos(objPeticion) {
    console.log(objPeticion.RepresentacionGeo.length);
     if(parseInt(objPeticion.RepresentacionGeo.length) > 10){
        leyendaflag = false;
        leyendaflagCom = false;
    }
    else{
        leyendaflag = true;
        leyendaflagCom = true;
    }


    $("#GraficaC").empty();
    $("#GraficaCircular").hide();

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
        var DatosPeticionesIslas =[];
        var DatosFinales =[];
        var DatosFinalesIslas =[];
        var RepURL = 1;
        var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];
        var IslasCode = ["ES709","ES706","ES707","ES703","ES705","ES708","ES704"];



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
                URL += URLRepresentacion(objPeticion,superficieflag,derivadoflag,espacialflag,IslasCode);
            }
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

                        var MeasureIndex = data.dimension.MEASURE.representation.size;
                        var ArrayORdenGEO = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);
                        var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;
                        var PosAbsolute = data.dimension.MEASURE.representation.index.ABSOLUTE;
                            console.log("Data: ",data,"PosAbsolute: ",PosAbsolute);
                        var ArrayResultados = data.observation;
                        var ArrayDatosUtiles = [];

                        for(var i = 0; i<ArrayResultados.length; i++){
                            if(ArrayResultados[i] == null)
                                ArrayResultados[i] = 0;
                        }


                        $("#TituloDatos").append($("#SelectorDatos-button span").text());
                        $("#titulograficas").append($("#SelectorDatos-button span").text());
                        $("#TablaDatos").empty();

                        $("#TablaDatos").append('<thead><tr id="Titulo"></tr></thead><tbody id="Cuerpo"></tbody>');

                        $("#Titulo").append('<th></th>');
                        if (JSONindi[objPeticion.IndicadorNum].acumular != "SI") {
                            for (var i = 0; i < objPeticion.RepresentacionTime.length; i++) {
                                $("#Titulo").append('<th>' + objPeticion.RepresentacionTime[i] + '</th>');
                            }
                        }

                        else{
                            var time = objPeticion.RepresentacionTime.reverse();
                            for (var i = 0; i < time.length; i++) {
                                $("#Titulo").append('<th>' + time[i] + '</th>');
                            }
                        }


                        var acumularflag = false;
                        if(JSONindi[objPeticion.IndicadorNum].acumular == "SI")
                            acumularflag = true;


                        var l = 0;

                        for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                            var index = ArrayGeoRepresentacion[ArrayORdenGEO[i]];
                            var z = PosAbsolute + (index * objPeticion.RepresentacionTime.length * MeasureIndex);
                            console.log("Indice: ", index, "ArrayResultados: ", ArrayResultados);
                            var indexnom = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                            if (JSONindi[objPeticion.IndicadorNum].acumular != "SI") {
                                $("#Cuerpo").append('<tr id="' + objPeticion.RepresentacionGeo[indexnom] + '"><th id="TituloVertical">' + objPeticion.RepresentacionGeonom[indexnom] + '</th></tr>');
                            }

                            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                                if (JSONindi[objPeticion.IndicadorNum].acumular != "SI"){
                                    $("#" + objPeticion.RepresentacionGeo[indexnom]).append('<th id="DatoTabla">' + parseFloat(ArrayResultados[z]).toFixed(2) + '</th>');
                                }
                                ArrayDatosUtiles[l] = ArrayResultados[z];
                                z += MeasureIndex;
                                l++;
                            }
                        }

                         //En caso de que sea acaumulado.
                        var ArrayDatosUtilesAcum = [];
                        if(JSONindi[objPeticion.IndicadorNum].acumular == "SI") {

                            var Geo = objPeticion.RepresentacionGeo;
                            var Time = objPeticion.RepresentacionTime;
                            var Geonom = objPeticion.RepresentacionGeonom;
                            var Geoorden = ArrayORdenGEO;
                            var l =0;
                            ArrayDatosUtiles.reverse();

                            for(var i=0; i<Geo.length;i++){
                                var Acumulado = parseFloat(ArrayDatosUtiles[l]);
                                ArrayDatosUtilesAcum[l] = Acumulado;
                                for(var j=0; j<Time.length;j++) {
                                    l++
                                    Acumulado = parseFloat(ArrayDatosUtiles[l]) + Acumulado
                                    ArrayDatosUtilesAcum[l] = Acumulado;
                                }
                            }

                            ArrayDatosUtiles.reverse();
                            Geoorden.reverse();

                            var l = 0;
                            for (var i = 0; i < Geo.length; i++) {
                                var indexnom = Geo.indexOf(ArrayORdenGEO[i]);
                                $("#Cuerpo").append('<tr id="' + Geo[indexnom] + '"><th id="TituloVertical">' + Geonom[indexnom] + '</th></tr>');
                                for (var j = 0; j < Time.length; j++) {
                                    $("#" + Geo[indexnom]).append('<th>' + ArrayDatosUtilesAcum[l].toFixed(2) + '</th>');
                                    l++;
                                }
                            }
                        }

                        //$("#TablaDatos").table("refresh");
                    }

                    if(JSONindi[objPeticion.IndicadorNum].acumular != "SI")
                        CrearBarChart(data, objPeticion, ArrayORdenGEO, acumularflag, derivadoflag, leyendaflag);
                    else
                        CrearBarChart(ArrayDatosUtilesAcum, objPeticion, ArrayORdenGEO, true, derivadoflag, leyendaflag);


                     if(espacialflag)
                        ComparacionEspacialND(ArrayDatosUtiles,espacialcal,objPeticion,data);
                  //  if(espacialflag)
                     //   ComparacionEspacial(Datos,Operacion,);

                    $(window).on("orientationchange", function (event) {
                        console.log("Evento: ",event.orientation);
                        $(".tabs").tabs("option", "active", 0);
                        if(JSONindi[objPeticion.IndicadorNum].acumular != "SI")
                            CrearBarChart(data, objPeticion, ArrayORdenGEO,acumularflag,derivadoflag,leyendaflag);
                        else
                            CrearBarChart(ArrayDatosUtilesAcum, objPeticion, ArrayORdenGEO, true, derivadoflag, leyendaflag);

                        if(espacialflag)
                            ComparacionEspacialND(ArrayDatosUtiles,espacialcal,objPeticion,data);
                    })

                    $("#BotonLeyendas").off( "mousedown" );
                    $("#BotonLeyendas").mousedown(function() {
                        $(".tabs").tabs("option", "active", 0);

                        if( leyendaflag)
                            leyendaflag = false;
                        else
                            leyendaflag = true;
                        if(JSONindi[objPeticion.IndicadorNum].acumular != "SI")
                             CrearBarChart(data, objPeticion, ArrayORdenGEO,acumularflag,derivadoflag, leyendaflag);
                        else
                            CrearBarChart(ArrayDatosUtilesAcum, objPeticion, ArrayORdenGEO, true, derivadoflag, leyendaflag);
                    });

                }
            })
        }

        //peticiones en el caso de sí derivado.
        else {
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
                           console.log(Indicadores[p],superficieflag);

                           if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {

                               var MeasureIndex = data.dimension.MEASURE.representation.size;
                               var ArrayORdenGEO = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);
                               var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;
                               var PosAbsolute = data.dimension.MEASURE.representation.index.ABSOLUTE;
                               var ArrayResultados = data.observation;
                               var IslasSelect = $("#SelectIslas").val();

                               var ArrayDatosIndicador = [];
                               var ArrayDatosIslas = [];

                               for(var i = 0; i<ArrayResultados.length; i++){
                                   if(ArrayResultados[i] == null)
                                       ArrayResultados[i] = 0;
                               }

                               console.log("ArrayResultadoDerivado:" ,ArrayResultados[3]);
                               var z=MeasureIndex-1;

                               for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                                   var index = ArrayGeoRepresentacion[ArrayORdenGEO[i]];

                                   if(!superficieflag) {
                                       z = PosAbsolute + (index*objPeticion.RepresentacionTime.length*MeasureIndex);
                                   }
                                   
                                   for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                                       ArrayDatosIndicador.push(ArrayResultados[z]);
                                       if(!superficieflag) {
                                           z = z + MeasureIndex;
                                       }
                                   }

                                   if(superficieflag) {
                                       z++;
                                   }
                               }

                               //En el caso de representacion espacial obtenemos los datos de islas
                               if(espacialflag) {
                                   var z = ArrayGeoRepresentacion[IslasCode[IslasSelect[0]]];

                                   for(var i=0; i<IslasSelect.length; i++) {
                                       var indexis = ArrayGeoRepresentacion[IslasCode[IslasSelect[i]]];
                                       if(!superficieflag) {
                                           z = indexis*(objPeticion.RepresentacionTime.length*MeasureIndex);
                                       }
                                       for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                                           console.log(z);
                                           ArrayDatosIslas.push(ArrayResultados[z]);
                                           if(!superficieflag) {
                                               z = z + MeasureIndex;
                                           }
                                       }

                                       if(superficieflag) {
                                           z++;
                                       }
                                   }
                               }

                               DatosPeticiones.push(ArrayDatosIndicador);
                               DatosPeticionesIslas.push(ArrayDatosIslas);
                               console.log("DatosPeticiones ",DatosPeticiones);
                              // $("#TablaDatos").table("refresh");

                           }





                           if (DatosPeticiones.length == Indicadores.length) {

                               if(espacialflag) {
                                   //Operaciones para obetener los datos de las islas.
                                   for (var j = 0; j < DatosPeticionesIslas[0].length; j++) {
                                       var indexop = 0;
                                       var DatoOPiqzIsla = 0;
                                       var DatoOPderchIsla = 0;
                                       var DivEncon = false;
                                       for (var z = 0; z < Indicadores.length; z++) {
                                           if (Operadores[indexop] == "/" && z > 0) {
                                               DivEncon = true;
                                               indexop++;
                                           }

                                           if (!DivEncon) {
                                               if (z == 0) {
                                                   DatoOPiqzIsla = Operaciones(DatoOPiqzIsla, parseFloat(DatosPeticionesIslas[z][j]), "+");
                                               }
                                               else {
                                                   DatoOPiqzIsla = Operaciones(DatoOPiqzIsla, parseFloat(DatosPeticionesIslas[z][j]), Operadores[indexop]);
                                                   indexop++;
                                               }
                                           }

                                           else {
                                               if (DatoOPderchIsla == 0)
                                                   DatoOPderchIsla = Operaciones(DatoOPderchIsla, parseFloat(DatosPeticionesIslas[z][j]), "+");
                                               else {
                                                   DatoOPderchIsla = Operaciones(DatoOPderch, parseFloat(DatosPeticionesIslas[z][j]), Operadores[indexop]);
                                                   indexop++;
                                               }
                                           }

                                       }


                                       DatosFinalesIslas.push((DatoOPiqzIsla / DatoOPderchIsla) * mulfin);

                                   }
                               }


                               //Operaciones para obtener los datos de los municipios.
                               for (var j = 0; j < DatosPeticiones[0].length; j++) {
                                   var indexop = 0;
                                   var DatoOPiqz = 0;
                                   var DatoOPiqzIsla =0;
                                   var DatoOPderch = 0;
                                   var DatoOPderchIsla = 0;
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

                               console.log("DatosFinales: ",DatosFinales);

                                $("#TituloDatos").append($("#SelectorDatos-button span").text());
                                $("#titulograficas").append($("#SelectorDatos-button span").text());
                                $("#TablaDatos").empty();

                                $("#TablaDatos").append('<thead><tr id="Titulo"></tr></thead><tbody id="Cuerpo"></tbody>');

                                $("#Titulo").append('<th></th>');
                                for (var i = 0; i < objPeticion.RepresentacionTime.length; i++) {
                                    $("#Titulo").append('<th>' + objPeticion.RepresentacionTime[i] + '</th>');
                                }

                               var z = 0;
                               console.log("ArrayOdenGeo: ",ArrayORdenGEO,"Datos Finales: ",DatosFinales);
                               for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                                   var acumulado =0;
                                   var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                                   $("#Cuerpo").append('<tr id="' + objPeticion.RepresentacionGeo[index] + '"><th id="TituloVertical">' + objPeticion.RepresentacionGeonom[index] + '</th></tr>');
                                   for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                                       if(JSONindi[objPeticion.IndicadorNum].acumular == "SI") {
                                           acumulado += parseFloat(DatosFinales[z]);
                                           $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + acumulado.toFixed(2) +  '</th>');
                                       }
                                       else
                                           $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + DatosFinales[z].toFixed(2) + '</th>');
                                       z++ ;
                                   }
                               }

                            CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true,leyendaflag);
                               $(window).on("orientationchange", function (event) {
                                   $(".tabs").tabs("option", "active", 0);
                                   CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true,leyendaflag);
                               })

                               $("#BotonLeyendas").off( "mousedown" );
                               $("#BotonLeyendas").mousedown(function() {
                                   $(".tabs").tabs("option", "active", 0);

                                   if( leyendaflag)
                                       leyendaflag = false;
                                   else
                                       leyendaflag = true;
                                   CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true, leyendaflag);
                               });


                               if(espacialflag)
                                   ComparacionEspacialD(DatosFinales,DatosFinalesIslas,objPeticion,data);

                               $(window).on("orientationchange", function (event) {
                                   $(".tabs").tabs("option", "active", 0);
                                   CrearBarChart(DatosFinales, objPeticion, ArrayORdenGEO,false,true,leyendaflag);

                                   if(espacialflag)
                                       ComparacionEspacialD(DatosFinales,DatosFinalesIslas,objPeticion,data);
                               })

                           }

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
    $("#GraficaCircular").show();
    var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/'+objPeticion.Indicador;

    var IslasSelect = $("#SelectIslas").val();
    var CodeIslas = ["ES709", "ES706", "ES707", "ES703", "ES705", "ES708", "ES704"];
    var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];
    var RepresentacionTIME = objPeticion.RepresentacionTime.reverse();
    var RepresentacionGEO = [];

    for(var i=0; i<DatosMunicipios.length;i++){
        if(DatosMunicipios[i] == "."){
            DatosMunicipios[i] =0;
        }
    }

    var ContieneMunicipios = [false,false,false,false,false,false,false];

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
            var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;

            $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/RelacionMunicipiosIslas.json', function( Relacion ) {
                $("#SelectComp").empty();
                //array con orden de municipios.
                var ArrayordenMun = Object.keys(InfoPeticion.dimension.GEOGRAPHICAL.representation.index);
                var NombreMun = [];
                for(var i=0; i<ArrayordenMun.length; i++){
                    NombreMun[i] = Relacion[ArrayordenMun[i]].title;
                }

              //  console.log("ArrayordenMun: ", ArrayordenMun, "NombreMun: ", NombreMun, "Datos Municipios: ", DatosMunicipios);

                //Array con orden de islas.
                var ArrayordenIs = Object.keys(data.dimension.GEOGRAPHICAL.representation.index);


                //Obtener Array de datos utiles de la isla.
                var ArrayResultados = data.observation;
                var MeasureIndex = data.dimension.MEASURE.representation.size;
                var PosAbsolute = data.dimension.MEASURE.representation.index.ABSOLUTE;
                var DatosUtilesIsla = [];
                for (var i = 0; i < ArrayordenIs.length; i++) {
                    var index = ArrayGeoRepresentacion[ArrayordenIs[i]];
                    var z = PosAbsolute+(index*objPeticion.RepresentacionTime.length*MeasureIndex);
                    DatosUtilesIsla[ArrayordenIs[i]] = [];
                    for(var j=0; j<RepresentacionTIME.length;j++){
                        DatosUtilesIsla[ArrayordenIs[i]][RepresentacionTIME[j]] = ArrayResultados[z];
                         z = z + MeasureIndex ;

                    }

                }

               // console.log("Dato Isla: ",ArrayResultados,"Array Orden Isla: ", ArrayordenIs,"Array datos utiles: ", DatosUtilesIsla);

                var ArrayDatosFinal = [];

                //LLevamos a cabo la comparación.
                var l =0 ;
                for (var i = 0; i<ArrayordenMun.length; i++){
                    var DatosRelacion = Relacion[ArrayordenMun[i]];
                    var codeIsla = CodeIslas[Islas.indexOf(DatosRelacion.island)];
                    ContieneMunicipios[Islas.indexOf(DatosRelacion.island)] = true;
                    ArrayDatosFinal[ArrayordenMun[i]] = [];
                    for(var j =0; j<RepresentacionTIME.length; j++) {
                        var resultado;
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
                        l++;
                    }
                }

                //Rellenamos selectable de comparación espacial.
                for(var i = 0; i< IslasSelect.length; i++){
                    if(ContieneMunicipios[IslasSelect[i]]){
                        for(var j=0; j<RepresentacionTIME.length;j++){
                            //<option value="011">Territorio y usos del suelo</option>
                            $("#SelectComp").append('<option value="' + CodeIslas[IslasSelect[i]] +'%'+ RepresentacionTIME[j] +'"> Datos de la isla ' +  Islas[IslasSelect[i]] + ' en el '+ RepresentacionTIME[j]+  '</option>');
                        }
                    }

                }

                $("#SelectComp").selectmenu("refresh");

                //LLamamos a la funcion para crear la comparación
                if (Operacion) {

                    CrearCircularChart(ArrayDatosFinal, IslasSelect, Islas, CodeIslas, ArrayordenMun, NombreMun, RepresentacionTIME,leyendaflagCom);
                    $("#SelectComp").off( "change" );
                    $("#SelectComp").change(function() {
                        $("#SelectComp").selectmenu("refresh");
                        CrearCircularChart(ArrayDatosFinal, IslasSelect, Islas, CodeIslas, ArrayordenMun, NombreMun, RepresentacionTIME,leyendaflagCom);
                    });

                    $("#BotonLeyendas1").off( "mouseup" );
                    $("#BotonLeyendas1").mouseup(function() {
                        $(".tabs").tabs("option", "active", 0);

                        if(leyendaflagCom)
                            leyendaflagCom = false;
                        else
                            leyendaflagCom = true;
                        CrearCircularChart(ArrayDatosFinal, IslasSelect, Islas, CodeIslas, ArrayordenMun, NombreMun, RepresentacionTIME,leyendaflagCom);
                    });

                }

                else{
                    CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);
                    $("#SelectComp").off( "change" );
                    $("#SelectComp").change(function() {
                        CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);
                    });

                    $("#BotonLeyendas1").off( "mouseup" );
                    $("#BotonLeyendas1").mouseup(function() {
                        $(".tabs").tabs("option", "active", 0);

                        if(leyendaflagCom)
                            leyendaflagCom = false;
                        else
                            leyendaflagCom = true;
                        CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);
                    });
                }
            });
        }
    });


}

//Comparacion espacil de derivados.
function ComparacionEspacialD(DatosMunicipios,DatosIslas,objPeticion,InfoPeticion){
    $("#GraficaCircular").show();
    $.getJSON('http://banot.etsii.ull.es/alu4403/Vistac/RelacionMunicipiosIslas.json', function( Relacion ) {

        $("#SelectComp").empty();
        console.log("Datos Islas: ", DatosIslas);
        var ContieneMunicipios = [false,false,false,false,false,false,false];
        var RepresentacionTIME = objPeticion.RepresentacionTime.reverse();
        var IslasSelect = $("#SelectIslas").val();
        var CodeIslas = ["ES709", "ES706", "ES707", "ES703", "ES705", "ES708", "ES704"];
        var Islas = ["Tenerife","La Gomera","La Palma","El Hierro","Gran Canaria","Lanzarote","Fuerteventura"];
        var ArrayordenMun = Object.keys(InfoPeticion.dimension.GEOGRAPHICAL.representation.index);
        var ArrayordenIS = [];

        z = 0;
        for(var i= ArrayordenMun.length-IslasSelect.length; i<ArrayordenMun.length; i++){
            ArrayordenIS[z] = ArrayordenMun[i];
            z++
        }

        for(var i= 0; i<IslasSelect.length; i++){
            ArrayordenMun.pop();
        }

        console.log(ArrayordenMun);

        var NombreMun = [];
        var ArrayDatosFinal =[];

        //Creamos el array final para los datos de municipios
        for(var i=0; i<ArrayordenMun.length; i++){
            console.log(ArrayordenMun[i]);
            var DatosRelacion = Relacion[ArrayordenMun[i]];
            ContieneMunicipios[Islas.indexOf(DatosRelacion.island)] = true;
            NombreMun[i] = Relacion[ArrayordenMun[i]].title;
            var codeIsla = CodeIslas[Islas.indexOf(DatosRelacion.island)];
            ArrayDatosFinal[ArrayordenMun[i]] = [];
            var l = ArrayordenIS.indexOf(codeIsla)*RepresentacionTIME.length;
            console.log("L: ", l);
            for(var j =0; j<RepresentacionTIME.length; j++) {
                ArrayDatosFinal[ArrayordenMun[i]][RepresentacionTIME[j]] = {
                    "Dato":""+DatosIslas[l],
                    "CodigoIsla": CodeIslas[Islas.indexOf(DatosRelacion.island)],
                    "NombreIsla": DatosRelacion.island
                }
                l++;
                console.log("Array datos finales: ", ArrayDatosFinal);
            }
        }


        //Rellenamos selectable de comparación espacial.
        for (var i = 0; i < IslasSelect.length; i++) {
            if (ContieneMunicipios[IslasSelect[i]]) {
                for (var j = 0; j < RepresentacionTIME.length; j++) {
                    //<option value="011">Territorio y usos del suelo</option>
                    $("#SelectComp").append('<option value="' + CodeIslas[IslasSelect[i]] + '%' + RepresentacionTIME[j] + '"> Datos de la isla ' + Islas[IslasSelect[i]] + ' en el ' + RepresentacionTIME[j] + '</option>');
                }
            }

        }

        $("#SelectComp").selectmenu("refresh");



        CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);


        $("#SelectComp").off( "change" );
        $("#SelectComp").change(function() {
            $("#SelectComp").selectmenu("refresh");
            CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);
        });

        $("#BotonLeyendas1").off( "mouseup" );
        $("#BotonLeyendas1").mouseup(function() {
            $(".tabs").tabs("option", "active", 0);

            if(leyendaflagCom)
                leyendaflagCom = false;
            else
                leyendaflagCom = true;
            CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflagCom);
        });

    });
}

function Operaciones (Dato1,Dato2,op){
    console.log("Operacion: ",Dato1,Dato2,op);
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


