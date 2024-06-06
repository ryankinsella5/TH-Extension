/*
    Module: upgrade.js - Controller for player module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This module allows players to upgrade items with gems.
*/

function requestUpgradeItem(item_id, gemname) {
    return {
        type: 'POST',
        url: backendurl + 'upgradeitem/' + item_id + '/' + gemname,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

function upgradeItem(item_id, gemname) {

    //Not a real item
    if (item_id == 0)
        return;

    //Create a request to equip an item
    if (checkUserInCooldown() === false) 
        $.ajax(requestUpgradeItem(item_id, gemname));
}