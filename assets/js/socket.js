 

 
var urlm = "wss://socket.bitsten.com:8443/market"; 


var i = 0;
var sock = {
    ws: function (url) {
        var s = new WebSocket(url);
        if (i == 0) {
            $("body").append('<div id="info_socket" style="background-color:#212529;position:fixed;bottom:0;right:50px;padding:5px;font-size:11px;color:white;z-index:4000;"></div>');
        }
        i++;
        return s;
    },
    
    open: function (s, f) {
        s.onopen = function (evt) {
            console.log("conected");
            $("#info_socket").html('<i class="bi bi-wifi"></i> Connected');
            openc();
            if (typeof f !== "undefined") {
                f(evt);
            }
        };

      

    },
    close: function (s, c) {
        s.onclose = function (evt) {
            $("#info_socket").html("Connecting...");
            c(evt);
        };
    },
    msg: function (s, msg) {
        s.onmessage = function (evt) {
           // $("#info_socket").html('<i class="bi bi-wifi"></i> Connected');
            msg(evt);
        };
    },
    send: function (s, msg) {
        s.send(msg);
    },
};
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



var soket = sock.ws(urlm);


sock.msg(soket,function(a){
    //console.log(a.data);
    router(a.data);
});

sock.open(soket,function(e){});
sock.close(soket,function(e){});
 

 
 

//only use triger on this list
var router_used = ['market','orderbook','market_list','chart'];
function isUsed(a){
    var r = false;
    router_used.forEach((b)=>{
    //console.log(a);
    if(a.includes(b)){  r = true; }
    });
    return r;
}



//convert data from ws to object js
function router(data){
if(!isUsed(data))return;
if(data.includes('triger')){} else return;
var dt = JSON.parse(data);
var triger = dt.triger;

//all market detail
if(triger[0]=="market"&&triger.length==1){
   // console.log(dt); // go to app
    all_market(dt);
}
//one market detail
if(triger[0]=="market"&&triger.length>1){
   // console.log(dt); // go to app
   
}

//one market orderbook
if(triger[0]=="orderbook"){
   // console.log(dt); // go to app
    orderbook(dt);
}

//one chart
if(triger[0]=="chart"){
   // console.log(dt); // go to app
   chart_update_x(dt);
}

//list market_show only
if(triger[0]=="market_list"){
    console.log(dt); // go to app
}
 


}




//get all market
function getallmarket(){
    sock.send(soket,'market');
}
if(SOCKET_URL=='market'||SOCKET_URL=='exchange'){
    setInterval(getallmarket,30000);
}

function openc(){
   
    if(SOCKET_URL=='market'||SOCKET_URL=='exchange'){
        console.log("load data");
        getallmarket();
   }
}

 
                
             
var volume_this_pair = 0;


function orderbook(d){
       d.data.s.forEach(f => {
            var p = f.p*1000000;
            var bgg =  (f.p*f.a) / 100 ;
            bgg = Math.floor(bgg);
            bgg = Math.max(bgg,1);
            bgg = Math.min(bgg,7);
            

            var tddata = '\
            <td class="red   col-4 pl-2 ">'+number_format(f.p)+'</td>\
                <td class=" text-right col-4">'+number_format(f.a)+'</td>\
                <td class=" pr-2 text-right col-4">'+number_format(f.a*f.p)+'</td>';
            var trdata = '\
            <tr id="book_sell_'+p+'"  class="row red-bg-'+bgg+' old-content"  style="margin:0px" >\
            '+tddata+'\
            </tr>';

            if($('#book_sell_'+p).length){
                $('#book_sell_'+p).html(tddata);
            }
            else 
            $('#book_sell').append(trdata);

             

        })
        d.data.b.forEach(f => {
            var p = f.p*1000000;
            var bgg =  (f.p*f.a) / 100 ;
            bgg = Math.floor(bgg);
            bgg = Math.max(bgg,1);
            bgg = Math.min(bgg,7);

            var tddata = '\
            <td class="green  pl-2 col-4">'+number_format(f.p)+'</td>\
                <td class=" text-right  col-4">'+number_format(f.a)+'</td>\
                <td class="text-right  pr-2 col-4">'+number_format(f.a*f.p)+'</td>';
            var trdata = '\
            <tr id="book_buy_'+p+'"  class="green-bg-'+bgg+' row old-content"  style="margin:0px" >\
            '+tddata+'\
            </tr>';

            if($('#book_buy_'+p).length){
                $('#book_buy_'+p).html(tddata);
            }
            else 
            $('#book_buy').append(trdata);

             

        })
        d.data.h.forEach(f => {
            var c = 'green';
            if(f.m==2)c='red';
            var tddata = '\
            <td class="col-4 pl-2 '+c+'">'+f.d+'</td>\
                <td class="col-4 text-right " > '+number_format(f.p)+'</td>\
                <td class="col-4 text-right pr-2"  >'+number_format(f.t)+'</td>';

            var trdata = '\
            <tr  class=" old-content row"  style="margin:0px" >\
            '+tddata+'\
            </tr>';

            
            $('#book_history').append(trdata);

             

        })
        $("#book_sell").animate({
            scrollTop: 10000
        }, 1000);  


        $('.book-loading').hide();
}



