var url = "https://api4.bitsten.com/private";

let coin_memory = {};
let transaction_memory = {};

function balance(coin){
    if(coin_memory.hasOwnProperty(coin)){}
    else coin_memory[coin] = {};
    if(transaction_memory.hasOwnProperty(coin)){}
    else transaction_memory[coin] = [];

    $.ajaxSetup({
        headers:{
           'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( url+"/balance/"+coin)
    .done(function( data ) {
       // console.log(  data );
        if(data.status) {
            var m =document.querySelectorAll('.balance_'+coin);
            for(var i=0;i<m.length;i++) m[i].innerHTML= number_format(data.data[coin].amount);
            var m =document.querySelectorAll('.balance_'+coin+"_hold");
            for(var i=0;i<m.length;i++) m[i].innerHTML= 0;
        }
        if(data.status == false){
            if("message" == "Invalid Login Token") eraseCookie("token");
            var m =document.querySelectorAll('.balance_'+coin);
            for(var i=0;i<m.length;i++) m[i].innerHTML= 0;
            var m =document.querySelectorAll('.balance_'+coin+"_hold");
            for(var i=0;i<m.length;i++) m[i].innerHTML= 0;
        }
    });
}


 


function wallet_result(coin,data){


    var m =document.querySelectorAll('.coin_nama');
    for(var i=0;i<m.length;i++) $(m[i]).html(data.name);
    var m =document.querySelectorAll('.min_dp');
    for(var i=0;i<m.length;i++) $(m[i]).html(number_format(data.min_deposit,data.min_deposit>1?2:4));
    var m =document.querySelectorAll('.contract_address');
    for(var i=0;i<m.length;i++){
         if(data.network>0)
         $(m[i]).show();
         $(m[i]).html(data.contract);
    }
    var m =document.querySelectorAll('.coin_network');
    for(var i=0;i<m.length;i++){
         if(data.network>0){
        let net = "This token Network is <b class='text-info'>Binance Samart Chain BEP20  </b> make sure you send correct network token ";
        if(data.network==2) net = "This token  Network  is <b class='text-info'>Tron TRC20   </b> make sure you send correct network token";
        if(data.network==1) net = "This token  Network is <b class='text-info'>Ethereum  ERC20   </b> make sure you send correct network token";
         
         $(m[i]).show();
         $(m[i]).html(net);}
    }
    
    var m =document.querySelectorAll('.min_conf');
    for(var i=0;i<m.length;i++) $(m[i]).html(data.confirm);
    var m =document.querySelectorAll('.wallet_'+coin);
    for(var i=0;i<m.length;i++)  $(m[i]).val(data.addr);
    create_qr(data.addr);
}



function wallet(coin){
     var size = Object.keys(coin_memory[coin]).length;
     if(size>0)wallet_result(coin,coin_memory[coin]);
     else {
     var m =document.querySelectorAll('.deposit_address');
     for(var i=0;i<m.length;i++) $(m[i]).val("---");
     }

    $.ajaxSetup({
        headers:{
           'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( url+"/wallet/"+coin)
    .done(function( data ) {

       
        

        if(data.status) { 
            wallet_result(coin,data.data);
            coin_memory[coin] = data.data;
           
        }
        if(data.status == false){
            var m =document.querySelectorAll('.wallet_'+coin);
            for(var i=0;i<m.length;i++) $(m[i]).val("---");
            create_qr("-");
        }
    });
}


function transaction_result(coin,data){
    data.forEach(e => {
        let d = new Date(e.date);
        let st = "pending";
        
        if(e.tx=="dp"){
            if(e.statuse==1)st = "complete";
            else
            if(e.conf>=coin_memory[coin].confirm)st = "complete";
            else
            st = "( "+e.conf+" / "+coin_memory[coin].confirm+" )";
        }
        if(e.tx=="wd"){
            if(e.statuse==3)st = "complete";
            else
            if(e.statuse==1)st = "on Process";
        }

        d=d.toLocaleString();
        $("#transaction").append(
            "\
            <tr>\
            <td>"+e.tx+"-"+e.id+"</td>\
            <td>"+d+"</td>\
            <td>"+st+"</td>\
            <td>"+e.amount+"</td>\
          </tr>"
        );
           
       });
}

function transaction(coin){
    loader($("#transaction"),15);

    var size =  transaction_memory[coin].length;
    if(size>0) transaction_result(coin,transaction_memory[coin]);

    $.ajaxSetup({
        headers:{
           'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( url+"/transaction/"+coin)
    .done(function( data ) {
        
       
        if(data.status) { 
            $("#transaction").html("");
           // var m =document.querySelectorAll('.wallet_'+coin);
           // for(var i=0;i<m.length;i++)  $(m[i]).val(data.data.addr);
           // coin_memory[coin] = data.data;
           // create_qr(data.data.addr);
           transaction_memory[coin] = data.data[coin];
           transaction_result(coin,data.data[coin]);
          
        }
        if(data.status == false){
           // var m =document.querySelectorAll('.wallet_'+coin);
           // for(var i=0;i<m.length;i++) $(m[i]).val("---");
           // create_qr("-");
        }
    });
}


function getprofile(){
    $.ajaxSetup({
        headers:{
           'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( url+"/profile")
    .done(function( data ) {
        if(data.status) { 
             $('#p_name').html(data.data.real_name);
             $('#p_uname').html(data.data.username);
             $('#p_email').html(data.data.email);
        }
        if(data.status == false){
          
        }
    });
}

function select_coin(a){
    loader($(".loader_12"),12);
    $(".contract_address").hide();
    $(".coin_network").hide();
    loader($(".balance_"+a),15);
    loader($(".balance_"+a+"_hold"),13);
    var m =document.querySelectorAll('.coin_name');
    for(var i=0;i<m.length;i++) $(m[i]).html(a.toUpperCase());

    var m =document.querySelectorAll('.deposit_address');
    for(var i=0;i<m.length;i++)  {
        $(m[i]).removeClass();
        $(m[i]).addClass("deposit_address"); 
        $(m[i]).addClass("form-control");
        $(m[i]).addClass("text-center");
        $(m[i]).addClass("wallet_"+a);
       
       

    }
    
    balance(a);
    wallet(a);
    transaction(a);
   


}
 if(SOCKET_URL=='wallet'){
loader($(".loader_12"),12);
select_coin("wbst");
 }