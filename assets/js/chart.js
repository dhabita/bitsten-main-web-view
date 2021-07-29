if(SOCKET_URL == 'exchange'){ 

var ww = $("#main-chart").offsetWidth;
var chart = LightweightCharts.createChart("main-chart", {
  width: ww,
  height: 400,
	rightPriceScale: {
		scaleMargins: {
			top: 0.3,
			bottom: 0.25
		},
		borderVisible: false,
	},
	layout: {
		backgroundColor: '#fff',
		textColor: '#d1d4dc',
	},
	grid: {/*
		vertLines: {
			color: 'rgba(42, 46, 57, 0)',
		},
		horzLines: {
			color: 'rgba(42, 46, 57, 0.6)',
		},*/
	},
});

var areaSeries = chart.addAreaSeries({
	topColor: 'rgba(38,198,218, 0.56)',
	bottomColor: 'rgba(38,198,218, 0.04)',
	lineColor: 'rgba(38,198,218, 1)',
	lineWidth: 2,
});

var volumeSeries = chart.addHistogramSeries({
	color: '#26a69a',
	priceFormat: {
		type: 'volume',
	},
	priceScaleId: '',
	scaleMargins: {
		top: 0.8,
		bottom: 0,
	},
});

areaSeries.setData([
   
]);

volumeSeries.setData([
   
]);



function chart_update(){
  //  console.log(WS_CHART_DATA);
  //  console.log(WS_VOLUME_DATA);

  
    volumeSeries.setData(WS_VOLUME_DATA);
    areaSeries.setData(WS_CHART_DATA);
}

setInterval(chart_update,1000);
}