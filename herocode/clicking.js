/*
    Module: clicking.js - Controller for clicking module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for when player interact with letious html elements; mostly involving clicking and hovering.
*/

var blockAction = null;
var blockX = null;
var blockY = null;
var blockItemID = null;
var nextFunction = null;

//Screen size in the game. Check if it's within the space.
const minX = -20
const maxX = 20
const minY = -10
const maxY = 10

//Contains both the container and the button id related to the container so we can easily close both
const containerIDs = {
    inventory: {containerID: 'div.inventory', buttonID: 'div.inventorybutton'},
    equipment: {containerID: 'div.equipment', buttonID: 'div.equipmentbutton'},
    vendor: {containerID: 'div.vendor', buttonID: 'div.vendorbutton'},
    skills: {containerID: 'div.skills', buttonID: 'div.skillsbutton'},
    spellsWindow: {containerID: 'div.spellsWindow', buttonID: 'div.spellsbutton'},
    dungeon: {containerID: 'div.dungeon', buttonID: 'div.dungeonbutton'},
    crafting: {containerID: 'div.crafting', buttonID: 'div.craftingbutton'},
    ranking: {containerID: 'div.ranking', buttonID: 'div.rankingbutton'},
    quest: {containerID: 'div.quest', buttonID: 'div.questbutton'},
    bank: {containerID: 'div.bank', buttonID: 'div.bankbutton'},
    market: {containerID: 'div.market', buttonID: 'div.marketbutton'},
};

//Checks if we have queued actions
setInterval(function(){ checkActionQueue();}, 100);

//Queries user info every 2.5 seconds
setInterval(function(){ queryUserInfo();}, 5000);

/*
    Passes a click action to the backend.
    This click action is an x, y coordinate along with a given action
    The player in the game performs the action passed from the extension at the coordinates specified.
*/
function requestBlockClick() {
    return {
        type: 'POST',
        url: backendurl + 'block/' + blockAction + '/' + blockX + '/' + blockY + '/' + blockItemID,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

//Jquery functions used for user interaction with the extension
//This mostly includes clicking actions on the page
$(function() {

    //when a block is clicked, get the current action on the hotbar and send with the coordinates to the backend
    $('.block').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }
        
        //If no player data quit out
        if (playerData == undefined) 
            return;

        //If there is a highlighted resource, attempt to use that first
        if (clickedName != null) {

            //Action variables
            let blockID = $(this).attr("id");
            let coordinateSplit = blockID.split(',');
            blockX = coordinateSplit[0];
            blockY = coordinateSplit[1];
            blockAction = clickedName;

            //If it's a tool, set the blockitemid to the tool itemid
            if (usableTools.includes(clickedName)) {
                blockItemID = clickedItemID;
            }

            else {
                blockItemID = -1;
            }

            //If user is in cooldown add to queue
            if (checkUserInCooldown() === true) {
                nextFunction = 'blockClick';
                return;
            }

            //Otherwise just request it
            blockClick();
            return;
        }

        //Check if they have a bow equipped
        //inventory_equipment.js
        if (getEquippedWeaponType() == 'Bow') {

            //If they have no arrows, notify and quit
            if (playerData.arrows <= 0)  {
                newLevelNotification('No arrows equipped');
                return;
            }
        }

        //hotbar.js
        let activeSpell = getActiveSpell();

        //Action doesn't exist check if tool exists
        if (activeSpell == 'no active spell') 
            activeSpell = getActiveTool();
        
        //Tool doesn't exist either after checking active spells
        if (activeSpell == 'no tool in slot') {
            resetActionVariables();
            return;
        }

        //Is an actual spell
        //Action variables
        let blockID = $(this).attr("id");
        let coordinateSplit = blockID.split(',');
        blockX = coordinateSplit[0];
        blockY = coordinateSplit[1];
        blockItemID = -1;
        blockAction = activeSpell;

        //If user is in cooldown add to queue
        if (checkUserInCooldown() === true) {
            nextFunction = 'blockClick';
            return;
        }

        //Otherwise just request it
        blockClick();
        
    });

    //Close the correct div when the x (close button) is pressed
    $('.closebutton').click(function() {

        //The close button is a child of the parent window so we can easily obtain it
        let parentWindow = $(this).parent().parent();
        let parentID = $(parentWindow).attr('class');

        //Clear the vendor items if vendor is closed
        if (parentID == 'vendor') {
            clearVendorItems();
            clearVendorItemsCSS();
        }

        //Split the id to remove any active parts from the string
        let parentIDActiveRemoved = parentID.split(' ')[0];

        closeContainerAndButton(parentIDActiveRemoved);
    });
    
});

function queryUserInfo() {

    //Check if user is in cooldown or not, if not then request the backend for user information.
    if (checkUserInCooldown() == false) {

        //if no action queue, then just query user data
        if (checkActionQueue() != true) {
            $.ajax(requests.get);
        }
    }
}

//Closes the container and makes the button related to it not active
function closeContainerAndButton(tempIDPassed) {

    let containerObject = containerIDs[tempIDPassed];
    let containerIDToClose = containerObject.containerID;
    let buttonIDToMakeInactive = containerObject.buttonID;

    //Close container
    $(containerIDToClose).fadeOut(); 

    //Make button not active
    $(buttonIDToMakeInactive).removeClass('active');

    //if market was closed
    if (buttonIDToMakeInactive == 'div.marketbutton')
        clearMarketListItem();
}

function blockClick() {

    //if(!token) { return twitch.rig.log('Not authorized'); }

    //If in bounds
    if (positionInBounds()) {

        //If a resouce is highlighted
        if (clickedName != null) {

            //If the resource exists
            if (clickedName in resources) {

                //Clear the clicked item
                clearClickedIDName();

                clearAllInventoryItemsBackgroundColors();

                //Check if user is in cooldown or not, if not then create an action request
                $.ajax(requestBlockClick());
            }
            
            return;
        }
        
        //Spell exists and user can use the spell. Or tool exists. Then we pass to the backend.
        if (spellList.hasOwnProperty(blockAction) && checkIfUserHasStatsRequired(blockAction) || usableTools.includes(blockAction)) {
        
            //Check if user is in cooldown or not, if not then create an action request
            $.ajax(requestBlockClick());
        }
    }
    
}

function positionInBounds() {

    if (blockX >= minX && blockX <= maxX && blockY >= minY && blockY <= maxY) 
        return true;

    return false;
}

function checkActionQueue() {

    //If they are on cooldown quit out and check back later
    if (checkUserInCooldown() === true) 
        return false;

    switch (nextFunction) {
        case 'blockClick':
            blockClick();
            resetActionVariables();
            return true;
        case 'saveHotbar':
            //herocode/skills.js
            saveHotbar();
            resetActionVariables();
            return true;
        default:
            //resetActionVariables();
            return false;
    }
}

function resetActionVariables() {
    blockAction = null;
    blockX = null;
    blockY = null;
    blockItemID = null;
    nextFunction = null;
}