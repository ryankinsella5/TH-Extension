/*
    Module: skins.js - Controller for skins module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for creating a skin choosing dropdown and allows users to request a skin change for their player.
*/

//Number of possible skins. Will add these to the dropdown on extension load.
const numSkins = 10;

function requestSkinChange(skin_id) {
    return {
        type: 'POST',
        url: backendurl + 'skinchange/' + skin_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

$(function() {

	//If the user changes skins in the dropdown
    $("#skinselect").change(function () {

        //Get the id of the one clicked
        let dropValue = this.value;

        //Split on the space
        let splitArray = dropValue.split(" ");

        //Id of the skin
        let skin_id = splitArray[1];

        //Request a skin change of the id 
        $.ajax(requestSkinChange(skin_id));
    }); 

});

//Add a drop down for players to select a new hero skin
function buildSkinDropDown() {

    let skinSelectStart = '<select id= "skinselect">';

    for (let i = 1; i < numSkins + 1; i++) {

        let tempTabName = 'Skin ' + i;
        let tempOptionHTML = '<option value="' + tempTabName + '" id = "option">' + titleCase(tempTabName) + '</option>';
        skinSelectStart += tempOptionHTML;
    }

    $('.heroskincontainer').append(skinSelectStart);
}

//Updates the dropdown with the current value in the database. This is useful when the extension is loaded for the first time.
function updateSkinDropDownValue() {

    let skin_id = userdata.skin_id;
    $('#skinselect').val('Skin ' + skin_id);
}