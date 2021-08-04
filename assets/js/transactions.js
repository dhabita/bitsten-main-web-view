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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function CheckPassword(inputtxt) 
{ 
var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;
if(inputtxt.match(passw)) 
{ 
 
return true;
}
else
{ 
 
return false;
}
}


function get_code_register(){
    $.ajaxSetup({
        headers:{
         //  'Authorization': "auth username and password"
        }
     });


var email      = $("#email").length?$("#email").val():"";
var password   = $("#password").length?$("#password").val():"";
var c_password = $("#c_password").length?$("#c_password").val():"";
var upline     = 0;
var up = getCookie("upline");
if(up*1>0)upline=up;
var tos        = $("#tos:checked ").val()=="on"?true:false;

var data = {
  email :  email,
  password : password,
  c_password : c_password,
  upline : upline.toString(),
  tos : tos.toString()
};


if(!validateEmail(email)){ 
    $("#login_error").html("Invalid Email Format");
    $('#login-modal').modal('show');
    return;}
if(!CheckPassword(password)){ 
        $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
        $('#login-modal').modal('show');
  return;}

  if(password != c_password){ 
    $("#login_error").html("Infalid Re-type password");
    $('#login-modal').modal('show');
return;}  

if(!tos){ 
    $("#login_error").html("You must approve Our Terms");
    $('#login-modal').modal('show');
return;}  



 
let d = {};
d.data = JSON.stringify(data);
 
     $.post( url+"/email/request", d)
    .done(function( data ) {
       // console.log(data);
        //alert( "Data Loaded: " + data );
        if(data.status){
            console.log("email sent"); 
            $("#login_success").html(data.message);
            $('#login-modal-s').modal('show');
            
        } else {
            $("#login_error").html(data.message);
            $('#login-modal').modal('show');
        }
    });
}


function register(){
    $.ajaxSetup({
        headers:{
         //  'Authorization': "auth username and password"
        }
     });


var email      = $("#email").length?$("#email").val():"";
var password   = $("#password").length?$("#password").val():"";
var c_password = $("#c_password").length?$("#c_password").val():"";
var upline     = 0;
var up = getCookie("upline");
if(up*1>0)upline=up;
var tos        = $("#tos:checked ").val()=="on"?true:false;
var email_code      = $("#email_code").length?$("#email_code").val():"";

var d = {
  email :  email,
  password : password,
  c_password : c_password,
  upline : upline.toString(),
  tos : tos.toString(),
  email_code : email_code
};


if(!validateEmail(email)){ 
    $("#login_error").html("Invalid Email Format");
    $('#login-modal').modal('show');
    return;}
if(!CheckPassword(password)){ 
        $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
        $('#login-modal').modal('show');
  return;}

  if(password != c_password){ 
    $("#login_error").html("Invalid Re-type password");
    $('#login-modal').modal('show');
return;}  
if(email_code.length!=6){ 
    $("#login_error").html("Invalid Email Code");
    $('#login-modal').modal('show');
return;}  
if(!tos){ 
    $("#login_error").html("You must approve Our Terms");
    $('#login-modal').modal('show');
return;}  

 
 
 
     $.post( url+"/register", d)
    .done(function( data ) {
       // console.log(data);
        //alert( "Data Loaded: " + data );
        if(data.status){
            console.log("email sent"); 
            $("#login_success").html(data.message);
            $('#login-modal-s').modal('show');
            
        } else {
            $("#login_error").html(data.message);
            $('#login-modal').modal('show');
        }
    });
}


