/**
 * Created by Alejandro on 19/03/2015.
 */
function Peticion_Datos(objPeticion) {

    $.getJSON( 'http://banot.etsii.ull.es/alu4403/Vistac/Indicadores1.json', function( data ) {
        var URL = 'http://www.gobiernodecanarias.org/istac/api/indicators/api/indicators/v1.0/indicators/';
        var Indicadores;
        var JSONindi = data;
        var Operadores;
        var IdicadoresURL = [];
        var DatosPeticiones = [];
        var DatosFinales =[];
        var RepURL = 1;

        //miramos si el indicador es derivado.
        if( data[objPeticion.IndicadorNum].derivado == "NO") {
            //añadimos indicador.
            URL += objPeticion.Indicador + '/data?';
        }

        else{
            Indicadores = data[objPeticion.IndicadorNum].calculo.replace("(",'').replace(")",'').split(/\*|\+|\//);
            Operadores = data[objPeticion.IndicadorNum].calculo.replace("(",'').replace(")",'').match(/\W/g);
            console.log(Operadores);
            for(var i=0; i<Indicadores.length; i++)
                IdicadoresURL.push(URL + Indicadores[i] + '/data?');
            RepURL = Indicadores.length
        }

        var z =0;
        while(z < RepURL){

            //En caso de ser derivado tenemos que repetir una serie de peticiones por eso cambiamos url.
            if( data[objPeticion.IndicadorNum].derivado == "SI")
                URL = IdicadoresURL[z];

            //añadimos Representacion (si la hubiese)
            if (objPeticion.RepresentacionTime != null || objPeticion.RepresentacionGeo != null) {
                URL += URLRepresentacion(objPeticion);
            }
            URL += '&';
            var Gtime;
            if (data[objPeticion.IndicadorNum].time == "MENSUAL")
                Gtime = "MONTHLY";
            else
                Gtime = "YEARLY";
            URL += 'granularity==GEOGRAPHICAL%5BMUNICIPALITIES%5D%3ATIME%5B' + Gtime + '%5D';

            URL += '&api_key=special-key';
            IdicadoresURL[z]=URL;
            z++;
        }

        //Peticion en caso de no derivado.
        if( data[objPeticion.IndicadorNum].derivado == "NO") {
            $.ajax({
                type: "GET",
                url: URL,
                dataType: "jsonp",
                jsonp: "_callback",
                success: function (data) {

                    $("#TituloDatos").empty();
                    $("#titulograficas").empty();

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
                        var ArrayResultados = data.observation;
                        var n = ArrayResultados.length;

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
                            CrearBarChart(data, objPeticion, ArrayORdenGEO);
                        })


                        var acumularflag = false;
                        if(JSONindi[objPeticion.IndicadorNum].acumular == "SI")
                            acumularflag = true;

                        var z = 0;
                        for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                            var acumulado =0;
                            var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                            $("#Cuerpo").append('<tr id="' + objPeticion.RepresentacionGeo[index] + '"><th id="TituloVertical">' + objPeticion.RepresentacionGeonom[index] + '</th></tr>');
                            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                                if(JSONindi[objPeticion.IndicadorNum].acumular == "SI") {
                                    acumulado += parseFloat(ArrayResultados[z]);
                                    $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + acumulado +  '</th>');
                                }
                                else
                                $("#" + objPeticion.RepresentacionGeo[index]).append('<th>' + ArrayResultados[z] + '</th>');
                                z = z + MeasureIndex ;
                            }
                        }

                        $("#TablaDatos").table("refresh");

                    }

                    CrearBarChart(data, objPeticion, ArrayORdenGEO,acumularflag);
                }
            })
        }

        //peticiones en el caso de sí derivado.
        else {
            console.log(IdicadoresURL);

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
                               var ArrayResultados = data.observation;
                               var n = ArrayResultados.length;
                               var ArrayDatosIndicador = []

                               /*
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
                                CrearBarChart(data, objPeticion, ArrayORdenGEO);
                                })
                                */


                               var z = 0;
                               for (var i = 0; i < objPeticion.RepresentacionGeo.length; i++) {
                                   for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                                       ArrayDatosIndicador.push(ArrayResultados[z]);
                                       z = z + 3;

                                   }
                               }

                               DatosPeticiones.push(ArrayDatosIndicador);
                               console.log(DatosPeticiones);
                               $("#TablaDatos").table("refresh");

                           }

                           console.log("Indicadorlenght: " + Indicadores.length, "DatosPeticionesleght: " +DatosPeticiones[0].length );
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


                                   DatosFinales.push(DatoOPiqz / DatoOPderch)
                               }
                           }

                           console.log(DatosFinales);

                           // CrearBarChart(data, objPeticion, ArrayORdenGEO);
                       }
                   }).done(function(){
                       PericionAJAXData(IdicadoresURL[p+1],p+1);
                   });
               }

        }
    })
}

function Operaciones (Dato1,Dato2,op){
    console.log(Dato1,Dato2,op);
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




