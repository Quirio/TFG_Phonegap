
function CrearBarChart(data,objPeticion,ArrayORdenGEO,Acumular,derivado)
{
    //Gráfico de barras
    $("#GraficaBarras").empty();
    var datos = [];
    var leyenda = [];


    if(!derivado) {

        var obser = data.observation;
        var ArrayGeoRepresentacion = data.dimension.GEOGRAPHICAL.representation.index;
        //console.log("Entro en no derivados");
        var MeasureIndex = data.dimension.MEASURE.representation.size;


        for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
            var datgeo = []
            var acumulado = 0;
            var index = ArrayGeoRepresentacion[ArrayORdenGEO[i]];
            var z = index*(objPeticion.RepresentacionTime.length*MeasureIndex);
            var indexnom = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {

                if (Acumular) {
                    if(obser[z] != "." && obser[z] != NaN) {
                        acumulado += parseInt(obser[z]);
                        datgeo.push(acumulado);
                        //console.log(acumulado);
                    }

                    else{
                        acumulado += 0;
                        datgeo.push(acumulado);
                    }
                }
                else {
                    if(obser[z] != "." && obser[z] != NaN)
                        datgeo.push(parseInt(obser[z]));
                    else
                        datgeo.push(0);
                   // console.log(parseInt(obser[z]));
                }

                z = z + MeasureIndex;

            }
            datgeo.reverse();
            datos.push(datgeo);

            leyenda.push({label: objPeticion.RepresentacionGeonom[indexnom]});
        }
    }


    else{
        var z = 0;
        for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
            var datgeo = []
            var acumulado = 0;
            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                if (Acumular) {
                    if(data[z] != "." && data[z] != NaN) {
                        acumulado += parseInt(data[z]);
                        datgeo.push(acumulado);
                    }
                    else{
                        acumulado += parseInt(0);
                        datgeo.push(acumulado);
                    }
                }
                else {
                    if(data[z] != "." && data[z] != NaN)
                        datgeo.push(parseInt(data[z]));
                    else
                        datgeo.push(0);
                }

                z++;

            }
            datos.push(datgeo);
            var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
            leyenda.push({label: objPeticion.RepresentacionGeonom[index]});
        }
    }

    var ticks = objPeticion.RepresentacionTime;
    ticks.reverse();

    var plot1 = $.jqplot('GraficaBarras', datos , {


        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {fillToZero: true}
        },
        series:leyenda,
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            yaxis: {
                pad: 1.05,
                tickOptions: {formatString: '%d'}
            }
        }
    });

    //Gráfico de Líneas
    $("#GraficaLineas").empty();
    $.jqplot ('GraficaLineas', datos,{
        series:leyenda,
        legend: {
            show: true,
            placement: 'outsideGrid'
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            },
            yaxis: {
                pad: 1.05,
                tickOptions: {formatString: '%d'}
            }
        }
    });

}

function CrearCircularChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME){
    $("#GraficaC").empty();
    var data1 = []
    var IslaSeleccionada = $("#SelectComp").val().split("%")[0];
    var AñoSeleccionado = $("#SelectComp").val().split("%")[1];
    var leyenda = NombreMun;


    //Rellenamos el array de datos.
    var l = 0;
    for(var i= 0; i<ArrayordenMun.length; i++){

        if(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].CodigoIsla == IslaSeleccionada ) {

            //console.log("Codigo Municipio: ",ArrayordenMun[i]);
            //console.log("Isla Seleccionada: ",IslaSeleccionada);
            //console.log("Nombre Municipio: ",NombreMun[i]);
            //console.log("Dato: ",ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato);
            data1[l] = [NombreMun[i] ,parseFloat(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato)];
            l++;
        }
    }

    //Añadimos el grupo extra de otros.
    var sum = 0;
        for(var i= 0; i<data1.length; i++){
        console.log(i);
        sum += data1[i][1];
    }
    var datoextra = 100 - sum;

    if(parseInt(datoextra) != 0 && parseInt(datoextra) != 1)
        data1[data1.length] = ["Otros", datoextra];


    var plot1 = jQuery.jqplot ('GraficaC', [data1],
        {
            series:leyenda,
            legend: {
                show: true,
                placement: 'outsideGrid'
            },
            seriesDefaults: {
                // Make this a pie chart.
                renderer: jQuery.jqplot.PieRenderer,
                rendererOptions: {
                    // Put data labels on the pie slices.
                    // By default, labels show the percentage of the slice.
                    showDataLabels: true
                }
            },
            legend: { show:true, location: 'e' }
        }
    );
}

function CrearBarrasCOMChart(ArrayDatosFinal,IslasSelect,Islas,CodeIslas,ArrayordenMun,NombreMun,RepresentacionTIME,DatosMunicipios){
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

    var plot2 = $.jqplot('GraficaC', data, {
        series:leyenda,
        legend: {
            show: true,
            location: 'e',
            placement: 'outsideGrid'
        },
        seriesDefaults:{
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer
                //ticks: ticks
            }
        },
        highlighter: { show: false }
    });

}