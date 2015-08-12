
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
        for(var i= 0; i<ArrayordenMun; i++){
            for(var j=0; j< RepresentacionTIME.length; j++){

            }
        }

        var data = [
            ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
            ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
        ];

    console.log(data);

        var plot1 = jQuery.jqplot ('GraficaBarras', [data],
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