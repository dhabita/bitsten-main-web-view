var url = "https://api4.bitsten.com/private";
var url_t = "https://api5.bitsten.com/transaction";


let coin_memory = {};
let transaction_memory = {};

function balance(coin) {
    if (coin_memory.hasOwnProperty(coin)) {} else coin_memory[coin] = {};
    if (transaction_memory.hasOwnProperty(coin)) {} else transaction_memory[coin] = [];

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });

    // console.log("getbalance");
    $.get(url + "/balance/" + coin)
        .done(function(data) {
            // console.log(  data );
            if (data.status) {
                if ($("#bal-a")) $("#bal-a").html(number_format(data.data[coin].amount));
                var m = document.querySelectorAll('.balance_' + coin);
                for (var i = 0; i < m.length; i++) m[i].innerHTML = number_format(data.data[coin].amount);
                var m = document.querySelectorAll('.balance_' + coin + "_hold");
                for (var i = 0; i < m.length; i++) m[i].innerHTML = 0;
            }
            if (data.status == false) {
                if ("message" == "Invalid Login Token") eraseCookie("token");
                var m = document.querySelectorAll('.balance_' + coin);
                for (var i = 0; i < m.length; i++) m[i].innerHTML = 0;
                var m = document.querySelectorAll('.balance_' + coin + "_hold");
                for (var i = 0; i < m.length; i++) m[i].innerHTML = 0;
            }
        });
}





function wallet_result(coin, data) {

    if (data.condition == 1) {
        $('#deposit-online').show();
        $('#deposit-offline').hide();
    }
    if (data.condition == 2) {
        $('#deposit-online').hide();
        $('#deposit-offline').show();
    }
    if (data.condition == 3) {
        $('#deposit-online').show();
        $('#deposit-offline').hide();
    }
    if (data.condition == 4) {
        $('#deposit-online').hide();
        $('#deposit-offline').show();
    }
    if (data.condition == 5) {
        $('#deposit-online').hide();
        $('#deposit-offline').show();
    }
    if (data.condition == 1) {
        $('#withdraw-online').show();
        $('#withdraw-offline').hide();
    }
    if (data.condition == 2) {
        $('#withdraw-online').show();
        $('#withdraw-offline').hide();
    }
    if (data.condition == 3) {
        $('#withdraw-online').hide();
        $('#withdraw-offline').show();
    }
    if (data.condition == 4) {
        $('#withdraw-online').hide();
        $('#withdraw-offline').show();
    }
    if (data.condition == 5) {
        $('#withdraw-online').hide();
        $('#withdraw-offline').show();
    }

    let e = "etherscan.io";
    if (data.network == 2) e = "tronscan.io/#";
    if (data.network == 3) e = "bscscan.com";
    if (data.code == "btc") e = "www.blockchain.com/btc";
    if (data.code == "ltc") e = "btc.com/ltc";
    if (data.code == "doge") e = "https://dogechain.info";
    if (data.code == "pyrk") e = "explorer.pyrk.org";

    $("#min_wd").html(number_format(data.minwd));
    $("#fee_wd").html(number_format(data.feewd));
    $("#max_wd").html(number_format(data.maxwd1));

    if (data.code == "xrp") $("#tag_addr").show();
    else $("#tag_addr").hide();


    var m = document.querySelectorAll('.network');
    for (var i = 0; i < m.length; i++) {
        $(m[i]).show();
        $(m[i]).removeAttr("disabled");
        $(m[i]).attr("disabled");
        $(m[i]).removeClass("btn-success");
    }


    if (data.network > 0) {
        var m = document.querySelectorAll('.network0');
        for (var i = 0; i < m.length; i++) $(m[i]).hide();
    }

    var m = document.querySelectorAll('.network' + data.network);
    for (var i = 0; i < m.length; i++) {
        $(m[i]).addClass("btn-success");
        $(m[i]).removeAttr("disabled");
    }


    if ($("#add_addr")) $("#add_addr").val("");
    if ($("#tag_addr")) $("#tag_addr").val("");
    if ($("#label_addr")) $("#label_addr").val("");
    if ($("#msg_add_addr")) $("#msg_add_addr").val("");


    let ex = "<a target='_blank' href='https://" + e + "/address/" + data.addr + "'>https://" + e + "</a>";
    $("#exploler").html(ex);



    var m = document.querySelectorAll('.offline-message');
    for (var i = 0; i < m.length; i++) $(m[i]).html(data.message);

    var m = document.querySelectorAll('.coin_nama');
    for (var i = 0; i < m.length; i++) $(m[i]).html(data.name);
    var m = document.querySelectorAll('.min_dp');
    for (var i = 0; i < m.length; i++) $(m[i]).html(number_format(data.min_deposit, data.min_deposit > 1 ? 2 : 4));

    var m = document.querySelectorAll('.coin_network');
    for (var i = 0; i < m.length; i++) {
        if (data.network > 0) {
            let net = "This token Network is <b class='text-info'>Binance Samart Chain BEP20  </b> make sure you send correct network token ";
            if (data.network == 2) net = "This token  Network  is <b class='text-info'>Tron TRC20   </b> make sure you send correct network token";
            if (data.network == 1) net = "This token  Network is <b class='text-info'>Ethereum  ERC20   </b> make sure you send correct network token";

            $(m[i]).show();
            $(m[i]).html(net);
        }
    }

    var m = document.querySelectorAll('.min_conf');
    for (var i = 0; i < m.length; i++) $(m[i]).html(data.confirm);
    var m = document.querySelectorAll('.wallet_' + coin);
    for (var i = 0; i < m.length; i++) $(m[i]).val(data.addr);

    if (data.network > 0) {
        var m = document.querySelectorAll('.contract_address_box');
        for (var i = 0; i < m.length; i++) {
            $(m[i]).show();
        }
        var m = document.querySelectorAll('.contract_address');
        for (var i = 0; i < m.length; i++) {
            $(m[i]).html(data.contrak_address);
        }
    } else {
        var m = document.querySelectorAll('.contract_address_box');
        for (var i = 0; i < m.length; i++) {
            $(m[i]).hide();
        }
    }

    if (data.condition == 2 || data.condition > 3) {

        $("#input-dp").hide();
    } else $("#input-dp").show();

    create_qr(data.addr);
}



