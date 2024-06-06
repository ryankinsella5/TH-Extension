/*
    Module: vendor.js - Controller for vendor module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for player interacting with the vendor, whether buying selling or updating item
    functions to make the vendor look more elegant.
*/

const bagBuyPriceGoldHTMLID = 'div#0.buypricegold';
const buyContainerHTMLID = 'div.buycontainer';
const bagGoldHTMLID = 'div#0.vendorBuyGoldPriceContainer';

//Number of sell slots to create in the vendor window. May change this code later on to be based on number of items being sold.
const numVendorSellSlots = 25;

//Contains buyable items from the vendor
const vendorBuyItems = {
    BagSlot: {itemName: 'Bag Slot', buyPrice: 101},
};

//Contains items users can sell to the vendor
var vendoritems = [];
var vendorResourceItems = [];

showBuyContainer();

//Adds items players can buy to the vendor
function populateBuyableItemsVendor() {

    var index = 0;

    for (const key in vendorBuyItems) {

        let tempVendorItem = vendorBuyItems[key];

        let tempBuyableHTML =   '<div class = "vendorrowcontainer">' + 

                                    '<div class = "vendorrowleft">' +
                                        '<button class = "buybutton" id = "' + key + '" data-toggle="tooltip">' + tempVendorItem.itemName + '</button>' + 
                                    '</div>' + 
        
                                    '<div class = "vendorRowBuyRight" id = ' + index + '>' + 
        
                                        '<div class = "vendorBuyPriceContainer">'; 
             
                                            tempBuyableHTML += '<div class = "vendorBuyGoldPriceContainer" id = ' + index + '>' + 
                                                '<div class = "buypricegold" id = ' + index + '> ' + tempVendorItem.buyPrice + '</div>' + 
                                                '<img style="vertical-align:middle" id = "gold" src="images/currency/gold.png"/>' + 
                                            '</div>' + 
                                            
                                        '</div>' + 
                                    '</div>' + 

                                '</div>';

        //Add to the buy container in the vendor
        $(buyContainerHTMLID).append(tempBuyableHTML);   

        index++;                       
    }
}

//Adds slots to the vendor tab based on the const numVendorSellSlots
function addVendorSlotsToSellTab() {

    for (let i = 0; i < numVendorSellSlots; i++) {

        let tempSellSlotHTML =  '<div class = "vendorrowcontainer">' +
                                    '<div class = "vendorrowleft">' +

                                        '<div class = "vendorsellitem" id = ' + i +  ' itemid = ' + i + '>' +
                                            '<div class="tooltip">' +
                                                '<span class="tooltiptext"></span>' +
                                            '</div>' +
                                        '</div>' +

                                        '<div class = "vendorSellQuantity" id = ' + i + '></div>' +
                                    '</div>' +

                                    '<div class = "vendorrowright" id = ' + i + '>' +
                                        '<div class = "sellsilverprice" id = ' + i + '>0</div><img style="vertical-align:middle" id = "gold" src="images/currency/gold.png"/>' +
                                    '</div>' +
                                '</div>';

        $('.sellcontainer').append(tempSellSlotHTML);
    }
}

//Sends the vendor sell request to the backend 
function requestSellItems(itemIDArray, resourceArray) {
    return {
        type: 'POST',
        url: backendurl + 'sellitems/' + itemIDArray + '/' + resourceArray,
        headers: { 'Authorization': 'Bearer ' + token },
        success: vendorSellReturn,
        error: logError
    }
}

//Sends the vendor sell request to the backend 
function requestBuyItem(itemName) {
    return {
        type: 'POST',
        url: backendurl + 'buyitems/' + itemName,
        headers: { 'Authorization': 'Bearer ' + token },
        success: vendorBuyReturn,
        error: logError
    }
}

