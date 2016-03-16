// ==UserScript==
// @author         friendly-trenchcoat
// @name           Reddit - Food Club Bet Buttons
// @description    Maintains your bet amount and places handy-dandy direct bet links next to each bet (piggybacks off of diceroll123's stuff)
// @include        https://www.reddit.com/r/neopets/comments/*/food_club_bets_*
// ==/UserScript==

// BET AMOUNT         who knows if this works :D 
var today = new Date();
var offset = Math.floor(today.getTimezoneOffset() / 60) - 8;  // difference between UTC and local time in hours, - 8
today.setHours(today.getHours() + offset);

var betAmt = 0;
var title = "click to set";
if(typeof GM_getValue("iBetAmt") !== 'undefined'){ 
    var startDate = new Date(GM_getValue("startDate"));  // make back into a Date object
    var days = Math.floor( (today - startDate)/(1000*60*60*24) ); // number of days between start day and today
    betAmt = GM_getValue("iBetAmt") + (days*2); // final bet amount 
    title = betAmt;
}
var betAmtButton = $('<button/>', {  
    text: "bet amount: "+title,
    click: function () { 
        var iBetAmt = prompt("Bet amount: ", betAmt); 
        GM_setValue("iBetAmt", Number(iBetAmt));
        GM_setValue("startDate", today);
        betAmt = Number(iBetAmt);
        $(this).text("bet amount: "+betAmt);
    }
});
$("[class='sitetable nestedlisting']").prepend(betAmtButton);


// SELECTIONS
var pirates = ['Dan', 'Sproggie', 'Orvinn', 'Lucky', 'Edmund', 'Peg Leg', 'Bonnie', 'Puffo', 'Stuff', 'Squire', 'Crossblades', 'Stripey', 'Ned', 'Fairfax', 'Gooblah', 'Franchisco', 'Federismo', 'Blackbeard', 'Buck', 'Tailhook'];
var pirateIDs = [0,0,0,0,0]; // five arenas
$("tbody").children().each(function(k,v) {
    if ($(v).children().length == 7){ //if it's actually a bet table
        
        for (var i=1; i<6; i++){ //for each column 
            var arena = $(v).children().eq(i).css("background-color", "#ffc");
            //console.log("arena: "+i);
            //console.log(arena.text());
            pirateIDs[i-1] = pirates.indexOf(arena.text())+1;
            if (pirateIDs[i-1] == 0) {
                pirateIDs[i-1] = '<input type="hidden" name="winner'+i+'" value="">';
            }
            else {
                pirateIDs[i-1] = '<input type="hidden" name="matches[]" value="'+i+'">' + '<input type="hidden" name="winner'+i+'" value="'+pirateIDs[i-1]+'">';
            }
        }
        var odds = $(v).children().eq(6).text().slice(0, -2);
        var winnings = odds*betAmt;
       
        $(v).append('<form action="http://www.neopets.com/pirates/process_foodclub.phtml" target="_blank" method="post" name="bet_form">'+pirateIDs.join("")+'<input type="hidden" name="bet_amount" value="'+betAmt+'"><input type="hidden" name="total_odds" value="'+odds+'"><input type="hidden" name="winnings" value="'+winnings+'"><input type="hidden" name="type" value="bet"><input type="submit" value="Bet"></form>');
    }
});
