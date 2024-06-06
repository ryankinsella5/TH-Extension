/*
    Module: player.js - Controller for player module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This module uses player data sent from the backend and displays it in various containers used in this extension.
*/

//Contains data for the user directly from the database
var userData;

//Contains parsed userdata into a more usable format
var playerData;

//Contains items equipped by the user, we can easily save this and access it in other methods 
var items = [];

//Defines the html locations so we can easily modifiy them 
const htmlIDLocations = 
{
    //Player info
    heroname: 'div.heroname', 
    
    //Player gold
    goldcontainer:'div.gold', 
    gold: 'g#gold', 

    arrows: 'div#8.weapon', 
};

//Updates the extension with the player data received from the backend. 
function updatePlayerData() {

    let playerLevel = levelCalculator(userdata.exp);

    playerData = 
    {
        //Player info
        heroname: userdata.login.slice(0, 15), 
        exp: userdata.exp, 
        level: playerLevel, 
        inventoryCount: 0, 
        inventoryslots: userdata.inventoryslots,

        //Resources
        copperore: userdata.copperore, 
        copperingot: userdata.copperingot, 
        
        ironingot: userdata.ironingot, 

        goldore: userdata.goldore, 
        goldingot: userdata.goldingot, 

        wood: userdata.wood, 
        woodplank: userdata.woodplank, 

        oak: userdata.oak, 
        oakplank: userdata.oakplank, 

        wool: userdata.wool, 
        woolcloth: userdata.woolcloth, 
        silkcloth: userdata.silkcloth, 
        
        hide: userdata.hide, 
        leather: userdata.leather, 

        //Monster drops
        slime: userdata.slime,
        eyeball: userdata.eyeball,
        bone: userdata.bone,
        batwing: userdata.batwing,
        centaurhoof: userdata.centaurhoof,

        //Alchemy
        herb: userdata.herb, 
        sand: userdata.sand, 
        emptyvial: userdata.emptyvial, 
        essence: userdata.essence,
        miningpotion: userdata.miningpotion,
        harvestingpotion: userdata.harvestingpotion,
        woodcuttingpotion: userdata.woodcuttingpotion,

        arrows: userdata.arrows,

        //Food
        milk: userdata.milk,
        egg: userdata.egg,
        cheese: userdata.cheese,

        //Upgrade gems
        qualitygem: userdata.qualitygem,
        transmutationgem: userdata.transmutationgem,
        alterationgem: userdata.alterationgem,
        augmentgem: userdata.augmentgem,
        scouringgem: userdata.scouringgem,
        regalgem: userdata.regalgem,

        //Player stats 
        strength: 0, 
        intelligence: 0, 
        dexterity: 0, 
        constitution: 0,
        wisdom: 0,
        armor: 0, 
        health: 50 + playerLevel * 5, 
        mana: 50 + playerLevel * 5, 

        //Stats from skills
        strengthFromSkills: 0,
        intelligenceFromSkills: 0,
        dexterityFromSkills: 0,
        constitutionFromSkills: 0,
        wisdomFromSkills: 0,
        armorFromSkills: 0,
        healthFromSkills: 0,

        //Player gold
        gold: userdata.gold,

        //Skill experience amounts
        alchemy: userdata.alchemy, 
        blacksmithing: userdata.blacksmithing,
        cooking: userdata.cooking,
        fishing: userdata.fishing, 
        harvesting: userdata.harvesting, 
        mining: userdata.mining, 
        tailoring: userdata.tailoring,
        woodcutting: userdata.woodcutting, 
        woodworking: userdata.woodworking,
        leatherworking: userdata.leatherworking,
        jewelcrafting: userdata.jewelcrafting,
    }; 

    //Pass playerData to notification.js to check for level ups
    //Also shows player if they have new items
    checkForLevelUp(playerData);

    //Update the player's name
    $(htmlIDLocations.heroname).html(playerData.heroname);

    //Update number of arrows, pass to format first
    let formattedArrows = formatArrows(playerData.arrows);

    let arrowsHTML =    formattedArrows +
                        '<div class="tooltip">' +
                            '<span class="tooltiptext">You have ' + playerData.arrows + ' Arrows</span>' + 
                        '</div>';

    $(htmlIDLocations.arrows).html(arrowsHTML);

    //Update player gold
    $(htmlIDLocations.gold).html(formatGold(playerData.gold));
}

//Formats the gold with commas 
function formatGold(gold) {
    return gold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Used to format large amounts of arrow in to a more condensed format
function formatArrows(arrowAmount) {

    if (arrowAmount < 1000) {
        return arrowAmount;
    }

    if (arrowAmount <= 1000000) {
        return Math.floor(arrowAmount / 1000) + 'K';;
    }

    return Math.floor(arrowAmount / 1000000) + 'M';
}

function updateCurrentHealthMana() {

    updateHealthBar();
    updateManaBar();
}

function updateHealthBar() {

    let playerCurrentHealth = userdata.currenthealth;
    let playerMaxHealth = playerData.health + playerData.healthFromSkills + totalStatsFromBuffs.constitution * 5;

    //Percentage of remaining health
    let playerHealthPercentage = Math.round((playerCurrentHealth / playerMaxHealth) * 100);
    
    //If the player somehow has more current health than their maximum
    if (playerHealthPercentage > 100) {
        playerHealthPercentage = 100;
    }

    //Update health bar number
    $('.playerHealthText').html(playerCurrentHealth);

    //Update health bar width
    $('.playerCurrentHealth').width(playerHealthPercentage + '%');

    //If under 50% health, change color to yellow
    if (playerHealthPercentage < 50) {
        $('.playerCurrentHealth').css('background-color', '#FFE800');
        return;
    }

    //If above 50% health, change color to green
    $('.playerCurrentHealth').css('background-color', '#25AE26');
}

function updateManaBar() {

    let playerCurrentMana = userdata.currentmana;

    //Percentage of remaining mana
    let playerManaPercentage = Math.round((playerCurrentMana / playerData.mana) * 100);
    
    //Update mana bar number
    $('.playerManaText').html(playerCurrentMana);

    //Update mana bar width
    $('.playerCurrentMana').width(playerManaPercentage + '%');
}

//Calculates player level 
function levelCalculator(exp) {

    let level = Math.floor(Math.sqrt(exp)) + 1;
    return level;
}