//Handles user actions regarding anything related to vendor purchasing and selling along with handling the vendor container
$(function() {

    //Makes vendor sell and buy tabs active or not active
    $('.selltab').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

        showSellContainer();
    });

    //Makes vendor sell and buy tabs active or not active
    $('.buytab').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

        showBuyContainer();
    });

    //opens/closes up the vendor
    $('div.vendorbutton').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

        if ($('div.vendor').css('display') == 'none') {

            //close equipment (herocode/inventory_equipment.js)
            closeEquipment();

            //close bank (herocode/bank.js)
            closeBank();

            //close market
            closeMarket();

            //open vendor
            openVendor();

            return;
        }

        closeVendor();
    });

    //Creates a sell request for all of the items in the sell tab 
    $('.sellall').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

         let buttonID = $(this).attr("id");

         //Offer all clicked, attempt to add all equippable items to the vendor
         if (buttonID == 'offerall') {

             addAllEquippableItemsToSellWindow();
             return;
         }

         //Sell all clicked, attempt to sell items
         if (buttonID == 'sellall') {

             //If we are selling no items, just pass a -1
             let itemIDArray = [-1];
             let resourceArray = [-1];
    
             if (vendoritems.length > 0) 
                 itemIDArray = makeVendorSellIDArray();
    
             if (vendorResourceItems.length > 0) 
                 resourceArray = vendorResourceItems;
    
             //Check if user is in cooldown or not, if not then create a vendor sell request
             if (checkUserInCooldown() === false) 
                 $.ajax(requestSellItems(itemIDArray, resourceArray));
         }

            
    });

    //Clicking a vendor item removes it if possible
    $('.vendorsellitem').click(function() {

        let itemID = $(this).attr("itemid");

        //Item clicked
        if (itemID > 0) {
            removeFromVendorItems(itemID);
        }

        //Resource clicked
        if (itemID == 0) {

            let resourceIndex = itemID - vendoritems.length;

            //Remove the resource from the array
            vendorResourceItems.splice(resourceIndex, 1); 

            updateVendorItems();

        }
    });

    //Buys the vendor item 
    $('.buybutton').click(function() {

        //if(!token) { return twitch.rig.log('Not authorized'); }

            if (checkUserInCooldown() === false) {

                let buyItemName = $(this).attr('id');

                if (buyItemName == 'BagSlot') {

                    //Check if they have enough gold. Backend will revalidate
                    if (checkIfPlayerHasEnoughGoldToUpgradeBag()) {
                        $.ajax(requestBuyItem('BagSlot'));
                    }

                    return;
                }

                //Check if they have full inventory. Will reverify
                if (playerData.inventoryCount >= getActualInventorySize()) {

                    //Notify the player
                     newLevelNotification('Full inventory');
                     return;
                }

                //If they have enough gold. Backend will verify
                if (userdata.gold >= vendorBuyItems[buyItemName].buyPrice) {
                    $.ajax(requestBuyItem(buyItemName));
                }
        } 
    });
});

function addResourceToTheVendor(resouceConvertedName, amount) {

    showSellContainer();

    let resourceExists = false;

    //Check if resource exists already in the vendor array
    for (let i = 0; i < vendorResourceItems.length; i++) {

        //Resource exists, so update amount
        if (vendorResourceItems[i][0] == resouceConvertedName) {

            resourceExists = true;

            //If it already exists in the vendor
            if (playerData[resouceConvertedName] > vendorResourceItems[i][1]) {

                //Get the difference
                let playerResourcesRemaining = playerData[resouceConvertedName] - vendorResourceItems[i][1];

                //If the amount is less or equal add it
                if (amount <= playerResourcesRemaining)
                    vendorResourceItems[i][1] += amount;

                //Otherwise added the difference
                else
                    vendorResourceItems[i][1] += playerResourcesRemaining;
            }
        }

        //Exit loop since the resource was found and added to the vendor
        if (resourceExists)
            break;
    }

    //If it doesn't exist in the vendor array, push it
    if (!resourceExists) 
        vendorResourceItems.push([resouceConvertedName, amount]);

    updateVendorItems();
}