function wallet(coin) {
    var size = Object.keys(coin_memory[coin]).length;
    if (size > 0) wallet_result(coin, coin_memory[coin]);
    else {
        var m = document.querySelectorAll('.deposit_address');
        for (var i = 0; i < m.length; i++) $(m[i]).val("---");
    }

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(url + "/wallet/" + coin)
        .done(function(data) {
            if (data.status) {
                wallet_result(coin, data.data);
                coin_memory[coin] = data.data;

            }
            if (data.status == false) {
                var m = document.querySelectorAll('.wallet_' + coin);
                for (var i = 0; i < m.length; i++) $(m[i]).val("---");
                create_qr("-");
            }
        });
}


function transaction_result(coin, data) {
    data.forEach(e => {
        let d = new Date(e.date);
        let st = "pending";

        if (e.tx == "dp") {
            if (e.statuse == 1) st = "complete";
            else
            if (e.conf >= coin_memory[coin].confirm) st = "complete";
            else
                st = "( " + e.conf + " / " + coin_memory[coin].confirm + " )";
        }
        if (e.tx == "wd") {
            if (e.statuse == 3) st = "complete";
            else
            if (e.statuse == 5) st = "canceled";
            else
            if (e.statuse == 1) st = "on Process";
        }

        d = d.toLocaleString();
        $("#transaction").append(
            "\
            <tr>\
            <td>" + e.tx + "-" + e.id + "</td>\
            <td>" + d + "</td>\
            <td>" + st + "</td>\
            <td>" + e.amount + "</td>\
          </tr>"
        );

    });
}

function transaction(coin) {
    loader($("#tx-loader"), 15, "col-12 text-center");

    var size = transaction_memory[coin].length;
    if (size > 0) transaction_result(coin, transaction_memory[coin]);

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(url + "/transaction/" + coin)
        .done(function(data) {


            if (data.status) {
                $("#transaction").html("");
                $("#tx-loader").html("");
                // var m =document.querySelectorAll('.wallet_'+coin);
                // for(var i=0;i<m.length;i++)  $(m[i]).val(data.data.addr);
                // coin_memory[coin] = data.data;
                // create_qr(data.data.addr);
                transaction_memory[coin] = data.data[coin];
                transaction_result(coin, data.data[coin]);

            }
            if (data.status == false) {
                // var m =document.querySelectorAll('.wallet_'+coin);
                // for(var i=0;i<m.length;i++) $(m[i]).val("---");
                // create_qr("-");
            }
        });
}



