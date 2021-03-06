 var url_p = "https://api5.bitsten.com/transaction";
 //url_p = "http://localhost/transaction";

 function error_handle(a) {
     if (a == "Invalid 2FA Token") {
         setCookie("token2fa", "", 1);
         location.href = "login2fa";
     }
 }

 function login() {
     //grecaptcha.ready(function() {
     //  grecaptcha.execute('6LcrfR0cAAAAABGSuFZ52ws32WUJbUKknD2FkcGO', {
     //      action: 'submit'
     //  }).then(async function(token) {
     $.ajaxSetup({
         headers: {
             //  'Authorization': "auth username and password"
         }
     });

     let token = $("#g-recaptcha-response").val();
     var email = $("#email").length ? $("#email").val() : "";
     var password = $("#password").length ? $("#password").val() : "";

     var data = {
         email: email,
         password: password,
         gtoken: token
     };

     $.post(url_p + "/login", data)
         .done(function(data) {
             console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("success Login");
                 setCookie("token", data.data.token, 1);
                 setCookie("token2fa", "", 1);
                 location.href = "markets"
             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
     //     })
     //  })
 }

 function update_market(market) {
     let m = $(".market-name").first().html().toLowerCase();
     let c = $(".coin-name").first().html().toLowerCase();
     openorder(market);
     balance(m);
     balance(c);
 }
 async function openr(a) {
     grecaptcha.ready(function() {
         grecaptcha.execute('6LcrfR0cAAAAABGSuFZ52ws32WUJbUKknD2FkcGO', {
             action: 'submit'
         }).then(async function(token) {
             $.ajaxSetup({
                 headers: {
                     'Authorization': 'Bearer ' + getCookie("token"),
                     'Token2fa': getCookie("token2fa")
                 }
             });


             var bos = "buy";
             if (a == 1) bos = "sell";
             var price = $("#input-" + bos + "-price") ? $("#input-" + bos + "-price").val() : 0;
             var amount = $("#input-" + bos + "-amount") ? $("#input-" + bos + "-amount").val() : 0;
             var market = $(".coin-name").first().html() + "_" + $(".market-name").first().html();
             let er = "";


             var data = {
                 type: a,
                 price: price,
                 amount: amount,
                 market: market,
                 gtoken: token
             };
             if (er != "") {
                 $("#res-order").html(er);
                 $('#order-modal').modal('show');
                 return;
             }

             $(".to0").html("0");
             $(".to0i").val("0");






             await $.post(url_p + "/auth/openorder", data)
                 .done(function(data) {
                     console.log(data);
                     //alert( "Data Loaded: " + data );
                     if (data.status) {

                         $("#res-order").html(data.message);
                         $('#order-modal').modal('show');

                     } else {
                         error_handle(data.message);
                         $("#res-order").html(data.message);
                         $('#order-modal').modal('show');
                     }
                 });
             update_market(market);
         })
     })
     console.log("up");


 }


 async function convert() {
     grecaptcha.ready(function() {
         grecaptcha.execute('6LcrfR0cAAAAABGSuFZ52ws32WUJbUKknD2FkcGO', {
             action: 'submit'
         }).then(async function(token) {
             $.ajaxSetup({
                 headers: {
                     'Authorization': 'Bearer ' + getCookie("token"),
                     'Token2fa': getCookie("token2fa")
                 }
             });


             var coin1 = $("#P1") ? $("#P1").html() : "";
             var coin2 = $("#P2") ? $("#P2").html() : "";
             var amount = $("#input_coin_1") ? $("#input_coin_1").val() : 0;


             $(".bc").hide();
             $("#button_convert_1").show();
             $("#input_coin_2").val("");



             let er = "";


             var data = {
                 amount: amount,
                 coin1: coin1.toLowerCase(),
                 coin2: coin2.toLowerCase(),
                 gtoken: token
             };

             if (er != "") {
                 $("#login_error").html(er);
                 $('#login-modal').modal('show');
                 return;
             }



             await $.post(url_p + "/auth/convert", data)
                 .done(function(data) {
                     console.log(data);
                     //alert( "Data Loaded: " + data );
                     if (data.status) {
                         balance(coin1.toLowerCase());
                         $("#login_error").html(data.message);
                         $("#login_error").addClass("text-success");
                         $('#login-modal').modal('show');

                     } else {
                         error_handle(data.message);
                         if (data.message == "Invalid Login Token") data.message += " / Login required !";
                         $("#login_error").html(data.message);
                         $('#login-modal').modal('show');
                     }
                 });
         })
     })

 }



 async function closeorder(a, id) {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token"),
             'Token2fa': getCookie("token2fa")
         }
     });

     var market = $(".coin-name").first().html() + "_" + $(".market-name").first().html();
     let er = "";


     var data = {
         type: a,
         id: id,
         market: market
     };
     if (er != "") {
         $("#res-order").html(er);
         $('#order-modal').modal('show');
         return;
     }

     await $.post(url_p + "/auth/closeorder", data)
         .done(function(data) {
             //console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 //  $("#res-order").html(data.message);
                 //  $('#order-modal').modal('show');
                 if ($("#buyopenorder_" + data.data)) $("#buyopenorder_" + data.data).remove();
                 if ($("#sellopenorder_" + data.data)) $("#sellopenorder_" + data.data).remove();

             } else {
                 error_handle(data.message);
                 //  $("#res-order").html(data.message);
                 // $('#order-modal').modal('show');
             }
         });


     let m = $(".market-name").first().html().toLowerCase();
     let c = $(".coin-name").first().html().toLowerCase();
     balance(m);
     balance(c);
 }

 function validateEmail(email) {
     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(String(email).toLowerCase());
 }

 function CheckPassword(inputtxt) {
     var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;
     if (inputtxt.match(passw)) {

         return true;
     } else {

         return false;
     }
 }


 function get_code_reset() {
     $.ajaxSetup({
         headers: {
             //  'Authorization': "auth username and password"
         }
     });


     var email = $("#email").length ? $("#email").val() : "";
     var password = $("#password").length ? $("#password").val() : "";
     var c_password = $("#c_password").length ? $("#c_password").val() : "";

     var data = {
         email: email,
         password: password,
         c_password: c_password

     };


     if (!validateEmail(email)) {
         $("#login_error").html("Invalid Email Format");
         $('#login-modal').modal('show');
         return;
     }
     if (!CheckPassword(password)) {
         $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
         $('#login-modal').modal('show');
         return;
     }

     if (password != c_password) {
         $("#login_error").html("Infalid Re-type password");
         $('#login-modal').modal('show');
         return;
     }





     let d = {};
     d.data = JSON.stringify(data);

     $.post(url_p + "/email/request", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#login_success").html(data.message);
                 $('#login-modal-s').modal('show');

             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
 }


 function resetpassword() {
     $.ajaxSetup({
         headers: {
             //  'Authorization': "auth username and password"
         }
     });

     let token = $("#g-recaptcha-response").val();
     var email = $("#email").length ? $("#email").val() : "";
     var password = $("#password").length ? $("#password").val() : "";
     var c_password = $("#c_password").length ? $("#c_password").val() : "";
     var email_code = $("#email_code").length ? $("#email_code").val() : "";

     var data = {
         email: email,
         password: password,
         c_password: c_password,
         email_code: email_code,
         gtoken: token

     };


     if (!validateEmail(email)) {
         $("#login_error").html("Invalid Email Format");
         $('#login-modal').modal('show');
         return;
     }
     if (!CheckPassword(password)) {
         $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
         $('#login-modal').modal('show');
         return;
     }

     if (password != c_password) {
         $("#login_error").html("Infalid Re-type password");
         $('#login-modal').modal('show');
         return;
     }
     if (email_code.length != 6) {
         $("#login_error").html("Invalid Email Code");
         $('#login-modal').modal('show');
         return;
     }






     $.post(url_p + "/resetpassword", data)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#login_success").html(data.message);
                 $('#login-modal-s').modal('show');

             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
 }


 function get_code_add_addr() {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token")
         }
     });

     var coin = $(".coin_name").first().text().toLowerCase();
     var addr = $("#add_addr") ? $("#add_addr").val() : "";
     var tag = $("#tag_addr") ? $("#tag_addr").val() * 1 : "";
     var label = $("#label_addr") ? $("#label_addr").val() : "";






     if (coin.length < 3) {
         $("#msg_add_addr").html("Invalid coin Symbol for this address");

         return;
     }
     if (addr.length < 10) {
         $("#msg_add_addr").html("You must insert Wallet address");

         return;
     }

     if (label.length < 3) {
         $("#msg_add_addr").html("You must insert Label");

         return;
     }

     if (tag > 0) {} else
     if ($(".coin_name").first().text() == "XRP") {

         $("#msg_add_addr").html("You must insert Memo / Destination tag for XRP");

         return;
     }


     $("#msg_add_addr").html("Process....");
     tag = tag.toString();

     var data = {
         coin: coin,
         addr: addr,
         tag: tag,
         label: label
     };

     let d = {};
     d.data = JSON.stringify(data);

     $.post(url_p + "/auth/email/request", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#msg_add_addr").html(data.message);


             } else {
                 $("#msg_add_addr").html(data.message);

             }
         });
 }




 function get_wd_code() {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token")
         }
     });

     var coin = $(".coin_name").first().text().toLowerCase();
     var addr = $("#list_wd_addr") ? $("#list_wd_addr").val() : "";
     var amount = $("#wd_amount") ? $("#wd_amount").val() : "";


     if (coin.length < 3) {
         $("#wd_alert").html("Invalid coin Symbol for this address");
         return;
     }
     if (!(addr * 1)) {
         $("#wd_alert").html("You must select Wallet address");

         return;
     }
     if (!amount) {
         $("#wd_alert").html("Amount must >= Minimum WD");

         return;
     }
     if (amount * 1 < $("#min_wd").html() * 1) {
         $("#wd_alert").html("Amount must >= Minimum WD");

         return;
     }

     $("#wd_alert").html("Process.....");

     var data = {
         coin: coin,
         addr: addr,
         amount: (amount * 1).toFixed(8)
     };

     let d = {};
     d.data = JSON.stringify(data);

     $.post(url_p + "/auth/email/request", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#wd_alert").html(data.message);


             } else {
                 $("#wd_alert").html(data.message);

             }
         });
 }

 function reqwd() {
     grecaptcha.ready(function() {
         grecaptcha.execute('6LcrfR0cAAAAABGSuFZ52ws32WUJbUKknD2FkcGO', {
             action: 'submit'
         }).then(async function(token) {
             $.ajaxSetup({
                 headers: {
                     'Authorization': 'Bearer ' + getCookie("token"),
                     'Token2fa': getCookie("token2fa")
                 }
             });

             var coin = $(".coin_name").first().text().toLowerCase();
             var addr = $("#list_wd_addr") ? $("#list_wd_addr").val() : "";
             var amount = $("#wd_amount") ? $("#wd_amount").val() : "";
             var email_code = $("#wd_email_code") ? $("#wd_email_code").val() : "";

             if (email_code.length < 6) {
                 $("#msg_add_addr").html("Required Email code");

                 return;
             }

             if (coin.length < 3) {
                 $("#wd_alert").html("Invalid coin Symbol for this address");
                 return;
             }
             if (!(addr * 1)) {
                 $("#wd_alert").html("You must select Wallet address");

                 return;
             }
             if (!amount) {
                 $("#wd_alert").html("Amount must >= Minimum WD");

                 return;
             }
             if (amount * 1 < $("#min_wd").html() * 1) {
                 $("#wd_alert").html("Amount must >= Minimum WD");

                 return;
             }

             $("#wd_alert").html("Process.....");

             var data = {
                 coin: coin,
                 addr: addr,
                 amount: (amount * 1).toFixed(8),
                 email_code: email_code,
                 gtoken: token
             };


             $.post(url_p + "/auth/withdraw", data)
                 .done(function(data) {
                     // console.log(data);
                     //alert( "Data Loaded: " + data );
                     if (data.status) {
                         $("#wd_alert").html(data.message);


                     } else {
                         error_handle(data.message);
                         $("#wd_alert").html(data.message);

                     }
                 });
         })
     })
 }


 function add_addr() {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token"),
             'Token2fa': getCookie("token2fa")
         }
     });

     var coin = $(".coin_name").first().text().toLowerCase();
     var addr = $("#add_addr") ? $("#add_addr").val() : "";
     var tag = $("#tag_addr") ? $("#tag_addr").val() * 1 : "";
     var label = $("#label_addr") ? $("#label_addr").val() : "";
     var email_code = $("#email_code") ? $("#email_code").val() : "";





     if (email_code.length < 6) {
         $("#msg_add_addr").html("Required Email code");

         return;
     }
     if (coin.length < 3) {
         $("#msg_add_addr").html("Invalid coin Symbol for this address");

         return;
     }
     if (addr.length < 10) {
         $("#msg_add_addr").html("You must insert Wallet address");

         return;
     }

     if (label.length < 3) {
         $("#msg_add_addr").html("You must insert Label");

         return;
     }

     if (tag > 0) {} else
     if ($(".coin_name").first().text() == "XRP") {

         $("#msg_add_addr").html("You must insert Memo / Destination tag for XRP");

         return;
     }


     $("#msg_add_addr").html("Process....");

     tag = tag.toString();
     var data = {
         coin: coin,
         addr: addr,
         tag: tag,
         label: label,
         email_code: email_code
     };

     let d = data;


     $.post(url_p + "/auth/addnewaddr", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#msg_add_addr").html(data.message);


             } else {
                 error_handle(data.message);
                 $("#msg_add_addr").html(data.message);

             }
         });
 }


 function get_code_register() {
     $.ajaxSetup({
         headers: {
             //  'Authorization': "auth username and password"
         }
     });


     var email = $("#email").length ? $("#email").val() : "";
     var password = $("#password").length ? $("#password").val() : "";
     var c_password = $("#c_password").length ? $("#c_password").val() : "";
     var upline = 0;
     var up = getCookie("upline");
     if (up * 1 > 0) upline = up;
     var tos = $("#tos:checked ").val() == "on" ? true : false;

     var data = {
         email: email,
         password: password,
         c_password: c_password,
         upline: upline.toString(),
         tos: tos.toString()
     };



     if (!validateEmail(email)) {
         $("#login_error").html("Invalid Email Format");
         $('#login-modal').modal('show');
         return;
     }
     if (!CheckPassword(password)) {
         $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
         $('#login-modal').modal('show');
         return;
     }

     if (password != c_password) {
         $("#login_error").html("Infalid Re-type password");
         $('#login-modal').modal('show');
         return;
     }

     if (!tos) {
         $("#login_error").html("You must approve Our Terms");
         $('#login-modal').modal('show');
         return;
     }




     let d = {};
     d.data = JSON.stringify(data);

     $.post(url_p + "/email/request", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#login_success").html(data.message);
                 $('#login-modal-s').modal('show');

             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
 }

 function register() {
     //  grecaptcha.ready(function() {
     //      grecaptcha.execute('6LcrfR0cAAAAABGSuFZ52ws32WUJbUKknD2FkcGO', {
     //          action: 'submit'
     //      }).then(async function(token) {

     $.ajaxSetup({
         headers: {
             //  'Authorization': "auth username and password"
         }
     });

     let token = $("#g-recaptcha-response").val();
     var email = $("#email").length ? $("#email").val() : "";
     var password = $("#password").length ? $("#password").val() : "";
     var c_password = $("#c_password").length ? $("#c_password").val() : "";
     var upline = 0;
     var up = getCookie("upline");
     if (up * 1 > 0) upline = up;
     var tos = $("#tos:checked ").val() == "on" ? true : false;
     var email_code = $("#email_code").length ? $("#email_code").val() : "";

     var d = {
         email: email,
         password: password,
         c_password: c_password,
         upline: upline.toString(),
         tos: tos.toString(),
         email_code: email_code,
         gtoken: token
     };


     if (!validateEmail(email)) {
         $("#login_error").html("Invalid Email Format");
         $('#login-modal').modal('show');
         return;
     }
     if (!CheckPassword(password)) {
         $("#login_error").html("Password between 6 to 30 characters which contain at least one numeric digit, one uppercase and one lowercase letter");
         $('#login-modal').modal('show');
         return;
     }

     if (password != c_password) {
         $("#login_error").html("Invalid Re-type password");
         $('#login-modal').modal('show');
         return;
     }
     if (email_code.length != 6) {
         $("#login_error").html("Invalid Email Code");
         $('#login-modal').modal('show');
         return;
     }
     if (!tos) {
         $("#login_error").html("You must approve Our Terms");
         $('#login-modal').modal('show');
         return;
     }




     $.post(url_p + "/register", d)
         .done(function(data) {
             // console.log(data);
             //alert( "Data Loaded: " + data );
             if (data.status) {
                 console.log("email sent");
                 $("#login_success").html(data.message);
                 $('#login-modal-s').modal('show');

             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
     //      })
     //  })
 }



 function login2fa() {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token")
         }
     });


     var password = $("#code2fa").length ? $("#code2fa").val() : "";

     var data = {
         code: password
     };

     $.post(url_p + "/auth/2fa/login", data)
         .done(function(data) {

             if (data.status) {
                 console.log("success Login");
                 setCookie("token2fa", data.data.token, 1);
                 location.href = "markets"
             } else {
                 $("#login_error").html(data.message);
                 $('#login-modal').modal('show');
             }
         });
 }


 function create2fa() {
     $.ajaxSetup({
         headers: {
             'Authorization': 'Bearer ' + getCookie("token")
         }
     });



     var data = {};

     $.post(url_p + "/auth/2fa/create", data)
         .done(function(data) {
             if (data.status) {
                 $('#2factive').show();
                 let d = "otpauth://totp/" + $("#p_uname").html() + "?secret=" + data.data.privatekey + "&issuer=bitsten.com";
                 console.log(d);
                 create_qr(d);
                 $("#backup_code").html(data.data.privatekey);
             } else {
                 if (data.data == "Your Google 2FA already active") $('#isactive').show();
             }
         });
 }