/*
    Module: player.js - Controller for player module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This module is used for building the stats window and updating it.
*/

//Allows us to easily build the stats window and add new ones if necessary. Also allows us to update the total stats and stat tooltips.
const statsObjects = 
{
    level: {defaultTooltip: 'Increases maximum health and mana by 5 per level and +1 to all stats for every 5 levels'},
    armor: {defaultTooltip: 'Reduces damage taken by 1 per point'},
    strength: {defaultTooltip: 'Increases physical damage by 1 per point'},
    intelligence: {defaultTooltip: 'Increases magic damage by 1 per point'},
    dexterity: {defaultTooltip: 'Increases critical strike chance by .5% per point<br>Increases movement speed by 1% per 10 points'},
    constitution: {defaultTooltip: 'Increases max health by 5 per point, health regeneration by 1 per 5 points'}, 
    wisdom: {defaultTooltip: 'Increases mana regeneration by 1 per 5 points'}, 
};

//Levels required for an extra stat
const oneStatPerAmountOfLevels = 5;

//Stats that are increased by level
const statsIncreasedByLevel = ['strength', 'intelligence', 'dexterity', 'constitution', 'wisdom'];

//Builds the skill window based on the skill objects
function buildStatsWindow() {

    for (const key in statsObjects) {

        let tempStatObject = statsObjects[key];

        let tempStatHTML = '<div class = "statcontainer">' + 
                                '<div class = "statleft">' +
                                    '<div class="tooltip">' +
                                        '<img style="vertical-align:middle" id = "skillicon" src="images/staticons/' + key + '.png"/> '  + key +
                                        '<span class="tooltiptext" id = "' + key + 'tooltip">' + tempStatObject.defaultTooltip + '</span>' +
                                    '</div>' +
                                '</div>' +
                                '<div class = "statright" id = "' + key + '">' + 0 + '</div>' +
                            '</div>';

        $('div.center').append(tempStatHTML);
    }
}

//Updates the stats window 
function updateStatsWindow() {

    //Add stats from player level
    let statsFromPlayerLevel = Math.floor(playerData.level / oneStatPerAmountOfLevels);

    for (const key in statsObjects) {

        let statRightID = 'div#' + key + '.statright';
        let toolTipLocation = 'span#' + key + 'tooltip.tooltiptext';

        if (key == 'level') {

            let playerExp = playerData.exp;
            let tempLevelToolTipString = statsObjects[key].defaultTooltip + '<div class = "spellText">Total xp: ' + formatCurrentExpAndNextLevel(playerExp) + '</div>';

            $(statRightID).html(playerData.level);
            $(toolTipLocation).html(tempLevelToolTipString);

            continue;
        }

        let totalStatsFromItems = playerData[key];
        let totalStatsFromSkills = playerData[key + 'FromSkills'];
        let statRightString = totalStatsFromItems + totalStatsFromSkills; 

        //If the current key is increased by level, add it to totals
        if (statsIncreasedByLevel.includes(key)) 
            statRightString += statsFromPlayerLevel;

        //If a stat buff is active for this stat, add buff stat html
        if (totalStatsFromBuffs[key] > 0) {
    
            if (totalStatsFromBuffs[key] > 0) 
                statRightString += '<span class = "buffAddedStats">+' + totalStatsFromBuffs[key] + '</span>';
    
            if (key == 'health') {
                if (totalStatsFromBuffs.constitution > 0)
                    statRightString += '<span class = "buffAddedStats">+' + (totalStatsFromBuffs.constitution * 5) + '</span>';
            }
        }
    
        //Update the stat
        $(statRightID).html(statRightString);
    
        //Make the tooltip
        let statTooltipString = statsObjects[key].defaultTooltip + '<div class = "spellText">Items: ' + totalStatsFromItems + '<br>' + 'Skills: ' + totalStatsFromSkills;
        
        if (statsIncreasedByLevel.includes(key)) 
            statTooltipString += '<br>Level: ' + statsFromPlayerLevel;

        else
            statTooltipString += '<br>Level: 0';
        
        statTooltipString += '</div>';

        //Update the tooltip
        $(toolTipLocation).html(statTooltipString);
    }
}