function addAllEquippableItemsToSellWindow() {

    if (items.length == 0)
        return;

    //Loop through player items
    for (var i = 0; i < items.length; i++) {

        let tempItem = items[i];

        //If the item is in their inventory, add the item_id to the vendor
        if (tempItem.Inventory == 'Inventory') {

            //If thie item doesn't exist in the array already
            if (!checkIfItemExistsInVendorArray(tempItem))
                vendoritems.push(tempItem);
        }
        
    }

    updateVendorItems();
}

//Returns true if it exists in array and false otherwise
function checkIfItemExistsInVendorArray(tempItem) {

    for (let i = 0; i < vendoritems.length; i++) {

        if (tempItem.item_id == vendoritems[i].item_id)
            return true;
    }

    return false;
}

//Closes the vendor window, wipes items being sold and makes button inactive
function closeVendor() {
    $('div.totalsilverprice').html(0);
    vendoritems = [];
    clearVendorItems();
    clearVendorItemsCSS();
    $('div.totalsilverprice').html('0');
    $('div.vendorbutton').removeClass('active');
    $('div.vendor').fadeOut(); 
}

//Opens the vendor window, makes the vendor button active
function openVendor() {

    //Close stuff overlapping
    closeEquipment();
    closeBank();
    closeMarket();

    $('div.vendor').fadeIn();
    $('div.vendorbutton').addClass('active');
}

function clearVendorItems() {
    vendoritems = [];
    vendorResourceItems = [];
}

function clearVendorItemsCSS() {

    //Total length of both item arrays
    let totalLength = vendoritems.length + vendorResourceItems.length;

    for (let i = 0; i < numVendorSellSlots; i++) {
        
        let htmlID = 'div#' + i + '.vendorsellitem';
        let resourceQuantityHTMLID = 'div#' + i + '.vendorSellQuantity';

        //Clear resources amounts and hide
        $(resourceQuantityHTMLID).html();
        $(resourceQuantityHTMLID).hide();

        $(htmlID).children().children().css("border", "solid 1px #847963");
        $(htmlID).css("border-color", "transparent");
        $(htmlID).css('background-image', 'none');
        $(htmlID).css('background-color', 'transparent');

        //Clear the tooltip
        $(htmlID).children().children().empty();

        //Clear the sell prices
        $('div#' + i + '.sellgoldprice').html();
        $('div#' + i + '.sellsilverprice').html();

        //This div shows price of current index
        let priceDiv = 'div#' + i + '.vendorrowright';

        //Show if the current index as a real item
        if (i < totalLength) {
            $(priceDiv).show();
        }

        //Hide if no items at this index
        else {
            $(priceDiv).hide();
        }
    }
}

function getResourceConvertedName(resourceName) {

    for (const key in resources) {

        if (resources[key].resourceName == resourceName) {

            return key;
        }
    }
}

function showBuyContainer() {

    clearVendorItems();

    clearVendorItemsCSS();
    updateVendorItems();

    $('.sellcontainer').hide();
    $('.buycontainer').show();

    //If this tab is not active, make it active
    if (!$('.buytab').hasClass("active")) {
        $('.buytab').addClass("active");
        $('.selltab').removeClass('active');
    }
}

function showSellContainer() {

    $('.buycontainer').hide();
    $('.sellcontainer').show();

    //If this tab is not active, make it active
    if (!$('.selltab').hasClass("active")) {
        $('.selltab').addClass("active");
        $('.buytab').removeClass('active');
    }
}

function vendorSellReturn(blocks) {
    clearVendorItems();
    updateController(blocks);
}

function vendorBuyReturn(blocks) {
    updateController(blocks);
}