function openorder_result(market, data) {
    $("#openorder").html("");

    data = data.sort(function(a, b) {

        return b.price - a.price;
    });
    data.forEach(e => {
        let d = new Date(e.date);
        d = d.toLocaleString();
        let color = " text-success ";
        if (e.tx == "sell") color = " text-danger ";
        $("#openorder").append(
            '<tr title="Order opened at ' + d + '" id = "' +
            e.tx + 'openorder_' +
            e.id + '" class="d-flex justify-content-between market-order-item">\
                <td>' + e.id + '</td>\
                <td class="text-center ' + color + '">' + e.tx.toUpperCase() + '</td>\
                <td>' + number_format(e.price) + '</td>\
                <td>' + number_format(e.total) + '</td>\
                <td>' + number_format(e.filled) + '</td>\
                <td class="text-center" onclick="closeorder(' + (e.tx == "sell" ? 1 : 0) + ',' + e.id + ')  ">Cancel</td>\
              </tr>'
        );

    });
}


function openorder(market) {
    loader($("#openorderl"), 12);

    // var size =  transaction_memory[coin].length;
    // if(size>0) transaction_result(coin,transaction_memory[coin]);

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(url + "/openorder/" + market)
        .done(function(data) {


            if (data.status) {
                // console.log(data);
                // $("#transaction").html("");
                // var m =document.querySelectorAll('.wallet_'+coin);
                // for(var i=0;i<m.length;i++)  $(m[i]).val(data.data.addr);
                // coin_memory[coin] = data.data;
                // create_qr(data.data.addr);
                // transaction_memory[coin] = data.data[coin];
                openorder_result(market, data.data[market]);

            }
            if (data.status == false) {
                // var m =document.querySelectorAll('.wallet_'+coin);
                // for(var i=0;i<m.length;i++) $(m[i]).val("---");
                // create_qr("-");
                $("#openorderl").html("");
            }
        });
}

function getprofile() {
    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(url + "/profile")
        .done(function(data) {
            if (data.status) {
                $('#p_name').html(data.data.real_name);
                $('#p_uname').html(data.data.username);
                $('#p_email').html(data.data.email);
                $('#p_id').html("U-" + data.data.id);
                $("#dtv").html(data.data.id);
                if ($('#my_id')) $('#my_id').val("https://bitsten.com/reg/" + data.data.id);

                if (data.data.twofa)
                    if (getCookie("token2fa") == "")
                        location.href = "login2fa";

                if (SOCKET_URL == "set2fa") create2fa();
            }
            if (data.status == false) {
                logout();
            }
        });
}

function select_coin(a) {
    loader($(".loader_12"), 12);
    $(".contract_address_box").hide();
    $(".coin_network").hide();
    loader($(".balance_" + a), 15);
    loader($(".balance_" + a + "_hold"), 13);
    var m = document.querySelectorAll('.coin_name');
    for (var i = 0; i < m.length; i++) $(m[i]).html(a.toUpperCase());

    var m = document.querySelectorAll('.deposit_address');
    for (var i = 0; i < m.length; i++) {
        $(m[i]).removeClass();
        $(m[i]).addClass("deposit_address");
        $(m[i]).addClass("form-control");
        $(m[i]).addClass("text-center");
        $(m[i]).addClass("wallet_" + a);



    }

    balance(a);
    wallet(a);
    transaction(a);
    wd_addr(a);
    generateaddress(a);


    if (a == "xrp") {
        $("#dtv").show();
        $("#destination_tag").show();
    } else {
        $("#dtv").hide();
        $("#destination_tag").hide();
    }



}


function generateaddress(a) {

    $.get(url_t + "/auth/generateaddress/" + a)
        .done(function(data) {
            if (data.status) {
                console.log(data.addr);
            }
            if (data.status == false) {

            }
        });
}



let mem_wd_addr = {};

function wd_addr_result(coin) {
    $("#list_wd_addr").html("");
    mem_wd_addr[coin].forEach(function(e) {
        $("#list_wd_addr").append(`<option value="${e.id}">${e.addr} - ${e.label} </option>`);
    })

}

function wd_addr(a) {
    if (mem_wd_addr.hasOwnProperty(a)) {} else mem_wd_addr[a] = [];

    wd_addr_result(a);

    $.ajaxSetup({
        headers: {
            'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(url + "/listwdaddress/" + a)
        .done(function(data) {
            if (data.status) {
                mem_wd_addr[a] = data.data;
                wd_addr_result(a);

            }
            if (data.status == false) {
                mem_wd_addr[a] = [];
            }
        });
}



if (SOCKET_URL == 'wallet') {
    loader($(".loader_12"), 12);
    select_coin("wbst");
}
//