 

var url = "wss://socket.bitsten.com:8443/"+SOCKET_URL; 

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
    timeout: 5000,
    open: function (s, f) {
        s.onopen = function (evt) {
            $("#info_socket").html("<i class='fa fa-wifi'></i> Connected");
            if (typeof f !== "undefined") {
                f(evt);
            }
        };

      // openc();

    },
    close: function (s, c) {
        s.onclose = function (evt) {
            $("#info_socket").html("Connecting...");
            c(evt);
        };
    },
    msg: function (s, msg) {
        s.onmessage = function (evt) {
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

var soket = sock.ws(url);
sock.msg(soket,function(a){
    //console.log(a.data);
    router(a.data);
});

 
 

//only use triger on this list
var router_used = ['market','orderbook','market_list'];
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
    console.log(dt); // go to app
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
if(SOCKET_URL=='market'){
    setInterval(getallmarket,5000);
}

function openc(){
    if(SOCKET_URL=='market'){
        getallmarket();
   }
}



//fill all markets
function all_market(d){
 
d.data.forEach(e => {
    
console.log(e);
var change = ( e.bid - e.open ) / (e.open*0.01);
var col = 'green';
if(change<0)col='red';
var coin = e.market_show.split("_")[0];
var market = e.market_show.split("_")[1];

var dnone = "display:none";

if(e.volume<500&&market=="usdt")market = "alt";
else
if(market=='usdt')dnone = "";

var tddata = '\
<td><i class="icon ion-md-star"></i> '+e.market_show.toUpperCase()+'</td>\
<td><img src="http://f1.bitsten.com/assets/images/logo/'+coin+'.png" alt="'+coin+'">'+coin.toUpperCase()+'</td>\
<td>'+number_format(e.bid)+'</td>\
<td class="'+col+'">'+number_format(change,2)+'%</td>\
<td>'+number_format(e.high)+'</td>\
<td>'+number_format(e.low)+'</td>\
<td>'+number_format(e.volume,2)+'</td>';

var trdata = '\
<tr id="market-id-'+e.id+'" class="  '+market+' all-coin " style="'+dnone+'" data-href="exchange-light.html">\
'+tddata+'\
</tr>';

if($('#market-id-'+e.id).length){
    $('#market-id-'+e.id).html(tddata);
}
else 
$('#all_markets_table tbody').append(trdata);

});

}

function show(a){
    console.log(a);
   
    $(".all-coin").hide();
    $("."+a).show();
}

 