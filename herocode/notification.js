/*
    Module: notification.js - Controller for notification module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This module checks previous user data with new data to check if the user leveled up the last time data was sent.
*/

var oldPlayerData;

//Names of the data to check for level ups
var skillLevelUpNames = ['level', 'miningLevel', 'woodcuttingLevel', 'gatheringLevel', 'fishingLevel', 'blacksmithingLevel', 'leatherworkingLevel', 'tailoringLevel', 'woodworkingLevel'];

//Notification name
var notificationName = {
    level: 'Level',
    miningLevel: 'Mining',
    woodcuttingLevel: 'Woodcutting',
    gatheringLevel: 'Gathering',
    fishingLevel: 'Fishing',
    blacksmithingLevel: 'Blacksmithing',
    leatherworkingLevel: 'Leatherworking',
    tailoringLevel: 'Tailoring',
    woodworkingLevel: 'Woodworking',
};

//Called from player.js
function checkForLevelUp(newPlayerData) {

    //Check if player data is null, if it's not perform data checks
    if (typeof oldPlayerData !== 'undefined' && oldPlayerData !== null) {
        checkDataDifferences(newPlayerData);
        return;
    }

    //if the old data is null, update it and do nothing else (this is initialization basically)
    oldPlayerData = newPlayerData;
}

//Sort through the old and new data and show notifications on changes
function checkDataDifferences(newPlayerData) {

    //Check for skill level ups
    for (let i = 0; i < skillLevelUpNames.length; i++) {

        let tempDataName = skillLevelUpNames[i];

        //If the new level is higher than the old level, then the player leveled up
        if (newPlayerData[tempDataName] > oldPlayerData[tempDataName]) 
            levelNotification(tempDataName, newPlayerData[tempDataName]);
    }

    //Check for resource increases
    for (const key in resources) {

        if (newPlayerData[key] > oldPlayerData[key]) {
            //Resource amount increased
            let resourceIncrease = newPlayerData[key] - oldPlayerData[key];
            resourcesReceieved(resources[key].resourceName, resourceIncrease, resources[key].resourceImage);
        }
    }

    //Check for xp increases (skillObjects is defined in skills.js)
    for (const key in skillObjects) {

        //If the new xp is higher than the old xp
        if (newPlayerData[key] > oldPlayerData[key]) {
            let xpIncrease = newPlayerData[key] - oldPlayerData[key];
            xpGained('images/skillicons/' + key + '.png', xpIncrease);
        }
    }

    //Check if more arrows
    if (newPlayerData['arrows'] > oldPlayerData['arrows']) {
            let resourceIncrease = newPlayerData['arrows'] - oldPlayerData['arrows'];
            xpGained('images/weapons/Arrow.png', resourceIncrease);
    }

    //Check if they gained level xp (not a skill)
    if (newPlayerData['exp'] > oldPlayerData['exp']) {
        let xpIncrease = newPlayerData['exp'] - oldPlayerData['exp'];
        xpGained('images/staticons/level.png', xpIncrease);
    }

    //Update the old player data with the new data since we don't need it anymore
    updateOldPlayerData(newPlayerData);
}

//Update old data with the new data
function updateOldPlayerData(passedOldData) {
    oldPlayerData = passedOldData;
}

//Pass what leveled up and the new level. Edit the notification to show what leveled up 
function levelNotification(levelUpName, levelAchieved) {

    //If the level up is a skill level up
    if (levelUpName != 'level') {
        newLevelNotification(notificationName[levelUpName] + ' level ' + levelAchieved + '!');
        return;
    }

    //Otherwise a player level up
    newLevelNotification('Level ' + levelAchieved + '!');
}

function resourcesReceieved(resourceName, resourceIncrease, resourceImage) {

    let resourceNotificationHTML = resourceIncrease + 'x ' + resourceName + '<img style="vertical-align:middle" id = "skillicon" src="' + resourceImage + '"/>';

    //Update notification
    $('div.resourceNotification').html(resourceNotificationHTML);

    $('div.resourceNotification').show();

    //Set a timer to hide the notifcation
    hideResourceNotification();
}

function xpGained(skillImage, xpIncrease) {

    let xpNotificationHTML = '+' + xpIncrease + ' ' + '<img style="vertical-align:middle" id = "skillicon" src="' + skillImage + '"/>';

    //Update html
    $('div.xpNotification').html(xpNotificationHTML);

    $('div.xpNotification').show();

    //Set a timer to hide the notifcation
    hideXPNotification();
}

function newLevelNotification(notificationString) {

    //Update notification
    $('div.levelNotification').html(notificationString);

    //Set a timer to hide the notifcation
    hideLevelNotification();
}

//Hide the notification after a duration has passed
function hideLevelNotification() {

    setTimeout(function(){
        $('div.levelNotification').html('');
    }, 2500);
}

//Hide the notification after a duration has passed
function hideResourceNotification() {

    setTimeout(function(){
        $('div.resourceNotification').html('');
        $('div.resourceNotification').hide();
    }, 2500);
}

//Hide the notification after a duration has passed
function hideXPNotification() {

    setTimeout(function(){
        $('div.xpNotification').html('');
        $('div.xpNotification').hide();
    }, 2500);
}