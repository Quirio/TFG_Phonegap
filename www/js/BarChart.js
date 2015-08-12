
function CrearBarChart(data,objPeticion,ArrayORdenGEO,Acumular,derivado)
{
    //Gráfico de barras
    $("#GraficaBarras").empty();
    var datos = [];
    var leyenda = [];


    if(!derivado) {

        var obser = data.observation;
        console.log("Entro en no derivados");
        var MeasureIndex = data.dimension.MEASURE.representation.size;
        var z = MeasureIndex-1;
        for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
            var datgeo = []
            var acumulado = 0;
            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                if (Acumular) {
                    acumulado += parseInt(obser[z]);
                    datgeo.push(acumulado);
                    //console.log(acumulado);
                }
                else {
                    datgeo.push(parseInt(obser[z]));
                   // console.log(parseInt(obser[z]));
                }

                z = z + MeasureIndex;

            }
            datos.push(datgeo);

            var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
            leyenda.push({label: objPeticion.RepresentacionGeonom[index]});
        }
    }


    else{
        var z = 0;
        for (var i = 0; i < objPeticion.RepresentacionGeonom.length; i++) {
            var datgeo = []
            var acumulado = 0;
            for (var j = 0; j < objPeticion.RepresentacionTime.length; j++) {
                if (Acumular) {
                    acumulado += parseInt(data[z]);
                    datgeo.push(acumulado);
                }
                else {
                    datgeo.push(parseInt(data[z]));
                }

                z++;

            }
            datos.push(datgeo);
            var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
            leyenda.push({label: objPeticion.RepresentacionGeonom[index]});
        }
    }

    console.log(datos);
    var ticks = objPeticion.RepresentacionTime;

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

    var data1 = []
    var IslaSeleccionada = $("#SelectComp").val().split("%")[0];
    var AñoSeleccionado = $("#SelectComp").val().split("%")[1];


    //Rellenamos el array de datos.
    for(var i= 0; i<ArrayordenMun.length; i++){
        console.log(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].CodigoIsla);
        if(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].CodigoIsla == IslaSeleccionada ) {
            data1[i] = [NombreMun[i] ,parseFloat(ArrayDatosFinal[ArrayordenMun[i]][AñoSeleccionado].Dato)];
        }
    }

    //Añadimos el grupo extra de otros.
    var sum = 0;
    for(var i= 0; i<data1.length; i++){
        sum += data1[i][1];
    }
    var datoextra = 100 - sum;
    console.log("Porcentaje de otros: " , datoextra);

    if(parseInt(datoextra) != 0 && parseInt(datoextra) != 1)
        data1[data1.length] = ["Otros", datoextra];

    var data = [
        ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
        ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
    ];

    console.log(data1);

    var plot1 = jQuery.jqplot ('GraficaBarras', [data1],
        {
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