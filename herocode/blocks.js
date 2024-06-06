/*
    Module: blocks.js - Controller for blocks module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions to create clickable blocks in the extension. These blocks indicate a x and x y position. They can be clicked to perform the action from the hotbar.
*/

function addBlocksToExtension() {

    for (let col = -10; col <= 10; col=col+2) {
        createBlocks(20, col);   
    }
}

function createBlocks(count, col) {

    let blockRowHTML = '<div class = "blockRowContainer">';
    let x = -20;

    for (let id = (col*count); id <= count + (col*count); id++) {

        let blockHTML = '<div class="block" id = ' + x + ',' + -(col) + '></div>';
        blockRowHTML += blockHTML;
        
        x=x+2;
    }   

    blockRowHTML += '</div>';

    $('body').append(blockRowHTML);   
}