let deck = [];   // Array of cards

let dealerSum = 0; // Keeps track of the sum of the dealer's cards
let playerSum = 0; // Keeps track of the sum of the player's cards

let dealerAceCount = 0; // Keeps track of the number of aces the dealer has
let playerAceCount = 0; // Keeps track of the number of aces the player has

let dealerNumCards = 0; // Keeps track of the number of cards the dealer has

let dealerScore = 0;
let playerScore = 0;
let dealerScoreElem = document.querySelector(".dealer-score");
let playerScoreElem = document.querySelector(".player-score");

let isHidden = true;
let canHit = true;

let hiddenCard = document.querySelector(".hidden-card"); // The hidden card in the dealer's hand
let hidden; // The hidden card in the deck

const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const gameStatus = document.querySelector('.status');
const buttonsContainer = document.querySelector('.buttons-container');

hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);

window.onload = function(){
    startNewGame();
}

function startNewGame(){
    buildDeck();
    shuffleDeck();
    dealCards();
}

function buildDeck(){
    let suits = ["clubs", "diamonds", "hearts", "spades"];
    let values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    isHidden = true;
    canHit = true;

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j <= values.length - 1; j++) {
            deck.push(suits[i] + "_" + values[j]);
        }
    }
    // console.log({deck});
}

function shuffleDeck(){
    for (let i = 0; i < 1000; i++) {
        let random1 = Math.floor(Math.random() * deck.length);
        let random2 = Math.floor(Math.random() * deck.length);
        let temp = deck[random1];
        deck[random1] = deck[random2];
        deck[random2] = temp;
    }
    // console.log({deck});
}

function dealCards(){
    dealCardsToDealer();
    dealCardstoPlayer();
}

function dealCardsToDealer(){
    hidden = deck.pop(); // Gets the last card in the deck array
    dealerSum += getCardValue(hidden); // Adds the value of the card to the dealer's sum
    dealerAceCount += checkAce(hidden); // Checks if the card is an ace and adds 1 to the dealer's ace count

    while (dealerSum < 17 && dealerNumCards != 1){
        let card = deck.pop();
        createCard(card, "dealer-cards");

        dealerSum += getCardValue(card);
        dealerAceCount += checkAce(card);
        dealerNumCards++;
    }
    // console.log({dealerSum});
    // console.log(dealerAceCount);
    updateDealerScoreElem(dealerSum);
}

function dealCardstoPlayer(){
    for(let i = 0; i < 2; i++){
        let card = deck.pop();
        createCard(card, "player-cards");

        playerSum += getCardValue(card);
        playerAceCount += checkAce(card);

    }
    // console.log({playerSum});

    if(playerSum == 21){
        checkWinCondition();
    }

    updatePlayerScoreElem(playerSum);

    // console.log({playerAceCount});
}

function createCard(card, elem){
    const cardElem = createElement("div"); // Creates a div element
    const cardImg = createElement("img"); // Creates an img element
    addClassToElement(cardElem, "card"); // Adds the class "card" to the div element
    addSrcToImageElem(cardImg, "images/" + card + ".png"); // Adds the src attribute to the img element
    addClassToElement(cardImg, "card-img"); // Adds the class "card-img" to the img element
    addChildElement(cardElem, cardImg); // Adds the img element to the div element
    addChildElement(document.querySelector(`.${elem}`), cardElem); // Adds the div element to the element with the class "player-cards"
}

function getCardValue(card){
    let value = card.split("_")[1];

    if (value == "ace") {
        return 11;
    } else if (value == "jack" || value == "queen" || value == "king") {
        return 10;
    } else {
        return parseInt(value);
    }
}

function checkAce(card){
    // console.log({card});
    if(card.split("_")[1] == "ace"){
        return 1;
    } else {
        return 0;
    }
}

function reduceAce(sum, aceCount){
    if(sum > 21 && aceCount > 0){
        return true;
    } else {
        return false;
    }
}

function updateDealerScoreElem(sum){
    if(isHidden){
        dealerScoreElem.textContent = `${sum - getCardValue(hidden)}?`;
    } else {
        dealerScoreElem.textContent = sum;
    }
}

function updatePlayerScoreElem(sum){
    playerScoreElem.textContent = sum;
}

