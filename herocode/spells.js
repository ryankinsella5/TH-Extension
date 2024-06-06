/*
    Module: spells.js - Controller for spells module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This controller will create the usable spells based on the spelllist object.
    This contains functions used for player interacting with the spells container. 
    Displays available spells to the user and allows them to drop these spells on their hotbar to use.
    These spells can then be used to perform actions in game.
*/

//Spell list to verify user actions are real spells. Also allows us to dynamically create spells based on this object.
//Contains the required stats to use these spells to verify they can use these spells.
//Backend will verify again. 
const spellList = 
{
    //Strength
    autoattack: {spellName: 'Auto Attack', tabID: 1, spellToolTipText: 'Slash the target causing damage equal to strength plus weapon damage', mana: 1, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/autoattack.png'},
    lightningstrike: {spellName: 'Lightning Strike', tabID: 1, spellToolTipText: 'Strike the target causing damage equal to strength plus 50% of intelligence plus weapon damage', mana: 5, strength: 40, intelligence: 30, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/lightning.png'},
    siphoningstrike: {spellName: 'Siphoning Strike', tabID: 1, spellToolTipText: 'Siphon mana from the target causing damage equal to strength plus weapon damage recovering 5% of damage dealt as mana', mana: 0, strength: 40, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 30, buffSpell: 'no', spellImage: 'images/spells/leech.png'},
    cleave: {spellName: 'Cleave', tabID: 1, spellToolTipText: 'Slash the target and enemies within proximity causing damage equal to strength plus weapon damage', mana: 7, strength: 60, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, buffSpell: 'no', spellImage: 'images/spells/cleave.png'},

    //Intelligence
    firebolt: {spellName: 'Fire Bolt', tabID: 2, spellToolTipText: 'Throws a bolt of fire dealing damage equal to intelligence plus weapon damage', mana: 1, strength: 0, intelligence: 15, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/firebolt.png'},
    icebolt: {spellName: 'Ice Bolt', tabID: 2, spellToolTipText: 'Launches a bolt of ice dealing damage equal to intelligence and slowing the target by 25% plus weapon damage', mana: 3, strength: 0, intelligence: 25, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/ice.png'},
    rockthrow: {spellName: 'Rock Throw', tabID: 2, spellToolTipText: 'Throw a rock dealing damage equal to intelligence plus 50% of strength plus weapon damage', mana: 5, strength: 30, intelligence: 40, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/rock.png'},
    firerain: {spellName: 'Fire Rain', tabID: 2, spellToolTipText: 'Showers all enemies with fire dealing damage equal to 50% of intelligence plus weapon damage', mana: 10, strength: 0, intelligence: 50, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/firerain.png'},

    //Wisdom
    heal: {spellName: 'Heal', tabID: 3, spellToolTipText: "Heals the lowest target hero in clicked proximity for 25% of wisdom plus weapon damage", mana: 5, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 10, buffSpell: 'no', spellImage: 'images/spells/smallheal.png'},
    holystrike: {spellName: 'Holy Strike', tabID: 3, spellToolTipText: 'Pierce the target causing damage equal to wisdom plus 50% of constitution and heals for 5% of damage done', mana: 5, strength: 0, intelligence: 0, dexterity: 0, constitution: 20, wisdom: 30, buffSpell: 'no', spellImage: 'images/spells/holystrike.png'},
    massheal: {spellName: 'Mass Heal', tabID: 3, spellToolTipText: "Heals all target heroes in a range of 3 from clicked proximity for 25% of wisdom plus weapon damage", mana: 10, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 35, buffSpell: 'no', spellImage: 'images/spells/massheal.png'},

    //Buffs
    combatmaster: {spellName: 'Combat Master', tabID: 4, spellToolTipText: "Increases your dexterity by 20 for 10 + Level / 5 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 40, constitution: 0, buffSpell: 'yes', spellImage: 'images/spells/combatmaster.png'},
    defend: {spellName: 'Defend', tabID: 4, spellToolTipText: "Increases the user's armor by 25% of constitution for 10 + Level / 5 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 40, wisdom: 0, buffSpell: 'yes', spellImage: 'images/spells/fortify.png'},
    minorwisdom: {spellName: 'Minor Wisdom', tabID: 4, spellToolTipText: "Increases the user's mana regeneration by 5 for 10 + Level / 5 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 40, buffSpell: 'yes', spellImage: 'images/spells/wisdom.png'},
};

//Possible stats on the spell tooltip
const spellToolTipStats = ['strength', 'intelligence', 'dexterity', 'constitution', 'wisdom', 'mana'];

//Used to check if user has sufficient stats
const spellStatRequirements = ['strength', 'intelligence', 'dexterity', 'constitution', 'wisdom'];

var spellIDDragged = '';
var spellImageDragged = '';

function buildSpellWindow() {

    var spellID = 0;

    //Loop through the spell list and add their html to the spell window in the the correct tab
    for (const key in spellList) {

        let spellObject = spellList[key];
        
        //Only show spell requirements if they have a requirement higher than 0
        let spellRequirementTooltipHTML = ''

        //Loop through tooltipstats and display them if they are above 0
        for (let i = 0; i < spellToolTipStats.length; i++) {

            let tempStat = spellToolTipStats[i];

            if (spellObject[tempStat] > 0) 
                spellRequirementTooltipHTML += '<div class = "spellRequirement">Required ' + capitalizeFirstLetter(tempStat) + ': ' + spellObject[tempStat] + '</div>';
        }

        let tempSpellHTML = '<div class = "spellcontainer">' + 
                                '<div class = "spellname" id = ' + spellID + '>' + spellObject.spellName + '</div>' + 
                                    '<div class = "spellimagecontainer">' + 
                                        '<div class="tooltip"><div class = "bookspell">' + 
                                            '<img src="' + spellObject.spellImage + '" id="' + key + '">' + 
                                        '</div>' + 
                                        '<span class="spelltooltiptext">' + 
                                        '<div class = "spellName">' + spellObject.spellName + '</div>' + 
                                        spellRequirementTooltipHTML + 
                                        '<div class = "spellText">' + spellObject.spellToolTipText + '</div>' + 
                                        '</span>' + 
                                    '</div>' + 
                                '</div>' + 
                            '</div>';

        //Add the html to the correct tab
        $('div#' + spellObject.tabID + '.spellTypeContainer').append(tempSpellHTML);

        spellID++;
    }
}

//Handles user actions regarding anything related to the spells container
$(function() {

    //opens/closes up the spells 
    $('div.spellsbutton').click(function() {
        //if(!token) { return twitch.rig.log('Not authorized'); }
        if ($('div.spellsWindow').css('display') == 'none') {
            $('div.spellsWindow').fadeIn();
            $('div.spellsbutton').addClass('active');
        }
        
        else {
            $('div.spellsWindow').fadeOut(); 
            $('div.spellsbutton').removeClass('active');
        }
    });

    //Opens/closes spell type containers 
    $('body').on('click', '.spellCollapsible', function() {
        
        let spellHTMLID = 'div#' + $(this).attr('id') + '.spellTypeContainer';

        if ($(spellHTMLID).hasClass('active')) {

            //Hide the contents
            $(spellHTMLID).removeClass('active');
            $(spellHTMLID).hide();

            //Hide the button
            $(this).removeClass('active');

            return;
        } 

        //Remove all other active classes first
        for (let i = 0; i < 6; i++) {
            let tempContentID = 'div#' + i + '.spellTypeContainer';
            $(tempContentID).removeClass('active');
            $(tempContentID).hide();

            let tempButtonID = 'button#'+ i + '.spellCollapsible';
            $(tempButtonID).removeClass('active');
        }

        //Show the contents
        $(spellHTMLID).addClass('active');
        $(spellHTMLID).show();

        //Show the button
        $(this).addClass('active');
        
    });

    
    //If a spell is dragged from the spells window
    $('div.spellsWindow').on('dragstart', 'img', function() {

        let spellID = $(this).attr("id");
        let imageID = $(this).attr("src");

        spellDragged(spellID, imageID);
    });

    //If a spell is dropped on the hotbar
    $('div.hotbarspell').on('drop', function() {

        let hotbarSlotID = $(this).attr("id");
        spellDropped(hotbarSlotID);
    });
    
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Allow spells to be dropped to the hotbar
function allowDrop(event) {
  event.preventDefault();
}

function spellDragged(spellID, imageID) {

    //Check if the player has the required stats to use the spell
    if (checkIfUserHasStatsRequired(spellID)) {
        spellIDDragged = spellID;
        spellImageDragged = imageID;
        return;
    }

    //Spell can't be used
    else {
        newLevelNotification('Not enough stats to use this skill');
        event.preventDefault();
    }
}

function spellDropped(hotbarSlotID) {

    //jquery_clickking.js
    nextFunction = 'saveHotbar';
    event.preventDefault();

    let hotbarHTML = '<img src="' + spellImageDragged  + '" class="hb" id="' + spellIDDragged  + '">';
    $('div#' + hotbarSlotID).html(hotbarHTML);
}

//Loop through stats and if they don't have sufficient stat amount return false; otherwise return true
function checkIfUserHasStatsRequired(spellName) {

    for (let i = 0; i < spellStatRequirements.length; i++) {

        let tempStatName = spellStatRequirements[i];

        //Total of all of this temp stat
        let playerTotalTempStat = playerData[tempStatName] + playerData[tempStatName + 'FromSkills'] + Math.floor(playerData['level'] / 5);

        //If player can't equip the spell
        if (playerTotalTempStat < spellList[spellName][tempStatName]) {
            return false;
        }
    }

    return true;
}

//Unusable spells will have a red name
function updateSpellUsableColor() {

    var spellID = 0;

    for (let key in spellList) {

        //If they can use the spell
        if (checkIfUserHasStatsRequired(key))
            $('div#' + spellID + '.spellname').css('color', 'white');

        //If they can't use the spell
        else 
           $('div#' + spellID + '.spellname').css('color', 'red');

        spellID++;
    }
}