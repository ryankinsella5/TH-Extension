/*
    Module: tutorial.js - Controller for tutorial module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions for updating the tutorial divs by checking if they are missing things
*/

//If the player is missing any equipped tools, it will display the tool tutorial.
function checkToolTutorial() {

	let equippedToolCount = getNumberOfEquippedTools();

    //Not all tools equipped, show tutorial
    if (equippedToolCount < numTools) {

    	$('div#tool.tutorial').show();
    	return;
    }

    //Otherwise hide tutorial since there are empty tool slots
    $('div#tool.tutorial').hide();
    
}

//If they have at least one equipped spell on their hotbar, hide the hotbar
function checkHotbarTutorial() {

    for (let i = 1; i < numHotBarSlots + 1; i++) {

        let divID = 'div#hotbarslot' + i;

        let spellName = $(divID).children().first().attr('id')

        //If the player has at least one spell
        if (spellName !== undefined) {

            //Then hide tutorial
            $('div.tutorial#hotbar').hide();
            return;
        }
    }
}

//Gets the number of equipped tools
function getNumberOfEquippedTools() {

	let equippedToolCount = 0;

	//Loop through equipped items and check if they are a tool or not
    for (let i = 0; i < items.length; i++) {

    	let tempItem = items[i];

    	//Is equipped
    	if (tempItem.Inventory == 'Equipped') {

    		//Is also a tool
    		if (isATool(tempItem['item_type']))
    			equippedToolCount++;
    	}
    }

    return equippedToolCount;
}