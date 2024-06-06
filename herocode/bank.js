/*
    Module: bank.js - Controller for bank module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for storing items in players' bank and also taking them out.
*/

//Base bank size
const baseBankSize = 30;

function requestStoreItem(item_id) {
    return {
        type: 'POST',
        url: backendurl + 'storeitem/' + item_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

function requestUnstoreItem(item_id) {
    return {
        type: 'POST',
        url: backendurl + 'unstoreitem/' + item_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

$(function() {

    //Opens/closes the bank 
    $('.bankbutton').click(function() {

        if ($('div.bank').css('display') == 'none') {
            
            //open bank
            openBank();

            return;
        }
        
        closeBank();
    });

    //Clicking a bank item unstores it if possible
    $(document.body).on('click', '.bankitem' ,function(){

        let item_id = $(this).attr("itemid");
        unstoreItem(item_id);
    });
});

//This function is used to create bank slots
function addBankSlotsToExtension() {

    //First empty the inventory
    $('div.bankcontainer').empty();

    //Then we add slots based on their amount
    for (let i = 0; i < getActualBankSize(); i++) {
        let tempInventorySlot = '<div class = "bankitem" id = ' + i + ' itemid = 0>' +
                                    '<div class="tooltip">' +
                                        '<span class="tooltiptext"></span>' +
                                    '</div>' +
                                '</div>';

        $('div.bankcontainer').append(tempInventorySlot);
    }
}

//Closes bank window and makes the bank button inactive
function closeBank() {
    $('div.bankbutton').removeClass('active');
    $('div.bank').fadeOut(); 
}

//Opens bank window and makes the bank active
function openBank() {

    //close vendor (herocode/vendor.js)
    closeVendor();

    //close equipment (herocode/inventory_equipment.js)
    closeEquipment();

    //close market
    closeMarket();

    $('div.bank').fadeIn();
    $('div.bank').addClass('active');
    $('div.bankbutton').addClass('active');
}

//Attempts to store passed item_id
function storeItem(item_id) {

    if (checkUserInCooldown() === false) 
        $.ajax(requestStoreItem(item_id));
}

//Attempts to unstore passed item_id
function unstoreItem(item_id) {

    if (checkUserInCooldown() === false) 
        $.ajax(requestUnstoreItem(item_id));
}

function getActualBankSize() {

    return baseBankSize;   
}

function updateBankCount(bankCount) {

    $('.bankCount').html(bankCount + '/' + getActualBankSize());
}
