/*
    Module: buffs.js - Controller for buffs module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions for displaying player buffs and the stats they provide.
*/

const buffs = {

    //Food
    Cheese: {buffName: 'cheese', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 5, manaRegeneration: 5, percentStatsAdded: 10, consumableBuffName: 'foodname', consumableBuffDuration: 'foodduration', consumableImage: 'images/food/cheese.png', buffToolTip: '<div class = "itemname">Cheese</div><div class = "itemText">+10% All Stats<br>5 hp/mana every 10s</div>'},
    
    //Potions
    MiningPotion: {buffName: 'miningpotion', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'potionname', consumableBuffDuration: 'potionendtime', consumableImage: 'images/alchemy/blackvial.png', buffToolTip: '<div class = "itemname">Mining Potion</div><div class = "itemText">+10 Mining</div>'},
    HarvestingPotion: {buffName: 'harvestingpotion', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'potionname', consumableBuffDuration: 'potionendtime', consumableImage: 'images/alchemy/greenvial.png', buffToolTip: '<div class = "itemname">Harvesting Potion</div><div class = "itemText">+10 Harvesting</div>'},
    WoodcuttingPotion: {buffName: 'woodcuttingpotion', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'potionname', consumableBuffDuration: 'potionendtime', consumableImage: 'images/alchemy/orangevial.png', buffToolTip: '<div class = "itemname">Woodcutting Potion</div><div class = "itemText">+10 Woodcutting</div>'},

    CombatMaster: {buffName: 'combatmaster', spellBuff: 'yes', strength: 0, intelligence: 0, dexterity: 20, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'buffspell', consumableBuffDuration: 'combatmaster', consumableImage: 'images/spells/combatmaster.png', buffToolTip: '<div class = "itemname">Combat Master</div><div class = "itemText">+20 Dexterity</div>'},
    MinorWisdom: {buffName: 'minorwisdom', spellBuff: 'yes', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: 0, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'buffspell', consumableBuffDuration: 'minorwisdom', consumableImage: 'images/spells/wisdom.png', buffToolTip: '<div class = "itemname">Minor Wisdom</div><div class = "itemText">+5 Mana Regeneration</div>'},
    Defend: {buffName: 'defend', spellBuff: 'yes', strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, armorPerCon: .25, regeneration: 0, percentStatsAdded: 0, consumableBuffName: 'buffspell', consumableBuffDuration: 'defend', consumableImage: 'images/spells/fortify.png', buffToolTip: '<div class = "itemname">Defend</div><div class = "itemText">+ Armor</div>'},
};

var totalStatsFromBuffs = { 
    strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, armor: 0, health: 0, armor: 0, regeneration: 0, mining: 0, harvesting: 0, woodcutting: 0,
};

function updatePlayerBuffs() {

    let currentUTCTime = Date.now();

    //Clear all current buffs so we can add new ones
    clearAllBuffs();

    //Reset the total stats so we can added the new ones
    resetTotalStatsFromBuffs();

    //Add new buffs
    addCurrentBuffs(currentUTCTime);
}

function clearAllBuffs() {
    $('div.buffBarContainer').html('');
}

function addCurrentBuffs(currentUTCTime) {

    for (const key in buffs) {

        //Object of the referenced buff
        let tempBuffObject = buffs[key];

        //Buff image location
        let consumableImage = tempBuffObject.consumableImage;

        //Check if buffnames match
        let buffName = tempBuffObject.buffName;

        //Consumables
        if (userdata.foodname == buffName || userdata.potionname == buffName) {
            //Buff end time
            let consumableEndTime = tempBuffObject.consumableBuffDuration;
            let endDate = userdata[consumableEndTime];
    
            let remainingTimeFormatted = getRemainingTimeFormatted(currentUTCTime, endDate);
            let buffToolTipText = tempBuffObject.buffToolTip;

            if (endDate > currentUTCTime) { 
                addStatsToTotal(tempBuffObject)
                addNewBuffHTML(remainingTimeFormatted, consumableImage, buffToolTipText);
            }
        }

        //Buff spells
        if (tempBuffObject.spellBuff == 'yes') {

            //Buff end time
            let consumableEndTime = tempBuffObject.consumableBuffDuration;
            let endDate = userdata[consumableEndTime];
    
            let remainingTimeFormatted = getRemainingTimeFormatted(currentUTCTime, endDate);
            let buffToolTipText = tempBuffObject.buffToolTip;

            if (endDate > currentUTCTime) { 
                addStatsToTotal(tempBuffObject)
                addNewBuffHTML(remainingTimeFormatted, consumableImage, buffToolTipText);
            }
        }
    }
}

//Get the remaining time of the buff
function getRemainingTimeFormatted(currentUTCTime, endDate) {

    // Find the time difference between now and the count down date
    let timeDifference = endDate - currentUTCTime;
    
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 1) {
        return hours + 'h';
    }

    if (minutes >= 1) {
        return minutes + 'm';
    }
    
    else {
        return '<1m';
    }
}

function addNewBuffHTML(remainingTimeFormatted, consumableImage, buffToolTipText) {

    let buffString =    '<div class = buffContainer>' + 
                            '<div class="buffToolTip"> '+
                            '<span class="tooltiptext">' + buffToolTipText + '</span>' + 
                                '<div class = "buffImage"><img style="vertical-align:middle" id = "buffImage" src="' + consumableImage + '"/>' +
                                '</div>' + 
                                '<div class = "buffDuration">' + remainingTimeFormatted + '</div>' + 
                            '</div>' +
                        '</div>';

    $('div.buffBarContainer').append(buffString);
}

//Add the stats from this buff to totalStats
function addStatsToTotal(tempBuffObject) {
    
    let tempBuffPercentage = tempBuffObject.percentStatsAdded / 100;
    let tempStatsFromLevel = playerData.level / 5;

    for (const key in totalStatsFromBuffs) {

        //Total stat value of items + skills + levels
        let tempTotalStat = playerData[key] + playerData[key + 'FromSkills'] + tempStatsFromLevel;

        //Add flat stats
        totalStatsFromBuffs[key] += tempBuffObject[key];

        //Add percent stats
        totalStatsFromBuffs[key] += Math.floor(tempTotalStat * tempBuffPercentage);
    }

    //Add armor per constitution
    if (tempBuffObject.armorPerCon > 0) {
        let totalCon = playerData['constitution'] + playerData['constitution' + 'FromSkills'] + tempStatsFromLevel;

        console.log(totalCon);
        totalStatsFromBuffs.armor += Math.floor(totalCon * tempBuffObject.armorPerCon);
    }

}

//Reset the total stats so we can add all current buffs
function resetTotalStatsFromBuffs() {
    for (const key in totalStatsFromBuffs) {
        totalStatsFromBuffs[key] = 0;
    }
}