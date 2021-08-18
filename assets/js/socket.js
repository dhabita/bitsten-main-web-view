 var socket_used =
     SOCKET_URL == 'market' ||
     SOCKET_URL == 'exchange';


 var urlm = "wss://socket.bitsten.com:8443/market";


 var i = 0;
 var sock = {
     ws: function(url) {
         var s = new WebSocket(url);
         if (i == 0) {
             $("body").append('<div id="info_socket" style="background-color:#212529;position:fixed;bottom:0;right:50px;padding:5px;font-size:11px;color:white;z-index:4000;"></div>');
         }
         i++;
         return s;
     },

     open: function(s, f) {
         s.onopen = function(evt) {
             console.log("conected");
             $("#info_socket").html('<i class="bi bi-wifi"></i> Connected');
             openc();
             if (typeof f !== "undefined") {
                 f(evt);
             }
         };



     },
     close: function(s, c) {
         s.onclose = function(evt) {
             $("#info_socket").html("Connecting...");
             c(evt);
         };
     },
     msg: function(s, msg) {
         s.onmessage = function(evt) {
             // $("#info_socket").html('<i class="bi bi-wifi"></i> Connected');
             msg(evt);
         };
     },
     send: function(s, msg) {
         s.send(msg);
     },
 };
 /*
 var sse = {
     initialize: function (url) {
         var source = new EventSource(url);
         return source;
     },
     msg: function (s, msg) {
         s.onmessage = function (event) {
             msg(event.data);
         };
     },
 };
 */


 var soket = sock.ws(urlm);
 var online = 0;

 function connecting() {
     if (!socket_used) return;
     if (online) {
         soket.close();
         console.log("Connecting..");
         soket = sock.ws(urlm);
     }

     sock.msg(soket, function(a) {
         //console.log(a.data);
         router(a.data);
     });

     sock.open(soket, function(e) {});
     sock.close(soket, function(e) {
         console.log(e);
     });

 }

 connecting();
 online = 1;



 //only use triger on this list
 var router_used = ['market', 'orderbook', 'market_list', 'chart'];

 function isUsed(a) {
     var r = false;
     router_used.forEach((b) => {
         //console.log(a);
         if (a.includes(b)) { r = true; }
     });
     return r;
 }


 var last_time_connect = 0;
 //convert data from ws to object js
 function router(data) {

     var date_now = Date.now();
     last_time_connect = date_now;

     if (!isUsed(data)) return;
     if (data.includes('triger')) {} else return;
     var dt = JSON.parse(data);
     var triger = dt.triger;

     //all market detail
     if (triger[0] == "market" && triger.length == 1) {
         // console.log(dt); // go to app
         all_market(dt);
     }
     //one market detail
     if (triger[0] == "market" && triger.length > 1) {
         // console.log(dt); // go to app

     }

     //one market orderbook
     if (triger[0] == "orderbook") {
         // console.log(dt); // go to app
         orderbook(dt);
     }

     //one chart
     if (triger[0] == "chart") {
         // console.log(dt); // go to app
         chart_update_x(dt);
     }

     //list market_show only
     if (triger[0] == "market_list") {
         console.log(dt); // go to app
     }

 }




 //get all market
 function getallmarket() {
     if (!socket_used) return;
     sock.send(soket, 'market');
 }
 if (SOCKET_URL == 'market' || SOCKET_URL == 'exchange') {
     setInterval(getallmarket, 30000);
 }

 function openc() {
     console.log(socket_used);
     if (!socket_used) return;
     console.log("load data");
     getallmarket();
     if (SOCKET_URL == 'exchange') {
         getorderbook();
         gethash();
     }

 }




 var volume_this_pair = 0;
 var last_price = {};


 function orderbook(d) {
     let ma = has.split("_")[1];
     //console.log(ma);

     var divider = 100;
     if (ma == "idrt") divider = 100000;
     if (ma == "bst") divider = 500;
     if (ma == "mbusd") divider = 5000000;
     if (ma == "wbst") divider = 500;
     if (!d.data) return;
     var lp = last_price[d.triger[1]];

     if ('s' in d.data)
         d.data.s.forEach(f => {
             var p = f.p * 100000000;


             if (lp > 0.001) p = f.p * 1000000;
             if (lp > 1) p = f.p * 100000;
             if (lp > 1000) p = f.p * 1000;
             if (lp > 1000000) p = f.p;

             p = number_format(p, 0, 1);




             var bgg = (f.p * f.a) / divider;
             bgg = Math.floor(bgg);
             bgg = Math.max(bgg, 1);
             bgg = Math.min(bgg, 7);


             var tddata = '\
            <td id="book_sell_price_' + p + '" class="red   col-4 pl-2 " onCLick="clicker.getPrice($(this).text())">' + number_format(f.p) + '</td>\
                <td class=" text-right col-4" id="amount-' + p + '" onCLick="clicker.getAmount($(this).text())">' + number_format(f.a) + '</td>\
                <td class=" pr-2 text-right col-4" onCLick="clicker.getAll($(\'#book_sell_price_' + p + '\').text(),$(\'#amount-' + p + '\').text())">' + number_format(f.a * f.p) + '</td>';
             var trdata = '\
            <tr id="book_sell_' + p + '"  class="row red-bg-' + bgg + ' old-content"  style="margin:0px" >\
            ' + tddata + '\
            </tr>';

             if ($('#book_sell_' + p).length) {
                 $('#book_sell_' + p).html(tddata);
             } else {

                 var id_up = "";
                 var id = 0;
                 $("#book_sell tr").each(function() {
                     id = this.id.replace("book_sell_", "") * 1;

                     if (id > p)
                         id_up = this.id;

                     // console.log(id + " "+ p + " "+ id_up);

                 });



                 if (id > 0 && f.a * f.p > 0.0000001)
                     $('#' + id_up).after(trdata);
             }


         })


     if ('b' in d.data)
         d.data.b.forEach(f => {
             var p = f.p * 100000000;
             if (lp > 0.001) p = f.p * 1000000;
             if (lp > 1) p = f.p * 100000;
             if (lp > 1000) p = f.p * 1000;
             if (lp > 1000000) p = f.p;

             p = number_format(p, 0, 1);
             var bgg = (f.p * f.a) / divider;
             bgg = Math.floor(bgg);
             bgg = Math.max(bgg, 1);
             bgg = Math.min(bgg, 7);

             var tddata = '\
            <td id="book_buy_price_' + p + '" class="green  pl-2 col-4" onCLick="clicker.getPrice($(this).text())">' + number_format(f.p) + '</td>\
                <td id = "amount-' + p + '" class=" text-right   col-4" onCLick="clicker.getAmount($(this).text())">' + number_format(f.a) + '</td>\
                <td  class="text-right  pr-2 col-4" onCLick="clicker.getAll($(\'#book_buy_price_' + p + '\').text(),$(\'#amount-' + p + '\').text())">' + number_format(f.a * f.p) + '</td>';
             var trdata = '\
            <tr id="book_buy_' + p + '"  class="green-bg-' + bgg + ' row old-content"  style="margin:0px"  >\
            ' + tddata + '\
            </tr>';

             if ($('#book_buy_' + p).length) {
                 $('#book_buy_' + p).html(tddata);
             } else {

                 var id_up = "";
                 var id = 0;
                 var fin = 0;
                 $("#book_buy tr").each(function() {
                     id = this.id.replace("book_buy_", "") * 1;

                     if (id < p && !fin) {
                         id_up = this.id;
                         fin = 1;
                     }

                     // console.log(id + " "+ p + " "+ id_up);

                 });



                 if (id > 0 && f.a * f.p > 0.000001 && fin)
                     $('#' + id_up).before(trdata);
             }



         })

     if ('h' in d.data)
         d.data.h.forEach(f => {
             var c = 'green';
             if (f.m == 2) c = 'red';
             var tddata = '\
            <td  class="col-4 pl-2 ' + c + '" >' + f.d + '</td>\
                <td class="col-4 text-right " > ' + number_format(f.p) + '</td>\
                <td class="col-4 text-right pr-2"  >' + number_format(f.t) + '</td>';

             var trdata = '\
            <tr  class=" old-content row"  style="margin:0px" >\
            ' + tddata + '\
            </tr>';


             $('#book_history').append(trdata);



         })
     $("#book_sell").animate({
         scrollTop: 10000
     }, 1000);


     $('.book-loading').hide();
 }



 var WS_VOLUME_DATA = [];
 var WS_CHART_DATA = [];

 function chart_update_x(d) {

     WS_VOLUME_DATA = [];
     WS_CHART_DATA = [];

     //{c: 138.1, t: "2021-07-28T23:38:35.000Z", d: 54420, v: 24.68001}

     var x = 0;
     var last_p = 0;

     if (!d.data) return;
     d.data.forEach(e => {
         x++;
         // if(x>10) return;
         var dd = new Date(e.t);
         dd = Date.parse(dd) / 1000;



         WS_CHART_DATA.push({ time: dd, value: e.c });
         var colv = 'rgba(0, 250, 136, 0.7)';
         if (last_p < e.c) colv = 'rgba(250,0,10,0.7)';

         last_p = e.c;

         WS_VOLUME_DATA.push({ time: dd, value: e.v, color: colv }, );
     });


     WS_VOLUME_DATA = WS_VOLUME_DATA.reverse();
     WS_CHART_DATA = WS_CHART_DATA.reverse();


     //setTimeout(chart_update,5);

     //chart_update();    
 }

 //fill all markets
 var rate_to_usd = {};

 function all_market(d) {

     d.data.forEach(e => {

         last_price[e.market_show] = e.last_price;

         //console.log(e);
         var change = (e.bid - e.open) / (e.open * 0.01);
         var col = 'green';
         if (change < 0) col = 'red';
         var coin = e.market_show.split("_")[0];
         var market = e.market_show.split("_")[1];

         if (market == "usdt") rate_to_usd[coin] = e.bid;
         if (market == "idrt" && coin == "usdt") rate_to_usd['idrt'] = 1 / e.bid;
         rate_to_usd['mbusd'] = 1 / 1000000;
         //if (market == "usdt" && coin == "bst") rate_to_usd['idrt'] = 1 / e.bid;

         var m1 = market;
         var dnone = "display:none";

         if (e.volume < 500 && market == "usdt") market = "alt";
         else
         if (e.volume < 5000000 && market == "idrt") market = "alt";
         else
         if (e.volume < 50000000 && market == "mbusd") market = "alt";
         else
         if (e.volume < 500000 && market == "wbst") market = "alt";
         else
         if (e.volume < 500000 && market == "bst") market = "alt";


         var h = window.location.hash.replace("#", "");
         if (h == e.market_show) {
             volume_this_pair = e.volume;
             var price = document.querySelectorAll('.last_price_usd');
             if (m1 == "usdt")
                 for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.bid);
             if (m1 == "idrt")
                 for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.bid * rate_to_usd['idrt']);
             if (m1 == "wbst")
                 for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.bid * rate_to_usd['bst']);
             if (m1 == "mbusd")
                 for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.bid * rate_to_usd['mbusd']);

             var price = document.querySelectorAll('.last_price');
             for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.bid);
             var price = document.querySelectorAll('.last_high');
             for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.high);
             var price = document.querySelectorAll('.last_low');
             for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.low);
             var price = document.querySelectorAll('.last_volume');
             for (var i = 0; i < price.length; i++) price[i].innerHTML = number_format(e.volume);
             var price = document.querySelectorAll('.last_change');
             for (var i = 0; i < price.length; i++) price[i].innerHTML = "<span class=' ob-heading-big " + col + "' >" + number_format(change, 2) + "%</span>";
         }

         var pp = document.querySelectorAll('.price-' + e.market_show);
         //console.log(price);
         for (var i = 0; i < pp.length; i++) pp[i].innerHTML = number_format(e.bid);

         var cc = document.querySelectorAll('.change-' + e.market_show);
         //console.log(price);
         for (var i = 0; i < cc.length; i++) cc[i].innerHTML = (change > 0 ? "+" : "") + number_format(change, 2);

         if (change < 0) {
             $('.color_change-' + e.market_show).addClass("red");
             $('.color_change-' + e.market_show).removeClass("green");
         } else {
             $('.color_change-' + e.market_show).addClass("green");
             $('.color_change-' + e.market_show).removeClass("red");
         }




         var tddata = '\
<td  ><i class="icon ion-md-star"></i>  <img class="show-xs" src="https://f1.bitsten.com/assets/images/logo/' + coin + '.png"  width="20px"  > ' + coin.toUpperCase() + "<span class='hide-xs'>_" + m1.toUpperCase() + "</span>" + '</td>\
<td class=" hide-xs"><img src="https://f1.bitsten.com/assets/images/logo/' + coin + '.png"  width="20px" > ' + coin.toUpperCase() + '</td>\
<td class=" text-right  ">' + number_format(e.bid) + '</td>\
<td class=" text-right ' + col + '">' + number_format(change, 2) + '%</td>\
<td class=" text-right hide-xs">' + number_format(e.high) + '</td>\
<td class=" text-right  hide-xs ">' + number_format(e.low) + '</td>\
<td class=" text-right hide-xs " >' + number_format(e.volume) + '</td>';

         var tddatam = '\
<td   class="col-5 pl-4"><i class="icon ion-md-star"></i> <img src="https://f1.bitsten.com/assets/images/logo/' + coin + '.png"  width="20px"  > ' + coin.toUpperCase() + '</td>\
<td   class="col-4 text-right">' + number_format(e.bid) + '</td>\
<td   class="col-3 text-center ' + col + '">' + number_format(change, 2) + '%</td>';

         var row = "";
         if (SOCKET_URL == 'exchange') {
             tddata = tddatam;
             row = "row";
         }



         var trdata = '\
<tr id="market-id-' + number_format(e.id, 0) + '" class=" ' + row + ' ' + market + ' all-coin " style="width:100%; cursor:pointer; ' + dnone + '" onCLick="goto(\'' + e.market_show + '\')">\
' + tddata + '\
</tr>';

         if ($('#market-id-' + e.id).length) {
             $('#market-id-' + e.id).html(tddata);
         } else
             $('#all_markets_table tbody').append(trdata);

     });


     $("#load-markets").hide();
     show((getCookie("market") != "") ? getCookie("market") : "usdt");
 }

 function show(a) {
     //  console.log(a);

     $(".all-coin").hide();
     $("." + a).show();
     $(".ht").removeClass("bg-white");
     $(".ht-" + a).addClass(" bg-white ");
     setCookie("market", a, 100);
 }



 function goto(a) {
     var u = window.location.href;
     if (u.indexOf("exchange") != -1) {
         window.location.hash = a;
     } else
         window.location.href = "exchange#" + a;

     gethash();

 }

 var has = "";

 function getorderbook() {
     sock.send(soket, 'orderbook.' + has);
     sock.send(soket, 'chart.' + has);
 }

 var hash = "";
 var inter = [];

 function gethash() {
     var h = window.location.hash;
     if (h == "" || h == "#") {
         window.location.hash = "bst_usdt";
         h = "#bst_usdt";
     }
     if (hash == h) return;
     hash = h;
     //update data


     var m = document.querySelectorAll('.to0');
     for (var i = 0; i < m.length; i++) m[i].innerHTML = "0";
     var m = document.querySelectorAll('.to0i');
     for (var i = 0; i < m.length; i++) m[i].value = "0";

     $('.old-content').remove();
     $('.book-loading').show();

     $("#book_sell").animate({
         scrollTop: 0
     }, 1000);

     var coin = h.split("_")[0].replace("#", "");
     var market = h.split("_")[1];

     openorder(coin + "_" + market);

     var m = document.querySelectorAll('.coin-name');
     for (var i = 0; i < m.length; i++) m[i].innerHTML = coin;

     var m = document.querySelectorAll('.market-name');
     for (var i = 0; i < m.length; i++) m[i].innerHTML = market;


     var m = document.querySelectorAll('.class_balance_market');
     for (var i = 0; i < m.length; i++) {
         $(m[i]).removeClass();
         $(m[i]).addClass("class_balance_market");
         $(m[i]).addClass("balance_" + market);

     }

     var m = document.querySelectorAll('.class_balance_coin');
     for (var i = 0; i < m.length; i++) {
         $(m[i]).removeClass();
         $(m[i]).addClass("class_balance_coin");
         $(m[i]).addClass("balance_" + coin);
     }


     has = coin + "_" + market;
     clearInterval(inter);
     inter = setInterval(getorderbook, 20000);
     getorderbook();
     getallmarket();

     balance(coin);
     balance(market);

 }





 //Check socket
 setInterval(function() {
     var date_now = Date.now();
     // console.log((date_now-last_time_connect)/1000);
     //  soket.close();
     if ((date_now - last_time_connect) / 1000 > 20) connecting();
 }, 10000)

 show((getCookie("market") != "") ? getCookie("market") : "usdt");