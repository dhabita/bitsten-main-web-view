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

 