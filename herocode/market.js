/*
    Module: market.js - Controller for market module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for selling and buying items from players
*/

//Contains buyable items passed from the backend
var marketItems = [];

const numMarketItems = 100;

function requestListItemMarket(item_id, itemPrice) {
    return {
        type: 'POST',
        url: backendurl + 'listitemmarket/' + item_id + '/' + itemPrice,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

function requestBuyItemMarket(item_id) {
    return {
        type: 'POST',
        url: backendurl + 'buyitemmarket/' + item_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

//Adds slots to the listed items tab so we can populate later
function addListedItemSlots() {

    for (let i = 0; i < numMarketItems; i++) {

        let listedItemHTML =    '<div class = "marketRowContainer" id = ' + i + '>' +

                                        '<div class = "marketSellItem" id = ' + i +  ' itemid = ' + i + '>' +
                                            '<div class="tooltip">' +
                                                '<span class="tooltiptext"></span>' +
                                            '</div>' +
                                        '</div>' +
                                        
                                        //Item price
                                        '<div class = "marketsellgoldprice" id = ' + i + '>0</div><img style="vertical-align:middle" id = "gold" src="images/currency/gold.png"/>' +
                                        //Time left
                                        '<div class = "marketTimeRemaining" id = ' + i + '>0</div>' +
                                        
                                        '<button class = "marketBuyButton" id = "' + i + '" data-toggle="tooltip">Buy</button>' + 

                                '</div>';

        $('.listeditemscontainer').append(listedItemHTML);
    }

    //Hide divs
    clearMarketItemsCSS();
}

$(function() {

    //Opens/closes the bank 
    $('.marketbutton').click(function() {

        //If not active make it active and close other windows overlapping
        if ($('div.market').css('display') == 'none') {

            //Open market
            openMarket();

            return;
        }
        
        closeMarket();
    });

    $('.listeditems').click(function() {
        showListedItems();
    });

    $('.listitems').click(function() {
        showListItems();
    });

    $('.marketBuyButton').click(function() {

        //Id of div
        let divID = $(this).attr('id');

        //Item id of item
        let buyItemID = $('div#' + divID + '.marketSellItem').attr('itemid');

        //Attempt to buy item
        buyItemMarket(buyItemID);
    });

    //Attempt to list an item after clicking the list item button
    $('.listitem').click(function() {

        //Item price
        let itemPrice = parseInt(document.getElementById('itemPriceGold').value);

        //Item id
        let itemID = $('div#0.marketListItem').attr('itemid');

        //Attempt to list the item to the market
        if (itemID > 0)
            listItemMarket(itemID, itemPrice);
    });

    //Removes the item from market list if clicked
    $('.marketListItem').click(function() {
        clearMarketListItem();
    });

});

//Clears the item being listed
function clearMarketListItem() {

    //Clear html
    $('div#0.marketListItem').html('');

    //Reset item id
    $('div#0.marketListItem').attr('itemid', 0);

    //Reset the css
    $('div#0.marketListItem').css('background-image', 'none');
    $('div#0.marketListItem').css('background-color', '#090806');
}

//Closes market window and makes the market button inactive
function closeMarket() {

    clearMarketListItem();
    $('div.market').fadeOut(); 
    $('div.marketbutton').removeClass('active');
}

//Opens market window and makes the market active
function openMarket() {

    //Close stuff
    closeVendor();
    closeEquipment();
    closeBank();

    $('div.market').fadeIn();
    $('div.marketbutton').addClass('active');
}

//Show currently listed items from players
function showListedItems() {

    //clearMarketListItem();
    $('.listeditemscontainer').show();
    $('.listitemscontainer').hide();

    //If this tab is not active, make it active
    if (!$('.listeditems').hasClass("active")) {
        $('.listeditems').addClass("active");
        $('.listitems').removeClass('active');
    }
}

//Show container to list items from
function showListItems() {
    
    $('.listitemscontainer').show();
    $('.listeditemscontainer').hide();

    //If this tab is not active, make it active
    if (!$('.listitems').hasClass("active")) {
        $('.listitems').addClass("active");
        $('.listeditems').removeClass('active');
    }
}

function listItemMarket(itemID, itemPrice) {

    if (checkUserInCooldown() === false) {

        //Clear item
        clearMarketListItem();

        //Request list item
        $.ajax(requestListItemMarket(itemID, itemPrice));
    }
}

function buyItemMarket(itemID) {

    if (checkUserInCooldown() === false) 
        $.ajax(requestBuyItemMarket(itemID));
}

//Returns true if it exists in array and false otherwise
function checkIfItemExistsInMarketArray(tempItem) {

    for (let i = 0; i < marketItems.length; i++) {

        if (tempItem.item_id == marketItems[i].item_id)
            return true;
    }

    return false;
}

//Pass an id and add it to the market list item slot
function addItemIntoListItemSlot(item_id) {

    //Get item
    let item = getItemObject(item_id);

    //Update css
    updateItemCSS('div#0.marketListItem', item);
}

//Add items to market from backend. Also checks if the item is not a duplicate.
function addMarketItemsFromBackend(marketData) {

    //Clear array
    marketItems = [];

    //Loop through player items
    for (var i = 0; i < marketData.length; i++) {

        let tempItem = marketData[i];

        //If thie item doesn't exist in the array already
        //if (!checkIfItemExistsInMarketArray(tempItem))

        //Just push it
        marketItems.push(tempItem);
        
    }

    clearMarketItemsCSS();
    updateMarketItemCSS();
}

function clearMarketItemsCSS() {

    for (let i = 0; i < numMarketItems; i++) {

        let htmlID = 'div#' + i + '.marketSellItem';
        $(htmlID).children().children().html('');
        $(htmlID).children().children().css('border', "solid 1.5px #847963");
        $(htmlID).css('border-color', 'transparent');
        $(htmlID).css('background-image', 'none');
        $(htmlID).css('background-color', 'transparent');

        $('div#' + i + '.marketRowContainer').css('display', 'none');
    }
}

function updateMarketItemCSS() {

    for (let i = 0; i < marketItems.length; i++) {

        let imageHTMLID = 'div#' + i + '.marketSellItem';
        let tempitem = marketItems[i];

        //Defines the stats of a single item
        let itemStats = {

            location: tempitem.Inventory, 
            item_id: tempitem.item_id, 
            item_name: tempitem.item_name, 
            item_type: tempitem.item_type, 
            item_level: tempitem.item_level, 
            item_quality: tempitem.item_quality, 

            //Base item values
            item_damage: tempitem.item_damage, 
            item_armor: tempitem.item_armor, 

            //Suffix names
            suffix1_name: tempitem.suffix1_name, 
            suffix2_name: tempitem.suffix2_name,
            suffix3_name: tempitem.suffix3_name, 

            //Suffix values
            suffix1_value: tempitem.suffix1_value, 
            suffix2_value: tempitem.suffix2_value,
            suffix3_value: tempitem.suffix3_value, 

            //Prefix names
            prefix1_name: tempitem.prefix1_name, 
            prefix2_name: tempitem.prefix2_name,
            prefix3_name: tempitem.prefix3_name, 
            
            //Market values
            sellprice: tempitem.sellprice,
            sellerlogin: tempitem.seller_login
        };

        updateItemCSS(imageHTMLID, itemStats);

        //Update sell price 
        $('div#' + i + '.marketsellgoldprice').html(itemStats.sellprice);

        //Show the row
        $('div#' + i + '.marketRowContainer').css('display', 'flex');

        updateTimeRemainingForMarketItem(tempitem.enddate, i);

    }
}

function updateTimeRemainingForMarketItem(marketItemEndDate, marketItemIndex) {

    // Find the time difference between now and the count down date
    let timeDifference = marketItemEndDate - Date.now();

    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (days > 0) {
        $('div#' + marketItemIndex + '.marketTimeRemaining').html(days + 'D ' + hours + 'H');  
        return;
    }


    if (hours > 0) {
        $('div#' + marketItemIndex + '.marketTimeRemaining').html(hours + 'H ' + minutes + 'M'); 
        return;
    }

    if (minutes > 0){
        $('div#' + marketItemIndex + '.marketTimeRemaining').html(minutes + 'M');  
        return; 
    }

    if (seconds > 0){
        $('div#' + marketItemIndex + '.marketTimeRemaining').html(seconds + 'S');  
        return; 
    }

    //Expired item
    $('div#' + marketItemIndex + '.marketTimeRemaining').html('EXPIRED');  
}