function hit(){
    if(!canHit){
        return;
    }
    let card = deck.pop();
    createCard(card, "player-cards");

    playerSum += getCardValue(card);
    playerAceCount += checkAce(card);
    // console.log({playerSum});
    // console.log({playerAceCount})
    
    if(reduceAce(playerSum, playerAceCount)){
        playerSum -= 10;
        playerAceCount--;
    }

    if(playerSum > 21){
        checkWinCondition();
    }

    updatePlayerScoreElem(playerSum);
    // console.log({playerSum});
}

function stand(){
    canHit = false;

    revealHiddenCard();

    // if(reduceAce(dealerSum, dealerAceCount)){
    //     dealerSum -= 10;
    //     dealerAceCount--;
    // }
    
    while(dealerSum < 21){
        if(dealerSum > playerSum)
        break;
        
        let card = deck.pop();
        createCard(card, "dealer-cards");
        
        dealerSum += getCardValue(card);
        dealerAceCount += checkAce(card);

        if(reduceAce(dealerSum, dealerAceCount)){
            dealerSum -= 10;
            dealerAceCount--;
        }
    }
    checkWinCondition();
    updateDealerScoreElem(dealerSum);

    // console.log({dealerSum});
    // console.log({playerSum});
}

function revealHiddenCard(){
    isHidden = false;
    hiddenCard.innerHTML = "";
    createCard(hidden, "hidden-card");
    updateDealerScoreElem(dealerSum);
}

function checkWinCondition(){
    if(isHidden){
        revealHiddenCard();
    }

    if(playerSum > 21){
        updateStatusElement(gameStatus, "block", "red", "Player busts. Dealer wins!");
        dealerScore++;
    } else if (dealerSum > 21){
        updateStatusElement(gameStatus, "block", "green", "Dealer busts. Player wins!");
        playerScore++;
    } else if (playerSum == 21){
        updateStatusElement(gameStatus, "block", "green", "Blackjack! Player wins");
        playerScore++;
    } else if (dealerSum == 21){
        updateStatusElement(gameStatus, "block", "red", "Blackjack! Dealer wins");
        dealerScore++;
    } else if (playerSum > dealerSum){
        updateStatusElement(gameStatus, "block", "green", "Player wins!");
        playerScore++;
    } else if (playerSum < dealerSum){
        updateStatusElement(gameStatus, "block", "red", "Dealer wins!");
        dealerScore++;
    } else {
        updateStatusElement(gameStatus, "block", "black", "Tie!");
    }

    
    hitBtn.disabled = true;
    standBtn.disabled = true;
    // hitBtn.parentNode.removeChild(hitBtn);
    // standBtn.parentNode.removeChild(standBtn);

    // setTimeout(()=>{
    //     let newGameBtn = createElement("button");
    //     addClassToElement(newGameBtn, "new-game-btn");
    //     addClassToElement(newGameBtn, "btn");
    //     addIdToElement(newGameBtn, "new-game-btn");
    //     newGameBtn.innerHTML = "New Game";
    //     addChildElement(buttonsContainer, newGameBtn);
    //     newGameBtn.addEventListener("click", newGame);
    // }, 1000);

}

function newGame(){
    hitBtn.disabled = false;
    standBtn.disabled = false;
    document.querySelector(".new-game-btn").parentNode.removeChild(document.querySelector(".new-game-btn"));
    updateStatusElement(gameStatus, "block", "black", "");
    playerSum = 0;
    dealerSum = 0;
    playerAceCount = 0;
    dealerAceCount = 0;
    isHidden = true;

    // document.querySelector(".dealer-cards").innerHTML = "";
    // document.querySelector(".player-cards").innerHTML = "";
    // const hiddenCardElem = createElement("div"); 
    // addClassToElement(hiddenCardElem, "card");
    // addClassToElement(hiddenCardElem, "hidden-card");
    // const hiddenCardImgElem = createElement("img");
    // addClassToElement(hiddenCardImgElem, "card-img");
    // addSrcToImageElem(hiddenCardImgElem, "images/blue.png");
    // addChildElement(hiddenCardElem, hiddenCardImgElem);

    // startNewGame();
}

function createElement(elemType){
    return document.createElement(elemType);
}

function addClassToElement(elem, className){
    elem.classList.add(className);
}

function addIdToElement(elem, id){
    elem.id = id;
}

function addSrcToImageElem(imgElem, src){
    imgElem.src = src;
}

function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem);
}

function updateStatusElement(elem, display, color, innerHTML){
    elem.style.display = display;

    if(arguments.length > 2){
        elem.style.color = color;
        elem.innerHTML = innerHTML;
    }
}

// TODO: change the behavior of the hidden-card
// TODO: implement a new game button that resets the game