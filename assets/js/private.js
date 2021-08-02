var url = "https://api4.bitsten.com/private";


function balance(coin){
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

var wallet_m = {};
function wallet(coin){
    $.ajaxSetup({
        headers:{
           'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( url+"/wallet/"+coin)
    .done(function( data ) {
        
        if(data.status) { 
            var m =document.querySelectorAll('.wallet_'+coin);
            for(var i=0;i<m.length;i++)  $(m[i]).val(data.data[coin]);
            wallet_m[coin] = data.data[coin];
            create_qr(data.data[coin]);
        }
        if(data.status == false){
            var m =document.querySelectorAll('.wallet_'+coin);
            for(var i=0;i<m.length;i++) $(m[i]).val("---");
            create_qr("-");
        }
    });
}

function select_coin(a){
      

    var m =document.querySelectorAll('.deposit_address');
    for(var i=0;i<m.length;i++) $(m[i]).val("---");

    var m =document.querySelectorAll('.deposit_address');
    for(var i=0;i<m.length;i++)  {
        $(m[i]).removeClass();
        $(m[i]).addClass("deposit_address"); 
        $(m[i]).addClass("form-control");
        $(m[i]).addClass("text-center");
        $(m[i]).addClass("wallet_"+a);
       
       

    }

    wallet(a);


}
 