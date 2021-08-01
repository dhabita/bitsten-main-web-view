var urlp = "https://api3.bitsten.com/public";


function assets(e){
    $.ajaxSetup({
        headers:{
         //  'Authorization': 'Bearer ' + getCookie("token")
        }
     });


 

    $.get( urlp+"/assets?limit=1000")
    .done(function( data ) {
       // console.log(  data );
        if(data.status) {
            e(data.data)
            // var m =document.querySelectorAll('.balance_'+coin);
            // for(var i=0;i<m.length;i++) m[i].innerHTML= number_format(data.data[coin].amount);
        }
       
    });
}
if(SOCKET_URL=="wallet"){
    assets(function(d){
         d.forEach(e => {
            var da = '\
                    <a href="#'+e.code.toUpperCase()+'" onCLick="select_coin(\''+e.code+'\')" class="nav-link d-flex justify-content-between align-items-center" data-toggle="pill"\
                          aria-selected="true">\
                        <div class="d-flex">\
                        <img src="https://f1.bitsten.com/assets/images/logo/'+e.code+'.png"  style="width:45px !important ; height:45px !important" > \
                        <div>\
                            <h5>'+e.code.toUpperCase()+'</h4>\
                            <p>'+e.name+'</p>\
                        </div>\
                        </div>\
                        <div>\
                        <h6 class="balance_'+e.code+'">--</h5>\
                        <p   class="text-right"><i class="icon ion-md-lock"></i> <span class="balance_'+e.code+'_hold"> -- </span> </p>\
                        </div>\
                    </a> \
                        ';
            $("#list_assets").append(da);
            balance(e.code);
            $("#load-assets").hide();
         });
    });
  
}

 