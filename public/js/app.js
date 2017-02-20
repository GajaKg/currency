var today = "https://api.kursna-lista.info/3a829dd47e1cc21fb1dfe3406989a59a/kursna_lista/json";
var countries = {
    eur: 'EU', usd: 'USA', chf: "Switzerland", gbp: "Great Britain", 
    aud: 'Asutralian dollar', cad: 'Canadian dollar', dkk: 'Danish Crown', nok: "Norwegian Krone",
    jpy: 'Japanese Yen', rub: 'Russian Ruble', hrk: 'Croatian Kuna', rsd: 'Serbian Dinar'
}

$(document).ready(function(){
    
currencyToday();

    
$("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    maxDate: 0
});    
    
$("#datepicker2").datepicker({
    changeMonth: true,
    changeYear: true,
    maxDate: 0
});     

for(var polje in countries){
    $("#selCurrency").append("<option value='"+polje+"'>"+countries[polje]+"</option>");
}
for(var polje in countries){
    $("#selCurrency2").append("<option value='"+polje+"'>"+countries[polje]+"</option>");
}   
    
// toggle options
$("#dayToggle").on("click", function(){
    $("#dayCurr").slideToggle("fast");
});  
$("#calcToggle").on("click", function(){
    $("#calcCurr").slideToggle("fast");
}); 
    
    

});

//http://api.kursna-lista.info/3a829dd47e1cc21fb1dfe3406989a59a/kl_na_dan/10.02.2017/json
function currencyOnDay(){
    $("article").html("");
    $("section h3").html("");
    
    var selectedDate = $("#datepicker")[0].value;
    var formatedDate = formatDate(selectedDate); //console.log(formatedDate);
    var url = "https://api.kursna-lista.info/3a829dd47e1cc21fb1dfe3406989a59a/kl_na_dan/"+formatedDate+"/json";
    
    $.ajax({
        dataType: "jsonp",
        method: "GET",
        url: url,
        success: function(dataService){
            var data = dataService.result;
            $("section h3").html("Currency on: " + formatedDate);
            //console.log(data.date);
            
            createTableDOMheader();
            
            $.each(data, function(key, value){
                if(key != 'date'){
                    for(var polje in countries){
                        if(polje == key){
                            createTableDOMbody(value, key, countries[polje]);
                        }
                    }

                }   
            });
        },
    });
}

function currencyToday(){
    // currency today
    $("article").html("");
    $("section h3").html("");
    
    resetSearchFileds();
    $("#datepicker").datepicker('setDate', null);
    
    $.ajax({
        dataType: "jsonp",
        method: "GET",
        url: today,
        success: function(dataService){
            var data = dataService.result;

            $("section h3").html("Currency on: " + data.date);
            createTableDOMheader();

            $.each(data, function(curr, value){
                    
                //if(curr != 'date'){
                    for(var polje in countries){
                        if(polje == curr){
                            createTableDOMbody(value, curr, countries[polje]);
                        }
                    }

                //}
            });
        },
        error: function(err){
            console.log(err);
        }
    });
}





function calculate(){
    if(!document.getElementById("amount").validity.rangeUnderflow){
        
        var amount = $("#amount").val();
        
        var selectedDate = $("#datepicker2").val();
        var date = formatDate(selectedDate);
        var from = $("#selCurrency").val();
        var to = $("#selCurrency2").val();
        
        if(from != 'Pick currency' && to != 'Pick currency' && amount >= 0 && date != ''){         
//http://api.kursna-lista.info/3a829dd47e1cc21fb1dfe3406989a59a/konvertor/eur/rsd/iznos/12.01.2017/sre/json 
            var url = 'https://api.kursna-lista.info/3a829dd47e1cc21fb1dfe3406989a59a/konvertor/'+from+'/'+to+
                '/'+amount+'/'+date+'/sre/json';
            
            $.ajax({
                method: "GET",
                dataType: "jsonp",
                url: url,
                success: function(serviceData){
                    var data = serviceData.result;
                    $("#result").html("Result: " + data.value + " " + to);
                },
                error: function(error){
                    console.log(error);
                }
            });
            
        }
        
        
        
    }
    
}



function createTableDOMheader(){
    $("article").append("<table id='tableHeader' class='table table-hover'>");
    $("#tableHeader").append("<thead><tr>"+
                            "<th>#</th>"+
                            "<th>Country</th>"+
                            "<th>Currency</th>"+
                            "<th>Buy</th>"+
                            "<th>Sell</th>"+
                            "<th>Mid</th>"+
                        "</tr></thead>");
}

function createTableDOMbody(currency, curr, country){
    $("#tableHeader").append("<tr>"+
                                "<th>"+"<img src='images/zemlje/"+curr+".png'>"+"</th>"+
                                "<th>"+country+"</th>"+ 
                                "<th>"+curr+"</th>"+
                                "<th>"+currency.kup+"</th>"+
                                "<th>"+currency.pro+"</th>"+
                                "<th>"+currency.sre+"</th>"+
                           "</tr>");
}

function resetSearchFileds(){
        // reset input fields
    
    $("#datepicker2").datepicker('setDate', null);
    
    var amount = $("#amount").val("");
    
    document.getElementById("selCurrency").options[0].selected="selected";
    document.getElementById("selCurrency2").options[0].selected="selected";
    
    $("#result").html("");
}

function formatDate(date){
    var newDate = new Date(date);
    var day = newDate.getDate();
    var month = newDate.getMonth() + 1;
    if(month < 10) month = "0" + month;
    var year = newDate.getFullYear();
    var fullDate = day + "." + month + "." + year;
    return fullDate;
}