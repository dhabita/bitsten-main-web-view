var url = "https://api5.bitsten.com/transaction";


function login(){
    $.ajaxSetup({
        headers:{
         //  'Authorization': "auth username and password"
        }
     });


var email    = $("#email").length?$("#email").val():"";
var password = $("#password").length?$("#password").val():"";

var data = {
  email :  email,
  password : password
};

     $.post( url+"/login", data)
    .done(function( data ) {
        console.log(data);
        //alert( "Data Loaded: " + data );
        if(data.status){
            console.log("success Login");
            setCookie("token",data.data.token,1);
            location.href = "markets"
        } else {
            $("#login_error").html(data.message);
            $('#login-modal').modal('show');
        }
    });
}