function updateVendorItems() {

    var sellTotal = 0;
    var itemCount = 0;

    clearVendorItemsCSS();

    for (let i = 0; i < vendoritems.length; i++) {

        let imageHTMLID = 'div#' + i + '.vendorsellitem';
        let tempitem = vendoritems[i];
        let goldValue = 4 + tempitem.item_level;

        //Defines the stats of a single item
        var itemStats = {

            location: tempitem.Inventory, 
            item_id: tempitem.item_id, 
            item_name: tempitem.item_name, 
            item_type: tempitem.item_type, 
            item_level: tempitem.item_level, 
            item_quality: tempitem.item_quality, 
            
            //Vendor value
            goldValue : goldValue,
            
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

            //Prefix values
            prefix1_value: tempitem.prefix1_value, 
            prefix2_value: tempitem.prefix2_value,
            prefix3_value: tempitem.prefix3_value, 
         };

        sellTotal += goldValue;    
        updateItemCSS(imageHTMLID, itemStats);

        if (itemStats.goldValue > 0) {
            $('div#' + itemCount + '.sellsilverprice').html(goldValue);
        }

        itemCount++;
    }

    //Add resources to vendor
    for (let i = 0; i < vendorResourceItems.length; i++) {

        let imageHTMLID = 'div#' + itemCount + '.vendorsellitem';
        let resourceQuantityHTMLID = 'div#' + itemCount + '.vendorSellQuantity';
        let tempResource = vendorResourceItems[i];

        //Price of resource multiplied by the quantity being sold
        let tempResourcePrice = 1 * tempResource[1];

        let itemStats = {
            location: 'Inventory', 
            item_name: tempResource[0], 
            quality: 1, 
            item_type: 'resource', 
            item_id: 0, 
            silverValue: 0,
        };

        updateItemCSS(imageHTMLID, itemStats);
        $('div#' + itemCount + '.sellsilverprice').html(tempResourcePrice);

        //Update quantity
        $(resourceQuantityHTMLID).html(tempResource[1]);
        $(resourceQuantityHTMLID).show();
        itemCount++;

        //Update price 
        sellTotal += tempResourcePrice;
    }

    //Update total sell price
    if (sellTotal >= 0) {
        let silverTotalHTMLID = 'div.totalsilverprice';
        $(silverTotalHTMLID).html(sellTotal);
    }

}

function makeVendorSellIDArray() {

    let idarray = [];

    for (let i = 0; i < vendoritems.length; i++) {
        idarray.push(vendoritems[i].item_id);
    }
    return idarray;
}

function addInventoryItemIntoVendor(item_id) {
    
    //get the item with that id
    for (let i = 0; i < items.length; i++) {

        let tempitem = items[i];
        if (item_id == tempitem.item_id) {
            //if that item isn't in the vendor already
            if (!checkifVendorItemExists(item_id)) {
                vendoritems.push(tempitem);
                updateVendorItems();
                return;
            }
        }
    }
}

function checkifVendorItemExists(item_id) {

    for (let i = 0; i < vendoritems.length; i++) {
        if (vendoritems[i].item_id == item_id) {
            return true;
        }
    }

    return false;
}

function removeFromVendorItems(item_id) {
   
    for (let i = 0; i < vendoritems.length; i++) {
        if (vendoritems[i].item_id == item_id) {
            vendoritems.splice(i, 1);
        }
    }

    clearVendorItemsCSS();
    updateVendorItems();
}

function updateVendorBagCostHTML(nextBagCost) {

    //Update gold and show it
    $(bagBuyPriceGoldHTMLID).html(nextBagCost);
    $(bagGoldHTMLID).show();

}

/* Bag upgrade stuff */
function updateBagUpgradeCost() {
    
    let nextBagCost = getNextBagUpgradeCost();
    updateVendorBagCostHTML(nextBagCost);
}

function checkIfPlayerHasEnoughGoldToUpgradeBag() {

    let nextBagCost = getNextBagUpgradeCost();

    if (userdata.gold >= nextBagCost) 
        return true;
    
    return false;
}

function getNextBagUpgradeCost() {

    let nextBagCost = userdata.inventoryslots * 5;
    return nextBagCost;
}