var WS_VOLUME_DATA =[];
var WS_CHART_DATA  = [];

function chart_update_x(d){

      WS_VOLUME_DATA =[];
      WS_CHART_DATA  = [];

//{c: 138.1, t: "2021-07-28T23:38:35.000Z", d: 54420, v: 24.68001}

var x=0;
d.data.forEach(e => {
    x++;
   // if(x>10) return;
  var dd =  new Date(e.t);
  dd = Date.parse(dd) / 1000;
 
 

    WS_CHART_DATA.push(
        { time: dd, value: e.c}
        );

    WS_VOLUME_DATA.push(
        { time: dd, value: e.v, color: 'rgba(0, 150, 136, 0.8)' },
        );
});


WS_VOLUME_DATA= WS_VOLUME_DATA.reverse();
WS_CHART_DATA = WS_CHART_DATA.reverse();


//setTimeout(chart_update,5);

//chart_update();    
}

//fill all markets
function all_market(d){
 
d.data.forEach(e => {



//console.log(e);
var change = ( e.bid - e.open ) / (e.open*0.01);
var col = 'green';
if(change<0)col='red';
var coin = e.market_show.split("_")[0];
var market = e.market_show.split("_")[1];

var dnone = "display:none";

if(e.volume<500&&market=="usdt")market = "alt";
else
if(market=='usdt')dnone = "";

var h = window.location.hash.replace("#","");
if(h==e.market_show)
{   volume_this_pair = e.volume;
    var price =document.querySelectorAll('.last_price_usd');
    if(market == "usdt")
    for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(e.bid);

    var price =document.querySelectorAll('.last_price');
    for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(e.bid);
    var price =document.querySelectorAll('.last_high');
    for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(e.high);
    var price =document.querySelectorAll('.last_low');
    for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(e.low);
    var price =document.querySelectorAll('.last_volume');
    for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(e.volume);
    var price =document.querySelectorAll('.last_change');
    for(var i=0;i<price.length;i++) price[i].innerHTML="<span class=' ob-heading-big "+col+"' >"+number_format(change,2)+"%</span>";
}
update_global_price(e.market_show,e.bid);

var tddata = '\
<td><i class="icon ion-md-star"></i> '+e.market_show.toUpperCase()+'</td>\
<td class=" hide-xs"><img src="https://f1.bitsten.com/assets/images/logo/'+coin+'.png"  width="20px" alt="'+coin+'"> '+coin.toUpperCase()+'</td>\
<td class=" text-right  ">'+number_format(e.bid)+'</td>\
<td class=" text-right '+col+'">'+number_format(change,2)+'%</td>\
<td class=" text-right hide-xs">'+number_format(e.high)+'</td>\
<td class="text-right  hide-xs ">'+number_format(e.low)+'</td>\
<td class=" text-right hide-xs " >'+number_format(e.volume)+'</td>';

var tddatam = '\
<td   class="col-5 pl-4"><i class="icon ion-md-star"></i> <img src="https://f1.bitsten.com/assets/images/logo/'+coin+'.png"  width="20px"  > '+e.market_show.toUpperCase()+'</td>\
<td   class="col-4 text-right">'+number_format(e.bid)+'</td>\
<td   class="col-3 text-center '+col+'">'+number_format(change,2)+'%</td>';

var row="";
if(SOCKET_URL=='exchange'){tddata = tddatam; row="row";}



var trdata = '\
<tr id="market-id-'+e.id+'" class=" '+row+' '+market+' all-coin " style="width:100%; cursor:pointer; '+dnone+'" onCLick="goto(\''+e.market_show+'\')">\
'+tddata+'\
</tr>';

if($('#market-id-'+e.id).length){
    $('#market-id-'+e.id).html(tddata);
}
else 
$('#all_markets_table tbody').append(trdata);

});


$("#load-markets").hide();

}

function show(a){
  //  console.log(a);
   
    $(".all-coin").hide();
    $("."+a).show();
}

function update_global_price(pair,p){
var price =document.querySelectorAll('.price-'+pair);
//console.log(price);
for(var i=0;i<price.length;i++) price[i].innerHTML=number_format(p);
}
 
function goto(a){
    var u = window.location.href;
    if(u.indexOf("exchange") != -1){
     window.location.hash = a;
    }
    else
    window.location.href = "exchange#"+a;

    gethash();
   
}

var has = "";
function getorderbook(){
    sock.send(soket,'orderbook.'+has);
    sock.send(soket,'chart.'+has);
}

var hash = "";
var inter = [];
function gethash(){
  var h = window.location.hash;
  if(hash==h)return;
  hash=h;
  //update data

  
  
  $('.old-content').remove();
  $('.book-loading').show();

  $("#book_sell").animate({
    scrollTop: 0
}, 1000); 

  var coin = h.split("_")[0].replace("#","");
  var market = h.split("_")[1];

var m =document.querySelectorAll('.coin-name');
for(var i=0;i<m.length;i++) m[i].innerHTML=coin;

var m =document.querySelectorAll('.market-name');
for(var i=0;i<m.length;i++) m[i].innerHTML=market;

  has = coin+"_"+market;
  clearInterval(inter);
  inter = setInterval(getorderbook,10000);
  getorderbook();
  getallmarket();
 

  
}

gethash();

 