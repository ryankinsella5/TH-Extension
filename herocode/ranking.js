/*
	Module: ranking.js - Controller for ranking module
	Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
	This contains functions used for updating the player ranking using the extension. Players can see letious ranks of skills or levels
	and compete against other players to become number one. No requests are needed to the backend for the ranking container
*/

//Allows us to populate the leaderboards with backend player data
let rankTabNames = ['exp', 'alchemy', 'blacksmithing', 'cooking', 'harvesting', 'jewelcrafting', 'leatherworking', 'mining', 'tailoring', 'woodcutting', 'woodworking'];

//Handles user actions regarding anything related to the ranking container
$(function() {

    //opens/closes up the ranking
    $('div.rankingbutton').click(function() {
        //if(!token) { return twitch.rig.log('Not authorized'); }
        if ($('div.ranking').css('display') == 'none') {
            $('div.ranking').fadeIn();
            $('div.rankingbutton').addClass('active');
            return;
        }
        
        $('div.ranking').fadeOut(); 
        $('div.rankingbutton').removeClass('active');

    });

    //opens ranking select based on what the user clicked
    $('#select').on('change', function (e) {
        
        let valueSelected = this.value;

        if (valueSelected == 'Level')
            valueSelected = 'exp';

        //First hide all containers
        makeAllRankingContainersNotActive();

        //Then show the container that was clicked
        let containerID = getHTMLIDOfRankingContainer(valueSelected);
        $(containerID).show();
    });
});

//Make the ranking window based on tab names
function buildRankingWindow() {

    let rankingHTMLID = 'div.ranking';

    //Build the select dropdown
    let rankingSelectStart = '<select id="select">';

    for (let i = 0; i < rankTabNames.length; i++) {

        let tempTabName = rankTabNames[i];

        if (i == 0)
            tempTabName = 'Level';

        let tempOptionHTML = '<option value="' + tempTabName + '" id = "option">' + titleCase(tempTabName) + '</option>';
        rankingSelectStart += tempOptionHTML;
    }
    
    //Add the select to the html
    $(rankingHTMLID).append(rankingSelectStart + '</select>');  

    //Build the top 10 player containers
    for (let i = 0; i < rankTabNames.length; i++) {

        //Hide the tab if not 0
        if (i != 0) {
            let tempHTML = '<div class = "tabContainer" id = "' + rankTabNames[i] + '" style="display: none"></div>';
            $(rankingHTMLID).append(tempHTML);
            continue;
        }

        //Show the first tab contents
        let tempHTML = '<div class = "tabContainer" id = "' + rankTabNames[i] + '"></div>';
        $(rankingHTMLID).append(tempHTML);
        
    }
    

}

//Updates ranking from data received from the backend
function updatePlayerRanking(rankingdata) {

    //For each tab name, populate the tab contents
    for (let i = 0; i < rankTabNames.length; i++) {

        let tempTabName = rankTabNames[i];
        let rankingHTMLID = 'div#' + tempTabName + '.tabContainer';
        let rankingHTMLContent = '';

        //If it doesn't exist, quit out
        if (rankingdata[tempTabName] == undefined) 
            return;;
        
        for (let j = 0; j < rankingdata[tempTabName].length; j++) {

            let tempRank = j + 1;
            let tempTabNameData = rankingdata[tempTabName][j];
            
            //Add spaces if rank is less than 10
            if (tempRank != 10) {
                rankingHTMLContent = rankingHTMLContent + '<div class = "rankleft">' + '&nbsp;' + '&nbsp;' + tempRank + '. ' + rankingdata[tempTabName][j].login + '</div> <div class = "rankright" id = "name">' + rankingdata[tempTabName][j][tempTabName] + '</div>'; 
                continue; 
            }

            //Otherwise normal html
            rankingHTMLContent = rankingHTMLContent + '<div class = "rankleft">' + tempRank + '. ' + rankingdata[tempTabName][j].login + '</div> <div class = "rankright" id = "name">' + rankingdata[tempTabName][j][tempTabName] + '</div>';  
            
        }

        //Update the tab html with the player ranking data
        $(rankingHTMLID).html(rankingHTMLContent);    
    } 
}

//Hide all of the ranking containers
function makeAllRankingContainersNotActive() {

    for (let i = 0; i < rankTabNames.length; i++) {
        let containerHTMLID = getHTMLIDOfRankingContainer(rankTabNames[i]);
        $(containerHTMLID).hide();
    }
}

//Returns the html id of passed tab name
function getHTMLIDOfRankingContainer(tabName) {
    return 'div#' + tabName + '.tabContainer';
}

//Makes the passed string's first letter uppercase
function titleCase(string){
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
