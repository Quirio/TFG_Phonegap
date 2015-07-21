
function CrearBarChart(data,objPeticion,ArrayORdenGEO,Acumular)
{
    //Gráfico de barras
    $("#GraficaBarras").empty();
    var obser = data.observation;
    var MeasureIndex = data.dimension.MEASURE.representation.size;
    var datos = [];
    var leyenda = [];
    var z = 0;
    for(var i=0; i<objPeticion.RepresentacionGeonom.length;i++){
        var datgeo = []
        var acumulado = 0;
        for(var j=0; j<objPeticion.RepresentacionTime.length;j++){
            if(Acumular){
                acumulado += parseInt(obser[z]);
                datgeo.push(acumulado);
                console.log(acumulado);
            }
            else {
                datgeo.push(parseInt(obser[z]));
                console.log(parseInt(obser[z]));
            }

            z = z + MeasureIndex;

        }
        datos.push(datgeo);
        var index = objPeticion.RepresentacionGeo.indexOf(ArrayORdenGEO[i]);
        leyenda.push({label:objPeticion.RepresentacionGeonom[index]});
    }

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

function CrearLineChart(/*data,objPeticion*/){

}