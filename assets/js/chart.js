if (SOCKET_URL == 'exchange') {

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
        grid: {
            /*
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



    function chart_update() {
        //  console.log(WS_CHART_DATA);
        //  console.log(WS_VOLUME_DATA);


        volumeSeries.setData(WS_VOLUME_DATA);
        areaSeries.setData(WS_CHART_DATA);
        var pre = 8;
        var minm = 0.00000001;
        if (WS_CHART_DATA.length > 0) {

            var lp = WS_CHART_DATA[0].value;

            if (lp > 0.001) {
                pre = 6;
                minm = 0.000001;
            }
            if (lp > 0.01) {
                pre = 5;
                minm = 0.00001;
            }
            if (lp > 0.1) {
                pre = 4;
                minm = 0.0001;
            }


            if (lp > 1) {
                pre = 3;
                minm = 0.001;
            }

            if (lp > 10) {
                pre = 2;
                minm = 0.01;
            }

            if (lp > 1000) {
                pre = 0;
                minm = 1;
            }


            areaSeries.applyOptions({
                priceFormat: {
                    type: 'price',
                    precision: pre,
                    minMove: minm,
                },
            });
        }



    }

    setInterval(chart_update, 1000);
}