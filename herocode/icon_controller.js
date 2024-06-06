/*
    Module: icon_controller.js - Controller for icon_controller module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions use for handing container opening and closing when icons are clicked
*/

//Only one of these containers is allowed to be active at any given time
const rightContainers = {
    skillsbutton: {containerID: 'div.skills', buttonID: 'div.skillsbutton'},
    spellsbutton: {containerID: 'div.spellsWindow', buttonID: 'div.spellsbutton'},
};

//Only one of these containers is allowed to be active at any given time
const leftContainers = {
    dungeonbutton: {containerID: 'div.dungeon', buttonID: 'div.dungeonbutton'},
    rankingbutton: {containerID: 'div.ranking', buttonID: 'div.rankingbutton'},
    craftingbutton: {containerID: 'div.crafting', buttonID: 'div.craftingbutton'},
};

$(function() {

    $('div.skillsbutton').click(function() {
        closeContainersOnSameSide($(this).attr('class')); 
    });

    $('div.craftingbutton').click(function() {
        closeContainersOnSameSide($(this).attr('class'));
    });

    $('div.dungeonbutton').click(function() {
        closeContainersOnSameSide($(this).attr('class'));
    });

    $('div.rankingbutton').click(function() {
        closeContainersOnSameSide($(this).attr('class'));
    });

    $('div.spellsbutton').click(function() {
        closeContainersOnSameSide($(this).attr('class'));
    });

});

//Closes open containers with the same side. Excludes contains on right side
function closeContainersOnSameSide(buttonID) {

    let buttonName = buttonID.split(" ")[0];

    if (rightContainers.hasOwnProperty(buttonName)) {
        closeAllRightContainersNotIncludingPassed(buttonName);
    }  

    if (leftContainers.hasOwnProperty(buttonName)) {
        closeAllLeftContainersNotIncludedPassed(buttonName);
    }   
}

function closeAllRightContainersNotIncludingPassed(buttonID) {

    for (const key in rightContainers) {

        //If not passed, then make it inactive
        if (key != buttonID) {
            let containerToCloseID = rightContainers[key].containerID;
            let buttonToMakeInactiveID = rightContainers[key].buttonID;

            $(containerToCloseID).fadeOut(); 

            //Make button inactive
            $(buttonToMakeInactiveID).removeClass('active');
        }
    }
}   

function closeAllLeftContainersNotIncludedPassed(buttonID) {

    for (const key in leftContainers) {

        //If not passed, then make it inactive
        if (key != buttonID) {
            let containerToCloseID = leftContainers[key].containerID;
            let buttonToMakeInactiveID = leftContainers[key].buttonID;

            //Hide container
            $(containerToCloseID).fadeOut(); 

            //Make button inactive
            $(buttonToMakeInactiveID).removeClass('active');
        }
        
    }
}