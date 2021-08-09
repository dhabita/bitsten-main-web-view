let formater = function(p) {
    p = p.toString();
    p = p
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "")
        .replace(",", "");
    p = number_format(p * 1, -1, 1);
    p *= 1;

    return p;
}
let clicker = {
    autobalance: function(f, am) {

        let bal = 0;
        if ($(".class_balance_" + f)) {
            bal = $(".class_balance_" + f).first().html();
            bal = formater(bal);
            bal = bal * 1;

            if (bal > 0 && f == "market") {

                let p = 0
                if ($("#input-buy-price")) {
                    p = $("#input-buy-price").val();
                }


                if (p > 0) //$("#input-buy-amount").val((bal * am) / p);
                    clicker.autoformater($("#input-buy-amount"), number_format((bal * am) / p));
                clicker.est_buy();
            }
            if (bal > 0 && f == "coin") {
                // console.log(bal * am);
                // $("#input-sell-amount").val(number_format(bal * am, -1, 1));
                clicker.autoformater($("#input-sell-amount"), number_format(bal * am));
                clicker.est_sell();
            }


        }

    },
    getPrice: function(p) {
        p = formater(p);
        if ($("#input-buy-price")) {
            $("#input-buy-price").val(p);
        }
        if ($("#input-sell-price")) {
            $("#input-sell-price").val(p);
        }
        clicker.est_buy();
        clicker.est_sell();
    },
    getAmount: function(p) {
        p = formater(p);
        if ($("#input-buy-amount")) {
            $("#input-buy-amount").val(p);
        }
        if ($("#input-sell-amount")) {
            $("#input-sell-amount").val(p);
        }
        clicker.est_buy();
        clicker.est_sell();
    },
    getAll: function(p, a) {
        clicker.getPrice(p);
        clicker.getAmount(a);
    },
    autoformater: function(l, v) {
        v = v.toString();
        if (l) {
            v = v.replace(/[^0-9.]/g, '');
            let c = (v.match(/\./g) || []).length;
            //  console.log(c);
            if (c > 1) v = 0;
            l.val(v);
            let rv = v;
            let vf = number_format(v, -1, 1);
            if (rv > vf) l.val(vf);
        }
    },
    est_buy: function() {
        let p = 0;
        let a = 0;
        let fee = $(".fee").first().html();
        if ($("#input-buy-price")) {
            p = $("#input-buy-price").val();

        }
        if ($("#input-buy-amount")) {
            a = $("#input-buy-amount").val();

        }

        if (p * a > 0) {
            $("#est-buy").html(formater(a * 0.01 * (100 - fee)));
            $("#fee-buy").html(formater(a * 0.01 * fee));
            $("#total-buy").html(formater(a * p));
        }

    },
    est_sell: function() {
        let p = 0;
        let a = 0;
        let fee = $(".fee").first().html();
        if ($("#input-sell-price")) {
            p = $("#input-sell-price").val();

        }
        if ($("#input-sell-amount")) {
            a = $("#input-sell-amount").val();

        }

        if (p * a > 0) {
            $("#est-sell").html(formater(p * a * 0.01 * (100 - fee)));
            $("#total-sell").html(formater(a * p));
            $("#fee-sell").html(formater(p * a * 0.01 * fee));
        }
    }
}

$(document).ready(function() {
    if ($("#input-buy-price")) {
        $("#input-buy-price").keyup(function() {
            let a = $("#input-buy-price").val();
            // console.log(a);
            clicker.autoformater($("#input-buy-price"), a);
            clicker.est_buy();
        })
    }
    if ($("#input-sell-price")) {
        $("#input-sell-price").keyup(function() {
            let a = $("#input-sell-price").val();
            // console.log(a);
            clicker.autoformater($("#input-sell-price"), a);
            clicker.est_sell();
        })

    }
    if ($("#input-buy-amount")) {
        $("#input-buy-amount").keyup(function() {
            let a = $("#input-buy-amount").val();
            // console.log(a);
            clicker.autoformater($("#input-buy-amount"), a);
            clicker.est_buy();
        })
    }
    if ($("#input-sell-amount")) {
        $("#input-sell-amount").keyup(function() {
            let a = $("#input-sell-amount").val();
            //console.log(a);
            clicker.autoformater($("#input-sell-amount"), a);
            clicker.est_sell();
        })
    }
})