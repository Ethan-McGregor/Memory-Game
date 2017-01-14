'use strict';

// returns a random sorting of images 8 images with their duplicates
function getCards() {
    var cards = new Array(32);
    for (var i = 0; i < cards.length; i++) {
        cards[i] = ("img/" + "card" + (i + 1) + ".jpg");
    }
    //sample of 8 cards from the 32
    var sample = _.sampleSize(cards, 8);
    //duplicating the random sample
    var cardsUsed = _.concat(sample, sample);
    cardsUsed = _.sampleSize(cardsUsed, cardsUsed.length);
    var cardData = { 'card1': { "name": "", 'flipped': false }, 'card2': { "name": "", 'flipped': false }, 'card3': { "name": "", 'flipped': false }, 'card4': { "name": "", 'flipped': false }, 'card5': { "name": "", 'flipped': false }, 'card6': { "name": "", 'flipped': false }, 'card7': { "name": "", 'flipped': false }, 'card8': { "name": "", 'flipped': false }, 'card9': { "name": "", 'flipped': false }, 'card10': { "name": "", 'flipped': false }, 'card11': { "name": "", 'flipped': false }, 'card12': { "name": "", 'flipped': false }, 'card13': { "name": "", 'flipped': false }, 'card14': { "name": "", 'flipped': false }, 'card15': { "name": "", 'flipped': false }, 'card16': { "name": "", 'flipped': false } };

    for (var x = 0; x < cardsUsed.length; x++) {
        cardData["card" + (x + 1)]['name'] = cardsUsed[x];
    }
    return cardData;
}

var startTime = 0;
var endTime = 0;
var time = 0;
//counts every second the game is running
function oneSecond() {
    endTime = moment();
    time = moment(endTime).unix() - moment(startTime).unix();
    time = moment.unix(time).format('mm:ss');
    $("#gameTime").remove();
    $('#time').append("<h2 id= gameTime> Game Time: " + time + "</h2>");
}

var timer = null;
//makes a grid of "cards" with rows and cards. Then insert into HTML and CSS
function createGrid() {
    startTime = moment();
    timer = window.setInterval(oneSecond, 1000);
    //remove all instances of the gird first
    removeGrid();
    var windowSize = $(window).width();
    var count = 1;
    //Add rows 4 images per row.
    for (var i = 0; i < 4; i++) {
        var row = $("<div role=region aria-live=polite id=row" + (i + 1) + " class=row></row>");
        $(".grid").append(row);
        //add cards(buttons) to row
        for (var j = 0; j < 4; j++) {
            var card = $("<button aria-label=a-card id=card" + count + " class=card></button>");
            $("#row" + (i + 1)).append(card);
            count++;
        }
    }
    //Add css style for buttons(images)
    for (var x = 0; x < 16; x++) {
        $("#card" + (x + 1)).css("background-image", "url(img/card-back.png)");
        $("#card" + (x + 1)).css("height", (windowSize * 0.1) + "px");
        $("#card" + (x + 1)).css("width", (windowSize * 0.1) + "px");
        $("#card" + (x + 1)).css("border-style", "solid");
        $("#card" + (x + 1)).css("border-color", "black");
        $("#card" + (x + 1)).css("border-width", "5px");
        $("#card" + (x + 1)).css("margin", "20px");
        $("#card" + (x + 1)).css("background-position", "center");
        $("#card" + (x + 1)).css("background-size", "100%");
    }


}

//waits for user action and flips card if clicked
var lastTwo = ["", ""];
var click = 0;
function ifClicked() {

    var event = $(".card");
    
    
    var numberFound = 0;

    //waits for a card to be clciked
    event.click(function (event) {
        //makes sure only 2 cards flipped at once
        if (click != 2) {
            var element = event.target;
            $(element).css("background-image", "url(" + cardsUsed[element['id']].name + ")");
            cardsUsed[element['id']].flipped = true;
            lastTwo[click] = element['id'];
            click++;

            //waits for two clicks from user
            if (click == 2) {
                if ((cardsUsed[lastTwo[0]].name) != cardsUsed[lastTwo[1]].name || lastTwo[0] == lastTwo[1]) {
                    //waits for one second,calls function
                    setTimeout(flipCard, 1000);
                    //flips card back to starting posistion

                    //reSets back to 0 clicks
                } else {
                    lastTwo = [];
                    click = 0;
                    numberFound++;
                    //checks if game is over after match is made 
                    if (numberFound == 8) {
                        win();

                    }
                }
            }
        }
    });

}
function flipCard() {
    $("#" + lastTwo[0]).css("background-image", "url(img/card-back.png)");
    $("#" + lastTwo[1]).css("background-image", "url(img/card-back.png)");
    lastTwo = [];
    click = 0;
}

//creates popUp telling user they won
function win() {

    //creates popUp
    var winBox = $("<div class=modal-fade tabindex=-1 role=dialog></div>");
    $('header').append(winBox);
    var dialog = $("<div class=modal-dialog role=document></div>");
    $('.modal-fade').append(dialog);
    var content = $("<div class=modal-content></div>");
    $('.modal-dialog').append(content);
    var head = $("<h1 class=modal-title>YOU WIN!!!</h1>");
    $('.modal-content').append(head);
    var times = $("<h3 class=modal-title>It took you " + time + " seconds to finish </h3>");
    $('.modal-content').append(times);
    var body = $("<div class=modal-body></div>");
    $('.modal-content').append(body);
    var play = $("<button type=button id=play class=btn btn-primary>Play agian?</button>");
    $('.modal-body').append(play);
    $(".modal-body").css("text-align", "center");
    $(".modal-dialog").css("width", "200px");
    var plyAgian = $('#play');

    //waits for button click removes popUP and starts new game
    plyAgian.click(function (event) {
        $(".modal-fade").remove();
        $(".modal-dialog").remove();
        $(".modal-content").remove();
        $(".modal-title").remove();
        $(".modal-body").remove();
        $("#play").remove();
        createGrid();
        ifClicked();
    });

    clearInterval(timer);
}

//removes gird of cards
function removeGrid() {
    $(".card").remove();
    $(".row").remove();
}

//Sets background of the webpage
$("body").css("background-image", "url(img/swirl_pattern.png)");

//call methods and global variables
var buttonListin = $('#button');
var cardsUsed = [];
buttonListin.click(function (event) {

    cardsUsed = getCards();
    createGrid();
    ifClicked();
});




