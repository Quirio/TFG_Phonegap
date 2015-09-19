
function CrearBarChart(data,objPeticion,ArrayORdenGEO,Acumular,derivado,Legendaflag,barflag,lineflag)
{
    $("#FooterDentro").show();
    //Gráfico de barras
    $("#GraficaBarras").empty();
    var datos = [];
    var leyenda = [];



    if(!derivado) {

        if(!Acumular) {
            var obser = data.observation;
            var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;
            //console.log("Entro en no derivados");
            var MeasureIndex = data.dimension.MEASURE.representation.size;
            var PosAbsolute = data.dimension.MEASURE.representation.index.ABSOLUTE;


            for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
                var datgeo = []
                var index = ArrayGeoRepresentacion[ArrayORdenGEO[i]];
                var z = PosAbsolute + (index * objPeticion.RepresentacionTime.length * MeasureIndex);
                var indexnom = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                    if (obser[z] != "." && obser[z] != NaN)
                        datgeo.push(parseFloat(obser[z]));
                    else
                        datgeo.push(0);
                    // console.log(parseInt(obser[z]));
                    z = z + MeasureIndex;

                }
                datgeo.reverse();
                datos.push(datgeo);

                leyenda.push({label: objPeticion.RepresentacionGeonom[indexnom]});
            }
        }

        else{
            var z =0;
            for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
                var datgeo = [];
                var indexnom = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
                for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                    datgeo.push(parseFloat(data[z]));
                    z++;
                }
                datos.push(datgeo);

                leyenda.push({label: objPeticion.RepresentacionGeonom[indexnom]});

            }
        }
        console.log("ARRAY DE GRAFICA", datos);
    }


    else{
        var z = 0;
        for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
            var datgeo = []
            var acumulado = 0;
            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                if (Acumular) {
                    if(data[z] != "." && data[z] != NaN) {
                        acumulado += parseFloat(data[z]);
                        datgeo.push(acumulado);
                    }
                    else{
                        acumulado += parseInt(0);
                        datgeo.push(acumulado);
                    }
                }
                else {
                    if(data[z] != "." && data[z] != NaN)
                        datgeo.push(parseFloat(data[z]));
                    else
                        datgeo.push(0);
                }

                z++;

            }
            datgeo.reverse();
            datos.push(datgeo);
            var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
            leyenda.push({label: objPeticion.RepresentacionGeonom[index]});
        }
    }

    var ticks = []
    if(objPeticion.RepresentacionTime[0].indexOf("M") != -1) {
        for (var i = 0; i < objPeticion.RepresentacionTime.length; i++) {
            var Meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            var num = parseInt(objPeticion.RepresentacionTime[i].split("M")[1]) - 1;
            var nombre = objPeticion.RepresentacionTime[i].split("M")[0] + Meses[num];
            ticks[i]= nombre;
        }
    }
    else
        var ticks = objPeticion.RepresentacionTime;

    if(!Acumular)
        ticks.reverse();

    if(Legendaflag==true) {

        if(barflag) {
            var plot1 = $.jqplot('GraficaBarras', datos, {


                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                series: leyenda,
                legend: {
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    show: true,
                    placement: 'outsideGrid',
                    rendererOptions: {
                        numberRows: 30
                        // number
                    },
                    location: 'w'
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: "%#.2f"}
                    }
                }
            });
        }

        //Gráfico de Líneas
        $("#GraficaLineas").empty();

        if(lineflag) {
            $.jqplot('GraficaLineas', datos, {
                series: leyenda,
                legend: {
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    show: true,
                    placement: 'outsideGrid',
                    rendererOptions: {
                        numberRows: 30
                        // number
                    },
                    location: 'w'
                },
                /* legend: {
                 show: true,

                 },*/
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: "%#.2f"}
                    }
                }
            });
        }
        $("#GraficaLineas .jqplot-table-legend").hide();
    }

    else{
        if(barflag) {
            var plot1 = $.jqplot('GraficaBarras', datos, {


                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {fillToZero: true}
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: "%#.2f"}
                    }
                }
            });
        }

        //Gráfico de Líneas
        $("#GraficaLineas").empty();
        if(lineflag) {
            $.jqplot('GraficaLineas', datos, {

                /* legend: {
                 show: true,

                 },*/
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: "%#.2f"}
                    }
                }
            });
        }
    }
    $(".jqplot-table-legend").css( "top", "5%" );

}

function CrearCircularChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,leyendaflag){
    $("#GraficaC").empty();
    var data1 = []
    var IslaSeleccionada = $("#SelectComp").val().split("%")[0];
    var AñoSeleccionado = $("#SelectComp").val().split("%")[1];
    var leyenda = NombreMun;


    //Rellenamos el array de datos.
    var l = 0;
    for(var i= 0; i<ArrayordenMun.length; i++){
        console.log(ArrayDatosFinal);

        if(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].CodigoIsla == IslaSeleccionada ) {

            //console.log("Codigo Municipio: ",ArrayordenMun[i]);
            //console.log("Isla Seleccionada: ",IslaSeleccionada);
            //console.log("Nombre Municipio: ",NombreMun[i]);
            //console.log("Dato: ",ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato);
            data1[l] = [NombreMun[i] ,parseFloat(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato)];
            console.log("Datos de piechart: ", data1);
            l++;
        }
    }

    //Añadimos el grupo extra de otros.
    var sum = 0;
        for(var i= 0; i<data1.length; i++){
        sum += data1[i][1];
    }
    var datoextra = 100 - sum;

    if(parseInt(datoextra) != 0 && parseInt(datoextra) != 1)
        data1[data1.length] = ["Otros", datoextra];


    if(leyendaflag) {
        var plot1 = jQuery.jqplot('GraficaC', [data1],
            {
                series: leyenda,
                legend: {
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    show: true,
                    placement: 'outsideGrid',
                    rendererOptions: {
                        numberRows: 30
                        // number
                    },
                    location: 'w'
                },
                seriesDefaults: {
                    // Make this a pie chart.
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                        // Put data labels on the pie slices.
                        // By default, labels show the percentage of the slice.
                        showDataLabels: true
                    }
                }

            });
    }

    else{
        var plot1 = jQuery.jqplot('GraficaC', [data1],
            {
              seriesDefaults: {
                    // Make this a pie chart.
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                        // Put data labels on the pie slices.
                        // By default, labels show the percentage of the slice.
                        showDataLabels: true
                    }
                }

            });
    }

    $(".jqplot-table-legend").css( "top", "5%" );
}

function CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios,leyendaflag){
    $("#GraficaC").empty();
    var IslaSeleccionada = $("#SelectComp").val().split("%")[0];
    var AñoSeleccionado = $("#SelectComp").val().split("%")[1];
    var IndiceTiempo = RepresentacionTIME.indexOf(AñoSeleccionado);
    var DatoIsla;
    var NombreIsla;
    var leyenda = [];


    var l = 0;
    var j=0;
    var data = [];
    for(var i= 0; i<ArrayordenMun.length; i++){

        console.log(ArrayordenMun[i]);
        if(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].CodigoIsla == IslaSeleccionada ) {
            //console.log("Codigo Municipio: ",ArrayordenMun[i]);
            //console.log("Isla Seleccionada: ",IslaSeleccionada);
            //console.log("Nombre Municipio: ",NombreMun[i]);
            //console.log("Dato: ",ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato);
            NombreIsla = ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].NombreIsla;
            leyenda.push({label: NombreMun[i]})
            DatoIsla = parseFloat(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato);
            data[l] = [parseFloat(DatosMunicipios[j+IndiceTiempo])];
            j+=RepresentacionTIME.length;
            l++;
        }
    }

    data.push([DatoIsla]);
    leyenda.push({label: NombreIsla});
    console.log("Data: ",data);
    console.log("leyenda",leyenda);

    if(leyendaflag) {
        var plot2 = $.jqplot('GraficaC', data, {
            series: leyenda,
            legend: {
                renderer: $.jqplot.EnhancedLegendRenderer,
                show: true,
                placement: 'outsideGrid',
                rendererOptions: {
                    numberRows: 30

                    // number
                },
                location: 'w'
            },
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                pointLabels: {show: true}
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    //ticks: ticks
                },
                yaxis: {
                    pad: 1.05,
                    tickOptions: {formatString: "%#.2f"}
                }
            },
            highlighter: {show: false}
        });
    }
    else{
        var plot2 = $.jqplot('GraficaC', data, {

            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                pointLabels: {show: true}
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    //ticks: ticks
                },
                yaxis: {
                    pad: 1.05,
                    tickOptions: {formatString: "%#.2f"}
                }
            },
            highlighter: {show: false}
        });
    }

    $(".jqplot-table-legend").css( "top", "5%" );

}

