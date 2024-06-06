/*
    Module: dungeon.js - Controller for dungeon module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for updating the dungeon voting information for users. It will display all avaiable dungeons to vote on
    along with allowing users to vote for the next dungeon.
*/

//Current time in utc format
var currentUTCTime = new Date(new Date().toUTCString().substr(0, 25));

//Dungeon end date, will just initialize as current utc time. Backend will send us an updated end date later.
var countDownDate = new Date(new Date().toUTCString().substr(0, 25));

//HTML id of timer div
var dungeonTimerHTMLID = 'div.dungeontimer';

//Sends the dungeon vote request to the backend 
function requestUserVote(uservote) {
    return {
        type: 'POST',
        url: backendurl + 'dungeonvote/' + uservote,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

//Handles user actions regarding anything related to dungeons/dungeons voting
$(function() {

    //Creates a request when a player votes for a dungeon
    $('body').on('click', '.dungeonvote', function() {
        let vote = $(this).html();
        
        //Check if user is in cooldown or not and there exists a date
        if (checkUserInCooldown() === false && countDownDate !== null) {

            // Get utc date and time to compare to vote date
            currentUTCTime = new Date(new Date().toUTCString().substr(0, 25));

            //if the current time is less than vote date then the vote is still going and the player can vote
            if (currentUTCTime < countDownDate) {
                $.ajax(requestUserVote(vote));
            }
        } 
    }
    );

    //Opens/closes up the dungeon voting window
    $('div.dungeonbutton').click(function() {
        //if(!token) { return twitch.rig.log('Not authorized'); }
        if ($('div.dungeon').css('display') == 'none') {
            $('div.dungeon').fadeIn();
            $('div.dungeonbutton').addClass('active');
        }
        
        else {
            $('div.dungeon').fadeOut(); 
            $('div.dungeonbutton').removeClass('active');
        }
    });
});

//This function adds clickable vote options in the dungeon menu. Will allow us to more easily add new dungeons without having to update the frontend application.
function updateDungeonListFromBackEnd(dungeonVoteData) {
    
    //HTML Link to the dungeon voting "menu"``
    let dungeonMenuHTMLID = 'div.dungeonlist';

    //Clear the previous list of dungeons
    $(dungeonMenuHTMLID).empty();
    
    //Create the HTML elements with the dungeon data
    for (let i = 0; i < dungeonVoteData.length; i++) {

        let dungeonDropsHTML = 'Drops: ';
        let tempDropsArray = dungeonVoteData[i].drops;

        //Loop through drops array and make the tooltip text
        for (let j = 0; j < tempDropsArray.length; j++) {

            dungeonDropsHTML += '<img style="vertical-align:middle" id = "skillicon" src="' + resources[tempDropsArray[j]].resourceImage + '"/>';
        }

        let dungeonHTMLLeft =   '<div class = "statcontainer">' +  
                                    '<div class = "dungeonNameLeft">' +
                                        '<div class="tooltip">' +
                                            '<button class = "dungeonvote" id = "dungeonvote">' + dungeonVoteData[i].name +  '</button>' +
                                            '<span class="tooltiptext">' +
                                                '<div class = "spellName">' +  dungeonVoteData[i].name + '</div>' +
                                                '<div class = "spellRequirement">Tier: ' +  dungeonVoteData[i].tier + '</div>' +
                                                '<div class = "spellText">' + dungeonDropsHTML + '</div>' +
                                            '</span>' +
                                        '</div>' +
                                    '</div>';

        let dungeonHTMLRight =  '<div class = "statright" id = "dungeon' + i + '">' + dungeonVoteData[i].votes + '</div>' + '</div>';

        let dungeonHTML = dungeonHTMLLeft.concat(dungeonHTMLRight);

        $(dungeonMenuHTMLID).append(dungeonHTML);   
    }
    
}

//Updates the current countdown date with the date sent from the backend
function updateDungeonVoteTime(dungeonEndDate) {
    countDownDate = new Date(dungeonEndDate);
}

//Update the count down every 1 second
let x = setInterval(function() {

    // Get utc date and time of now
    currentUTCTime = new Date(new Date().toUTCString().substr(0, 25));

    //Voting is over if the current time is greater than the end date
    if (currentUTCTime > countDownDate) {
        $(dungeonTimerHTMLID).html('Voting Ended');  
    }
    
    //Otherwise update timer with the time remaining
    else {
        updateTimer();
    }
    
}, 1000);

//Updates the timer based on the difference between current date and dungeon end date
function updateTimer() {

    // Find the time difference between now and the count down date
    let timeDifference = countDownDate - currentUTCTime;
    
    //let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    //let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    //Puts a 0 place holder if less than 10
    if (seconds < 10) {
        $(dungeonTimerHTMLID).html(minutes + ':0' + seconds);   
    }
    
    else {
        $(dungeonTimerHTMLID).html(minutes + ':' + seconds);   
    }
}