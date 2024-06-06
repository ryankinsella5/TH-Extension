/*
    Module: hotbar.js - Controller for hotbar module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for building the hotbar along with other hotbar functions.
*/

const numHotBarSlots = 9;

function requestHotbarSave(hotbar) {
    return {
        type: 'POST',
        url: backendurl + 'hotbarsave/' + hotbar,
        headers: { 'Authorization': 'Bearer ' + token },
        error: logError
    }
}

//Handles user actions regarding anything related to the hotbar
$(function() {

    //hotbar slot clicked, make it active
    $('.hotbarspell').click(function() {
        //if(!token) { return twitch.rig.log('Not authorized'); }

        //Get the id of the hotbarspell clicked
        let hotbarSpellID = $(this).attr("id");

        //Gets the number in the id
        let hotbarSpellNumber = hotbarSpellID.slice(-1);

        //Pass the number so we can make it active
        makeHotbarSpellActive(hotbarSpellNumber);
    });

    //Allows drop if they are dragging over a slot
    $('.hotbarspell').on('dragover', function() {
        event.preventDefault();
    });
});

//Builds the hotbar on document load based on the number of hotbar slots. (easily scalable/changeable)
function buildHotbar() {

    let hotBarString = '';

    for (let i = 1; i < numHotBarSlots + 1; i++) {
        hotBarString += '<div class = "hotbarspell" id="hotbarslot' + i + '"></div>';
    }

    $('div.hotbar').append(hotBarString);

    //Make the first hotbar slot active
    makeHotbarSpellActive(1);
}

//Make the hotbar slot active that the player clicks on
function makeHotbarSpellActive(passedID) {

    //Make all slots not active
    removeActiveFromHotbarSlots();
    removeActiveFromToolbarSlots();

    //Then make the passed slot active
    let divID = 'div#hotbarslot' + passedID;
    $(divID).addClass('active');
}

//Gets the action for the active spell
function getActiveSpell() {

    for (let i = 1; i < numHotBarSlots + 1; i++) {

        let tempID = 'div#hotbarslot' + i;

        //if it's active
        if ($(tempID).hasClass('active')) {

            //if it has a spell in it
            if ($(tempID).children().length > 0) {
                let action = $(tempID).children().first().attr('id');
                return action;
            }
        }

    }

    //If none are active then return no active spell
    return 'no active spell';
}

//Set all hotbar slots to inactive
function removeActiveFromHotbarSlots() {

    for (let i = 1; i < numHotBarSlots + 1; i++) {
        let tempID = 'div#hotbarslot' + i;
        $(tempID).removeClass('active');
    }
}

//Load the player's hotbar from the database
function loadHotBar() {

    for (let i = 1; i < numHotBarSlots + 1; i++) {

        let hotBarSpellName = userdata['hotbar' + i]; 
        let hotbarHTMLID = 'div#hotbarslot' + i;

        if (hotBarSpellName != 'none') {

            //If the spell exists, put it on the hotbar
            if (spellList.hasOwnProperty(hotBarSpellName)) {

                let htmlContents = '<img src="' + spellList[hotBarSpellName].spellImage + '" draggable="true" class="hb"  ondragstart="drag(event)" id="' + hotBarSpellName + '">';
                $(hotbarHTMLID).html(htmlContents);
            }
        }

        //If none, just clear html
        else 
            $(hotbarHTMLID).html('');
    }
}

//Save the player's hotbar to the database
function saveHotbar() {

    let savedHotbar = [];

    //Loop through hotbar and add the names to an array. We will pass this to the backend for updating
    for (let i = 1; i < numHotBarSlots + 1; i++) {

        let hotbarHTMLID = 'div#hotbarslot' + i;
        let action = $(hotbarHTMLID).children().first().attr('id');

        if (spellList.hasOwnProperty(action)) 
            savedHotbar.push(action);

        else 
            savedHotbar.push('none');
    }

    $.ajax(requestHotbarSave(savedHotbar));
}

