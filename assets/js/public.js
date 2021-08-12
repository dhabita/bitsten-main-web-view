var urlp = "https://api3.bitsten.com/public";


var listpair = {};
var arraycoin = [];
let swap = {
    main1: function(c) {
        balance(c);
        $("#c1").html(c.toUpperCase());
        $("#CA").html(c.toUpperCase());
        $("#lp2").html("");
        let f = 0;
        listpair.forEach(ee => {

            if (ee.coin1 == c && ee.coin2 != c) {
                if (f == 0) swap.main2(ee.coin2);
                f++;
                $("#lp2").append(`
            <a onCLick='swap.main2("${ee.coin2}")' class="dropdown-item"  ><img src="https://f1.bitsten.com/assets/images/logo/${ee.coin2}.png" width="25 px"> <span id="P1">${ee.coin2.toUpperCase()}</span></a>
            `)
            }
        });

        $("#main1").html(`<img src='https://f1.bitsten.com/assets/images/logo/${c}.png' width='25px'>  <span id="P1">${c.toUpperCase()}</span>`);
    },
    main2: function(c) {
        $("#c2").html(c.toUpperCase());
        $("#main2").html(`<img src='https://f1.bitsten.com/assets/images/logo/${c}.png' width='25px'>  <span id="P2">${c.toUpperCase()}</span>`);
    },
    swap: function() {
        $.ajaxSetup({
            headers: {
                //  'Authorization': 'Bearer ' + getCookie("token")
            }
        });


        //<a class="dropdown-item" href="#"><img src='https://f1.bitsten.com/assets/images/logo/usdt.png' width='25px'> USDT</a>

        $.get(urlp + "/data/pairswap")
            .done(function(data) {
                // console.log(  data );
                if (data.status) {
                    listpair = data.data;
                    listpair.forEach(e => {

                        if (arraycoin.includes(e.coin1)) {} else arraycoin.push(e.coin1);
                        if (arraycoin.includes(e.coin2)) {} else arraycoin.push(e.coin2);
                    });

                    // var m =document.querySelectorAll('.balance_'+coin);
                    // for(var i=0;i<m.length;i++) m[i].innerHTML= number_format(data.data[coin].amount);
                    arraycoin.forEach(ee => {
                        $("#lp1").append(`
                        <a onCLick='swap.main1("${ee}")' class="dropdown-item"  ><img src="https://f1.bitsten.com/assets/images/logo/${ee}.png" width="25 px"> <span id="P1">${ee.toUpperCase()}</span></a>
                        `)
                    });
                    swap.main1("usdt");
                }

            });
    }

}



if (SOCKET_URL == "swap") swap.swap();


function assets(e) {
    $.ajaxSetup({
        headers: {
            //  'Authorization': 'Bearer ' + getCookie("token")
        }
    });




    $.get(urlp + "/assets?limit=1000")
        .done(function(data) {
            // console.log(  data );
            if (data.status) {
                e(data.data)
                    // var m =document.querySelectorAll('.balance_'+coin);
                    // for(var i=0;i<m.length;i++) m[i].innerHTML= number_format(data.data[coin].amount);
            }

        });
}
if (SOCKET_URL == "wallet") {

    if (getCookie("token") == "") location.href = "login";

    assets(function(d) {
        d.forEach(e => {
            let clasdp = " text-danger ";
            if (e.kondition == 1) clasdp = " text-success ";
            if (e.kondition == 3) clasdp = " text-success ";

            let dpt = " title = 'Deposit Offline' ";
            if (e.kondition == 1) dpt = " title = 'Deposit Online' ";
            if (e.kondition == 3) dpt = " title = 'Deposit Online' ";

            let claswd = " text-danger ";
            if (e.kondition == 1) claswd = " text-success ";
            if (e.kondition == 2) claswd = " text-success ";

            let wdt = " title = 'Withdraw Offline' ";
            if (e.kondition == 1) wdt = " title = 'Withdraw Online' ";
            if (e.kondition == 3) wdt = " title = 'Withdraw Online' ";

            var da = '\
                    <a href="#' + e.code.toUpperCase() + '" onCLick="select_coin(\'' + e.code + '\')" class="nav-link d-flex justify-content-between align-items-center" data-toggle="pill"\
                          aria-selected="true">\
                       \
                        <div class="d-flex">\
                         <div  class="p-0 pr-2" style="font-size:15px">\
                         <i class="bi bi-arrow-up-circle-fill ' + clasdp + '" ' + dpt + '><br></i>\
                         <i class="bi bi-arrow-down-circle-fill  ' + claswd + '" ' + wdt + '></i>\
                        </div>\
                        <img src="https://f1.bitsten.com/assets/images/logo/' + e.code + '.png"  style="width:45px !important ; height:45px !important" > \
                        <div>\
                            <h5>' + e.code.toUpperCase() + '</h4>\
                            <p>' + e.name + '</p>\
                        </div>\
                        </div>\
                        <div>\
                        <h6 class="balance_' + e.code + '"></h5>\
                        <p   class="text-right"><i class="icon ion-md-lock"></i> <span class="balance_' + e.code + '_hold ">  </span> </p>\
                        </div>\
                    </a> \
                        ';

            $("#list_assets").append(da);
            loader($(".balance_" + e.code), 15);
            loader($(".balance_" + e.code + "_hold"), 13);
            balance(e.code);
            $("#load-assets").hide();
        });
    });

}