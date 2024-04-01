/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
// modified to only remove game-card divs
function deleteGameContainerChildren() {
    document.querySelectorAll(".game-card").forEach( div => {
        div.parentNode.removeChild(div)
    });
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// OPTIONAL TOUCHUP: optimized version of the addGamesToPage using document fragments:)
// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
     // we create a lightweight copy of the document
    const fragment = document.createDocumentFragment();

    // loop over each item in the data
        for(let i = 0; i < games.length; i++) {

        // create a new div element, which will become the game card
            const newDiv = document.createElement("div");

        // add the class game-card to the list
            newDiv.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
            newDiv.innerHTML = `<img src=${games[i].img} class="game-img"> <br><br>
                                <strong>${games[i].name}</strong> <br> <br>
                                ${games[i].description} <br><br>
                                Pledged: ${games[i].pledged} <br>
                                Goal: ${games[i].goal} <br>
                                Backers: ${games[i].backers} <br>`;
            // we append our new div to the fragment instead of the DOM node
            fragment.append(newDiv);
        }
        // once we have created all the elements we want, we can simply append it
        document.getElementById("games-container").append(fragment);

}
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas

contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-CA')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
}, 0);

// set inner HTML using template literal

const formattedTotalRaised = totalRaised.toLocaleString('en-CA', {style:'currency', currency:'CAD',
                                                                    minimumFractionDigits: 0});

raisedCard.innerHTML = `${formattedTotalRaised}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

gamesCard.innerHTML = `${GAMES_JSON.length}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

const interactContainer = document.getElementById("interaction-container");
// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    interactContainer.scrollIntoView(true);
    deleteGameContainerChildren();

    // use filter() to get a list of games that have not yet met their goal

    const unfundedOnlyList = GAMES_JSON.filter((game) => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM

    addGamesToPage(unfundedOnlyList);
}

// show only games that are fully funded
function filterFundedOnly() {
    interactContainer.scrollIntoView(true);
    deleteGameContainerChildren();

    // use filter() to get a list of games that have met or exceeded their goal

    const fundedOnlyList = GAMES_JSON.filter((game) => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedOnlyList);
}

// show all games
function showAllGames() {
    interactContainer.scrollIntoView(true);
    deleteGameContainerChildren();

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
// Using filter()
const unfundedCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Using reduce()
// const unfundedCount = GAMES_JSON.reduce((count, game) => {
//     if (game.pledged < game.goal) count++;
//     return count;
// }, 0);

// create a string that explains the number of unfunded games using the ternary operator

const fundingStatus = `A total of ${formattedTotalRaised} has been raised for ${GAMES_JSON.length} games. Currently, 
        ${unfundedCount == 1 ? unfundedCount + ' game remain unfunded.' : unfundedCount + ' games remain unfunded.'} 
        <br>We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container

const fundingStatusText = document.createElement("p");
fundingStatusText.innerHTML = fundingStatus;
descriptionContainer.append(fundingStatusText);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// Added slice() method so that we don't mutate the original arrays order and instead create a new array!
const sortedGames =  GAMES_JSON.slice().sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

const [firstGame, secondGame, ...rest ] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element

const topFundedGame = document.createElement("p");
topFundedGame.innerHTML = firstGame.name;

firstGameContainer.append(topFundedGame);

// do the same for the runner up item

const runnerUpGame = document.createElement("p");
runnerUpGame.innerHTML = secondGame.name;

secondGameContainer.append(runnerUpGame);

// Extra features: Search bar!

// validating that the input is alpha-numeric (with potential spaces)
function validateInput(input) {
    return /^[a-z0-9\s]+$/.test(input);
}

// used for debouncing our update function so that the search is not filtered after every key press
// but instead after a user stops typing for a set time
function debounce(func, delay) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args)
        }, delay);
    }
}

// a debounced function which updates the gamesContainer based on the user's search
const updateGameResults = debounce((input) => {

    // check if the input box is empty, then display all the games without a filter
    if (!input.length) {
        showAllGames();
        error.style.display = "none";
        return;
    }

    if (validateInput(input)) {
        const gameCards = document.querySelectorAll(".game-card");
        let results = GAMES_JSON.filter(game => {
            return game.name.toLowerCase().includes(input);
        });
        
        // remove all the game cards
        gameCards.forEach((div) => {
            div.parentNode.removeChild(div);
        });

        // show an error message if results array is empty otherwise populate the gamesContainer with the results
        if (!results.length) {
            error.innerHTML = `<strong>${input}</strong> could not be found... :(`;
            error.style.display = "block";
        } 
        else {
            addGamesToPage(results);
            error.style.display = "none";
        }
    }
}, 500);

const error = document.createElement("p");
error.classList.add("error");
gamesContainer.append(error);

const searchInput = document.getElementById("search-bar");

searchInput.addEventListener('input', (event) => {
    let input = event.target.value.trim().toLowerCase();
    updateGameResults(input);
});