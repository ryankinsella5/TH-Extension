/*
    Module: tool.js - Controller for tool module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions for creating a toolbar, equipping tools and using the tools.
*/

const numTools = 5;

//Defines how the tools are ordered on the toolbar
const toolLocations = {pickaxe: 0, shears: 1, axe: 2, hoe: 3, bucket: 4};

//Used for creating basic tools as default
const basicTools = ['Basic Pickaxe', 'Basic Shears', 'Basic Axe', 'Basic Hoe', 'Basic Bucket'];

//Handles user actions regarding anything related to the toolbar
$(function() {

    //hotbar slot clicked, make it active
    $('.toolitem').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

        //Get the id of the hotbarspell clicked
        let toolID = $(this).attr("id");

        makeToolbarSpellActive(toolID)
    });

});

//Builds the hotbar based on the number of hotbar slots
function buildToolBar() {

    let toolBarString = '<div class = "toolbar">';

    for (let i = 0; i < numTools; i++) {

        let toolString =    '<div class = "toolitem" id = ' + i + ' itemid = ' + i + '>' + 
                                '<div class="tooltip">' +
                                    '<span class="tooltiptext"></span>' + 
                                '</div>' +
                            '</div>';

        toolBarString += toolString;
    }
        
    toolBarString += '</div';

    $('body').append(toolBarString);

    //Add basic tools as default
    addBasicToolsToToolbar();
}

function isATool(item_type) {

    if (toolLocations.hasOwnProperty(item_type)) 
        return true;

    return false;
}

//Basic tools are shown if they player has no tools equipped
function addBasicToolsToToolbar() {

    for (let i = 0; i < numTools; i++) {

        let htmlID = 'div#' + i + '.toolitem';

        //Make stats for the default tool
        var itemStats = {

            location: 'Equipped', 
            item_id: 1, 
            item_name: basicTools[i], 
            item_type: Object.keys(toolLocations)[i], 
            item_level: 1, 
            item_quality: 0, 
            
            //Base item values
            item_damage: 0, 
            item_armor: 0, 

            //Suffix names
            suffix1_name: 'Gather Speed', 
            suffix2_name: null,
            suffix3_name: null, 

            //Suffix values
            suffix1_value: 5, 
            suffix2_value: 0,
            suffix3_value: 0, 

            //Prefix names
            prefix1_name: null, 
            prefix2_name: null,
            prefix3_name: null, 

            //Prefix values
            prefix1_value: 0, 
            prefix2_value: 0,
            prefix3_value: 0, 
         };

        updateItemCSS(htmlID, itemStats);
    }
}

function clearToolItems() {

    for (let i = 0; i < numTools; i++) {
        let htmlID = 'div#' + i + '.toolitem';
        $(htmlID).children().children().html('');
        $(htmlID).children().children().css('border', "solid 1.5px #847963");
        $(htmlID).css('border-color', 'transparent');
        $(htmlID).css('background-image', 'none');
    } 

    //Add basic tools as default
    addBasicToolsToToolbar();
}

//Make the hotbar slot active that the player clicks on
function makeToolbarSpellActive(passedID) {

    //Clear current clicked entity
    clearClickedIDName();
    updateItemData();

    //Make all slots not active
    removeActiveFromToolbarSlots();
    removeActiveFromHotbarSlots();

    //Then make the passed slot active
    let divID = 'div#' + passedID + '.toolitem';
    $(divID).addClass('active');
}

//Set all hotbar slots to inactive
function removeActiveFromToolbarSlots() {

    for (let i = 0; i < numTools; i++) {
        let divID = 'div#' + i + '.toolitem';
        $(divID).removeClass('active');
    }
}

//Gets the toolname
function getActiveTool() {

    for (let i = 0; i < numTools; i++) {

        let tempID = 'div#' + i + '.toolitem';

        //if it's active
        if ($(tempID).hasClass('active')) {

            //if it has a tool in it
            if ($(tempID).children().length > 0) {

                //Get toolname
                let toolName = $(tempID).children().children().children().html();

                //Make it lowercase
                let lowerCaseToolname = toolName.toLowerCase();

                //Then remove spaces
                let finalToolName = lowerCaseToolname.replace(/\s/g, '');

                return finalToolName;
            }

            //if no tool
            else 
                return 'no active tool';
        }
    }
}