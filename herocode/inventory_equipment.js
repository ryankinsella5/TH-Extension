/*
    Module: inventory_equipment.js - Controller for inventory/equipment module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for updating player inventory/equipment using the extension. Players can equip or unequip items.
*/

//Base inventory size
const baseInventorySize = 30;

//Number of equipment slots
const numEquippedItems = 14;

//Stacking item
const itemMaxStackAmount = 10;

//Define item backgrounds
const itemBG = {

    //Copper
    CopperSword: 'url(images/weapons/CopperSword.png)',
    CopperHelmet: 'url(images/armor/Copper/CopperHelmet.png)',
    CopperArmor: 'url(images/armor/Copper/CopperArmor.png)',
    CopperPants: 'url(images/armor/Copper/CopperPants.png)',
    CopperBoots: 'url(images/armor/Copper/CopperBoots.png)',

    //Iron
    IronSword: 'url(images/weapons/IronSword.png)', 
    IronHelmet: 'url(images/armor/Iron/IronHelmet.png)',
    IronArmor: 'url(images/armor/Iron/IronArmor.png)',
    IronPants: 'url(images/armor/Iron/IronPants.png)',
    IronBoots: 'url(images/armor/Iron/IronBoots.png)',

    //Gold
    GoldenRing: 'url(images/jewelry/GoldenRing.png)',
    GoldenNecklace: 'url(images/jewelry/GoldenNecklace.png)',
    Goblet: 'url(images/jewelry/Goblet.png)',

    GoldenPickaxe: 'url(images/tools/gold/Pickaxe.png)',
    GoldenAxe: 'url(images/tools/gold/Axe.png)',
    GoldenHoe: 'url(images/tools/gold/Hoe.png)',
    GoldenShears: 'url(images/tools/gold/Shears.png)',
    GoldenBucket: 'url(images/tools/gold/Bucket.png)',

    //Leather
    LeatherCloak: 'url(images/armor/Leather/LeatherCloak.png)',
    LeatherGloves: 'url(images/armor/Leather/LeatherGloves.png)',
    LeatherBelt: 'url(images/armor/Leather/LeatherBelt.png)',

    //Oak
    OakStaff: 'url(images/weapons/OakStaff.png)', 
    OakBow: 'url(images/weapons/OakBow.png)', 
    OakShield: 'url(images/armor/Wood/OakShield.png)',

    //Silk
    SilkCap: 'url(images/armor/Silk/SilkCap.png)', 
    SilkRobes: 'url(images/armor/Silk/SilkRobes.png)', 
    SilkPants: 'url(images/armor/Silk/SilkPants.png)', 
    SilkBoots: 'url(images/armor/Silk/SilkBoots.png)', 

    //Wood
    WoodenSword: 'url(images/weapons/WoodenSword.png)', 
    WoodenStaff: 'url(images/weapons/WoodenStaff.png)', 
    WoodenBow: 'url(images/weapons/WoodenBow.png)', 
    WoodenShield: 'url(images/armor/Wood/WoodenShield.png)',

    //Wool
    WoolCap: 'url(images/armor/Wool/WoolCap.png)', 
    WoolRobes: 'url(images/armor/Wool/WoolRobes.png)', 
    WoolPants: 'url(images/armor/Wool/WoolPants.png)', 
    WoolBoots: 'url(images/armor/Wool/WoolBoots.png)', 

    //Basic tools
    BasicPickaxe: 'url(images/tools/basic/Pickaxe.png)', 
    BasicAxe: 'url(images/tools/basic/Axe.png)', 
    BasicHoe: 'url(images/tools/basic/Hoe.png)', 
    BasicBucket: 'url(images/tools/basic/Bucket.png)', 
    BasicShears: 'url(images/tools/basic/Shears.png)', 
};

//Defines how the equipped items are ordered in their equipment window.
const equippedItemLocations = {helmet: 0, boots: 4, armor: 2, weapon: 6, shield: 7, ring: 11, necklace: 1, pants: 3, gloves: 8, belt: 9, cloak: 10, trinket: 12};

const numSuffixes = 3;
const numPrefixes = 3;

//Easily make items out of player inventory resources
const resources = {

    //Potions
    miningpotion: {resourceName: 'Mining Potion', resourceType: 'Potion', resourceDescription: '', resourceImage: 'images/alchemy/blackvial.png', resourceBuffText: '<div class = "itemText">Gives the hero +10 to mining for 15 minutes (Does not stack with other potions)</div>'},
    harvestingpotion: {resourceName: 'Harvesting Potion', resourceType: 'Potion', resourceDescription: '', resourceImage: 'images/alchemy/greenvial.png', resourceBuffText: '<div class = "itemText">Gives the hero +10 to harvesting for 15 minutes (Does not stack with other potions)</div>'},
    woodcuttingpotion: {resourceName: 'Woodcutting Potion', resourceType: 'Potion', resourceDescription: '', resourceImage: 'images/alchemy/orangevial.png', resourceBuffText: '<div class = "itemText">Gives the hero +10 to woodcutting for 15 minutes (Does not stack with other potions)</div>'},
    emptyvial: {resourceName: 'Empty Vial', resourceType: 'Alchemy Ingredient', resourceDescription: 'Crafting ingredient', resourceImage: 'images/alchemy/emptyvial.png', resourceBuffText: ''},

    //Food
    cheese: {resourceName: 'Cheese', resourceType: 'Food', resourceDescription: '', resourceImage: 'images/food/cheese.png', resourceBuffText: '<div class = "itemText">Use: Gives the hero 10% to all stats, 5 health/mana every 10 seconds (Does not stack with other foods)</div>'},
    milk: {resourceName: 'Milk', resourceType: 'Food Ingredient', resourceDescription: '', resourceImage: 'images/food/milk.png', resourceBuffText: ''},
    egg: {resourceName: 'Egg', resourceType: 'Food Ingredient', resourceDescription: '', resourceImage: 'images/food/egg.png', resourceBuffText: ''},

    //Craft Resources
    copperore: {resourceName: 'Copper Ore', resourceType: 'Blacksmithing Ingredient', resourceDescription: 'Can be used at an anvil. Requires 2 ores.', resourceImage: 'images/crafting/copper-ore.png', resourceBuffText: ''},
    copperingot: {resourceName: 'Copper Ingot', resourceType: 'Blacksmithing Ingredient', resourceDescription: '', resourceImage: 'images/crafting/copper-ingot.png', resourceBuffText: ''},

    ironingot: {resourceName: 'Iron Ingot', resourceType: 'Blacksmithing Ingredient', resourceDescription: '', resourceImage: 'images/crafting/iron-ingot.png', resourceBuffText: ''},

    goldore: {resourceName: 'Gold Ore', resourceType: 'Blacksmithing Ingredient', resourceDescription: 'Can be used at an anvil. Requires 2 ores.', resourceImage: 'images/crafting/gold-ore.png', resourceBuffText: ''},
    goldingot: {resourceName: 'Gold Ingot', resourceType: 'Blacksmithing Ingredient', resourceDescription: '', resourceImage: 'images/crafting/gold-ingot.png', resourceBuffText: ''},

    wood: {resourceName: 'Wood Log', resourceType: 'Woodworking Ingredient', resourceDescription: 'Can be used at a sawmill. Requires 2 logs.', resourceImage: 'images/crafting/woodlog.png', resourceBuffText: ''},
    woodplank: {resourceName: 'Wood Plank', resourceType: 'Woodworking Ingredient', resourceDescription: '', resourceImage: 'images/crafting/woodplank.png', resourceBuffText: ''},

    oak: {resourceName: 'Oak Log', resourceType: 'Woodworking Ingredient', resourceDescription: 'Can be used at a sawmill. Requires 2 logs.', resourceImage: 'images/crafting/oaklog.png', resourceBuffText: ''},
    oakplank: {resourceName: 'Oak Plank', resourceType: 'Woodworking Ingredient', resourceDescription: '', resourceImage: 'images/crafting/oakplank.png', resourceBuffText: ''},

    wool: {resourceName: 'Wool', resourceType: 'Tailoring Ingredient', resourceDescription: 'Can be used at a spinning wheel. Requires 2 wool.', resourceImage: 'images/crafting/wool.png', resourceBuffText: ''},
    woolcloth: {resourceName: 'Wool Cloth', resourceType: 'Tailoring Ingredient', resourceDescription: '', resourceImage: 'images/crafting/woolcloth.png', resourceBuffText: ''},
    silkcloth: {resourceName: 'Silk Cloth', resourceType: 'Tailoring Ingredient', resourceImage: 'images/crafting/silkcloth.png', resourceBuffText: ''},

    hide: {resourceName: 'Hide', resourceType: 'Crafting Ingredient', resourceDescription: 'Can be used at a workbench. Requires 2 hides.', resourceImage: 'images/crafting/hide.png', resourceBuffText: ''},
    leather: {resourceName: 'Leather', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/leather.png', resourceBuffText: ''},
    
    //Monster drops
    slime: {resourceName: 'Slime', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/slime.png', resourceBuffText: ''},
    bone: {resourceName: 'Bone', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/bone.png', resourceBuffText: ''},
    eyeball: {resourceName: 'Eyeball', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/eyeball.png', resourceBuffText: ''},
    batwing: {resourceName: 'Bat Wing', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/batwing.png', resourceBuffText: ''},
    centaurhoof: {resourceName: 'Centaur Hoof', resourceType: 'Crafting Ingredient', resourceDescription: '', resourceImage: 'images/crafting/centaurhoof.png', resourceBuffText: ''},

    //Upgrade gems
    qualitygem: {resourceName: 'Quality Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to increase the quality of an item by 5% (Max 20%)', resourceImage: 'images/upgradematerials/qualitygem.png', resourceBuffText: ''},
    transmutationgem: {resourceName: 'Transmutation Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to add an affix to an item with 0 affixes', resourceImage: 'images/upgradematerials/transmutationgem.png', resourceBuffText: ''},
    alterationgem: {resourceName: 'Alteration Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to roll the affixes on an item with 1 or 2 affixes', resourceImage: 'images/upgradematerials/alterationgem.png', resourceBuffText: ''},
    augmentgem: {resourceName: 'Augment Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to add a stat to an item with 1 affix', resourceImage: 'images/upgradematerials/augmentgem.png', resourceBuffText: ''},
    scouringgem: {resourceName: 'Scouring Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to remove all affixes from an item', resourceImage: 'images/upgradematerials/removestatsgem.png', resourceBuffText: ''},
    regalgem: {resourceName: 'Regal Gem', resourceType: 'Upgrade gem', resourceDescription: 'Left click to add stats to an item with 2 affixes', resourceImage: 'images/upgradematerials/removestatsgem.png', resourceBuffText: ''},

    //Alchemy
    herb: {resourceName: 'Mushroom', resourceType: 'Alchemy Ingredient', resourceDescription: '', resourceImage: 'images/alchemy/mushroom.png', resourceBuffText: ''},
    sand: {resourceName: 'Sand', resourceType: 'Alchemy Ingredient', resourceDescription: '', resourceImage: 'images/alchemy/sand.png', resourceBuffText: ''},
    essence: {resourceName: 'Monster Essence', resourceType: 'Alchemy Ingredient', resourceDescription: '', resourceImage: 'images/alchemy/essence.png', resourceBuffText: ''},
    
};

//List of consumable items
const consumableNames = ['Cheese', 'Mining Potion', 'Harvesting Potion', 'Woodcutting Potion'];

//Tools that are usable as actions
const usableTools = ['basicpickaxe', 'basicaxe', 'basichoe', 'basicshears', 'basicbucket', 'goldenpickaxe', 'goldenaxe', 'goldenhoe', 'goldenshears', 'goldenbucket'];

//Used to make tooltips for the tools
const toolObjects = {

    BasicPickaxe: {toolName: 'Basic Pickaxe', toolDescription: 'Can be used to mine ore'},
    BasicAxe: {toolName: 'Basic Axe', toolDescription: 'Can be used to cut trees'},
    BasicHoe: {toolName: 'Basic Hoe', toolDescription: 'Can be used to hoe plants'},
    BasicShears: {toolName: 'Basic Shears', toolDescription: 'Can be used to shear sheep'},
    BasicBucket: {toolName: 'Basic Bucket', toolDescription: 'Can be used to hold liquids'},

    GoldenPickaxe: {toolName: 'Golden Pickaxe', toolDescription: 'Can be used to mine ore'},
    GoldenAxe: {toolName: 'Golden Axe', toolDescription: 'Can be used to cut trees'},
    GoldenHoe: {toolName: 'Golden Hoe', toolDescription: 'Can be used to hoe plants'},
    GoldenShears: {toolName: 'Golden Shears', toolDescription: 'Can be used to shear sheep'},
    GoldenBucket: {toolName: 'Golden Bucket', toolDescription: 'Can be used to hold liquids'},
}; 

//Stores the clicked resource or tool in the player's inventory
var clickedID = null;
var clickedName = null;
var clickedItemID = -1;

function requestEquipItem(item_id) {
    return {
        type: 'POST',
        url: backendurl + 'equipitem/' + item_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

function requestUnequipItem(item_id) {
    return {
        type: 'POST',
        url: backendurl + 'unequipitem/' + item_id,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

function requestConsumeItem(itemName, quantity) {
    return {
        type: 'POST',
        url: backendurl + 'consumeitem/' + itemName + '/' + quantity,
        headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

//Handles user actions regarding anything related to the inventory and the equipment containers.
$(function() {

    //Opens/closes up the inventory 
    $('div.inventorybutton').click(function() {

        if ($('div.inventory').css('display') == 'none') {
            $('div.inventory').fadeIn();
            $('div.inventory').addClass('active');
            $('div.inventorybutton').addClass('active');
        }
        
        else {
            $('div.inventory').fadeOut(); 
            $('div.inventorybutton').removeClass('active');
        }
    });

    //Opens/closes up the equipment 
    $('div.equipmentbutton').click(function() {

        if ($('div.equipment').css('display') == 'none') {

            closeVendor();
            closeBank();
            closeMarket();

            //open equipment
            $('div.equipment').fadeIn();
            $('div.equipmentbutton').addClass('active');

            return;
        }

        closeEquipment();
    });

    //Clicking an inventory item
    $(document.body).on('click', '.inventoryitem' ,function(){

        let itemName = $(this).find('.itemname').html();
        let item_id = $(this).attr("itemid");
        let id = $(this).attr("id");

        //Negative item_id or undefined
        if (item_id < 0 || !item_id)
            return;

        //Undefined item name
        if (!itemName)
            return;

        //Item is highlighted already
        if (clickedName != null) {

            //If it's an upgrade gem
            if (resources[clickedName].resourceType == 'Upgrade gem') {

                //Attempt to upgrade the item
                upgradeItem(item_id, clickedName);
            }

            clearClickedIDName();
            clearAllInventoryItemsBackgroundColors();
            return;
        }

        //Clear all inventory item backgrounds
        clearClickedIDName();
        clearAllInventoryItemsBackgroundColors();

        //If bank is open just store it
        if ($('.bank').css('display') != 'none' && item_id > 0) { 
            storeItem(item_id);
            return;
        }

        //If equipment is open and not a resource just equip it
        if ($('.equipment').css('display') != 'none' && item_id > 0) { 
            equipItem(item_id);
            return;
        }

        //If vendor is open add it to vendor sell list
        if ($('.vendor').css('display') != 'none') { 

            showSellContainer();

            //Sell item
            if (item_id > 0)
                addInventoryItemIntoVendor(item_id);

            //Sell resource 
            if (item_id == 0) {

                let resourceName = getResourceConvertedName(itemName);

                //Resource name undefined
                if (!resourceName)
                    return;

                addResourceToTheVendor(resourceName, 1)
            }
            
            return;
        }

        //If market is open
        if ($('.market').css('display') != 'none' && item_id > 0) { 

            //If market sell tab is open, add it and exit
            if ($('.listitems').hasClass("active")) { 

                addItemIntoListItemSlot(item_id);
                return;
            }

            //If market listed items tab is open, switch to it add it and exit
            if ($('.listeditems').hasClass("active")) { 

                showListItems();
                addItemIntoListItemSlot(item_id);
                return;
            }
        }       

        //If it's an equippable item, show the pop up for item actions
        if (item_id > 0) {

            $('div#' + id + '.itemItem').show();
            return;
        }

        //If it's a resource or consumable, show button options
        if (item_id == 0) {

            if ($('div#' + id + '.resourceItem').css('display') == 'none' && itemName) {
                $('div#' + id + '.resourceItem').show();
                return;  
            }
        }

    });

    //Real item actions
    $(document.body).on('click', '.itemButton' ,function(e){

        let itemName = $(this).parent().parent().find('.itemname').html();
        let itemAction = $(this).html();
        let item_id = $(this).parent().parent().attr("itemid");

        if (typeof itemName === 'undefined') 
            return;

        //Close parent div and stop propagation from other events
        e.stopPropagation();
        $(this).parent().hide();

        clearAllInventoryItemsBackgroundColors();

        //Close button clicked, don't do any actions. Parent was already closed.
        if (itemAction == "Close") 
            return;

        //Equip item was clicked
        if (itemAction == "Equip") {

            //Open equipment window and attempt to equip it
            openEquipment();

            //Attempt to equip the item
            equipItem(item_id);

            return;
        }

        //Store item in bank
        if (itemAction == "Store") {

            //Open bank and attempt to store it
            openBank();

            //herocode/bank.js
            storeItem(item_id);

            return;
        }

        //Sell item vendor was clicked
        if (itemAction == "Sell to Vendor") {

            //Open vendor and add it to the sell window
            openVendor();
            showSellContainer();

            if (item_id != 0)
                addInventoryItemIntoVendor(item_id);

            return;
        }

        //Sell item market was clicked
        if (itemAction == "Sell to Market") {

            //Open market window
            openMarket();
            showListItems();

            //Update the css of the market list slot for clicked item
            addItemIntoListItemSlot(item_id);

            return;
        }

    });

    //Resource button clicked
    $(document.body).on('click', '.resourceButton' ,function(e){

        let itemName = $(this).parent().parent().find('.itemname').html();
        let resourceAction = $(this).html();

        if (typeof itemName === 'undefined') 
            return;

        //Close parent div and stop propagation from other events
        e.stopPropagation();
        $(this).parent().hide();

        //Close button clicked, don't do any actions. Parent was already closed.
        if (resourceAction == "Close") 
            return;

        //If it's a consumable and the action is use
        if (consumableNames.includes(itemName) && resourceAction == 'Use') {

            if (checkUserInCooldown() === false) {  

                //Replace stuff before we send it to the backend
                let itemNameNoSpaces = itemName.replace(/\s/g, '');

                //Request consume item
                $.ajax(requestConsumeItem(itemNameNoSpaces, 1));
            }  

            return;
        }

        //Use was clicked, highlight background
        if (resourceAction == 'Use') {

            clearClickedIDName();
                
            let tempResourceID = $(this).attr("id");

            //Removes spaces and makes lower case.
            let lowerCaseResourceName = itemName.replace(/\s+/g, '').toLowerCase();

            //Check if it is a usable resource. Will recheck in backend
            if (lowerCaseResourceName in resources) {

                //Store the clicked resource id so it remains updated after we update the player's inventory
                clickedID = tempResourceID;

                //Store the clicked resource name. 
                clickedName = lowerCaseResourceName;

                //Clear all inventory item backgrounds
                clearAllInventoryItemsBackgroundColors();

                //Update the clicked item's css
                updateClickedItemCSS(); 
            }

            //Parent container id
            let tempID = $(this).parent().attr("id");

            let htmlID = 'div#' + tempID + '.inventoryitem';

            //Change background
            $(htmlID).css('background-color', 'teal');

            return;
        }

        //Open crafting window (crafting.js)
        if (resourceAction == 'Craft') {
            openCraftingWindow();
            return;
        }

        let resouceConvertedName = getResourceConvertedName(itemName);

        if (resourceAction == "Sell All") {
            openVendor();
            showSellContainer()
            addResourceToTheVendor(resouceConvertedName, playerData[resouceConvertedName]);
            return;
        }

        if (resourceAction == "Sell 1") {
            openVendor();
            showSellContainer();
            addResourceToTheVendor(resouceConvertedName, 1);
        }

    });

    //Clicking an equipped item unequips it if possible
    $('.equippeditem').click(function() {

        if ($(this).attr("itemid") > 0) {

             //Create a request to equip the user's weapon
            if (checkUserInCooldown() === false) {
                $.ajax(requestUnequipItem($(this).attr("itemid")));
            } 
        }
    });

    //Clicking an equipped weapon unequips it if possible
    $('.weapon').click(function() {

        if ($(this).attr("itemid") > 0) {

            //Create a request to unequip the user's item
            if (checkUserInCooldown() === false) {
                $.ajax(requestUnequipItem($(this).attr("itemid")));
            } 
        }
    });

});

//Closes equipment window and makes button inactive
function closeEquipment() {
    $('div.equipment').fadeOut(); 
    $('div.equipmentbutton').removeClass('active');
}

// This function is used to create inventory slots within the player's inventory
function addInventorySlotsToExtension(newPlayerData) {

    //If old player data exists, check if they have a different number of slots
    if (typeof oldPlayerData !== 'undefined' && oldPlayerData !== null) {

        let valueChange = false;

        //Check if any resources changed values
        for (const key in resources) {

            if (newPlayerData[key] != oldPlayerData[key]) 
                valueChange = true;
        }

        //No values changed, don't update inventory
        if (!valueChange) 
            return;
    }

    //Otherwise we just add the slots
    $('div.inventorycontainer').empty();

    //Then we add slots based on their amount
    for (let i = 0; i < getActualInventorySize(); i++) {

        let tempInventorySlot = '<div class = "inventoryitem" id = ' + i + ' itemid = 0>' +
                                    '<div class="resourceAmount" id = ' + i + '>0</div>' +

                                    //Popup for resources
                                    '<div class = "resourceItem" id = ' + i + '>' +
                                        '<div class= "resourceButton">Use</div>' +
                                        '<div class= "resourceButton">Craft</div>' +
                                        '<div class= "resourceButton">Sell 1</div>' +
                                        '<div class= "resourceButton">Sell All</div>' +
                                        '<div class= "resourceButton">Close</div>' +
                                    '</div>' +

                                    //Popup for items
                                    '<div class = "itemItem" id = ' + i + '>' +
                                        '<div class= "itemButton">Equip</div>' +
                                        '<div class= "itemButton">Store</div>' +
                                        '<div class= "itemButton">Sell to Vendor</div>' +
                                        '<div class= "itemButton">Sell to Market</div>' +
                                        '<div class= "resourceButton">Close</div>' +
                                    '</div>' +

                                    '<div class="tooltip">' +
                                        '<span class="tooltiptext"></span>' +
                                    '</div>' +
                                '</div>';

        $('div.inventorycontainer').append(tempInventorySlot);
    }
}

//Updates the player inventory and equipment based on the database.
function updateItemData() {

    clearInventoryItems();
    clearEquippedItems();
    clearToolItems();
    addDefaultEquippedItemsBackgrounds();

    //Returns index and total amount of resources
    let craftingReturnArray = addCraftingItemsToInventory();

    var inventoryCount = craftingReturnArray[0];
    var equippedCount = 0;  
    var bankCount = 0;  

    for (var i = 0; i < items.length; i++) {

        var tempitem = items[i];

        //This is used to add more stats to the item based on the item quality
        let itemQualityConverted = 1 + tempitem.item_quality / 100;

        //Defines the stats of a single item
        var itemStats = {

            location: tempitem.Inventory, 
            item_id: tempitem.item_id, 
            item_name: tempitem.item_name, 
            item_type: tempitem.item_type, 
            item_level: tempitem.item_level, 
            item_quality: tempitem.item_quality, 
            
            //Base item values
            item_damage: Math.floor(tempitem.item_damage * itemQualityConverted), 
            item_armor: Math.floor(tempitem.item_armor * itemQualityConverted), 

            //Suffix names
            suffix0_name: tempitem.suffix0_name, 
            suffix1_name: tempitem.suffix1_name,
            suffix2_name: tempitem.suffix2_name, 

            //Suffix values
            suffix0_value: Math.floor(tempitem.suffix0_value * itemQualityConverted), 
            suffix1_value: Math.floor(tempitem.suffix1_value * itemQualityConverted), 
            suffix2_value: Math.floor(tempitem.suffix2_value * itemQualityConverted), 

            //Prefix names
            prefix0_name: tempitem.prefix0_name, 
            prefix1_name: tempitem.prefix1_name,
            prefix2_name: tempitem.prefix2_name, 

            //Prefix values
            prefix0_value: Math.floor(tempitem.prefix0_value * itemQualityConverted), 
            prefix1_value: Math.floor(tempitem.prefix1_value * itemQualityConverted), 
            prefix2_value: Math.floor(tempitem.prefix2_value * itemQualityConverted), 
         };

        //Location of where the item 
        var htmlID = 'div#';

        //Inventory item
        if (itemStats.location == 'Inventory') {
            htmlID = htmlID + inventoryCount + '.inventoryitem';
            inventoryCount++;
        }

        //Equipped 
        if (itemStats.location == 'Equipped') {

            let item_type = itemStats.item_type;

            //Equipped tool
            if (isATool(item_type)) {

                htmlID = htmlID + toolLocations[item_type] + '.toolitem';
                updateItemCSS(htmlID, itemStats);  
                continue; 
            }

            //Equipped item
            htmlID = htmlID + equippedItemLocations[item_type];

            //Add the stats to player stats since the item is equipped
            playerData.armor        += itemStats.item_armor;

            //Loop through suffixes and add them to the player stats
            for (let i = 0; i < numSuffixes; i++) {
        
                let tempSuffixName = itemStats['suffix' + i + '_name'];

                if (tempSuffixName == null)
                    continue;

                let tempSuffixValue = itemStats['suffix' + i + '_value'];
                let tempSuffixNameLowerCase = tempSuffixName.toLowerCase();
                
                //Add value to the player stats if it exists in the player's stats
                if (tempSuffixNameLowerCase in playerData && tempSuffixValue > 0) 
                    playerData[tempSuffixNameLowerCase] += tempSuffixValue;     
            }

            //Loop through prefixes and add them to the player stats
            for (let i = 0; i < numPrefixes; i++) {
                
                let tempPrefixName = itemStats['prefix' + i + '_name'];

                if (tempPrefixName == null)
                    continue;

                let tempPrefixValue = itemStats['prefix' + i + '_value'];
                let tempPrefixNameLowerCase = tempPrefixName.toLowerCase();

                //Add value to the player stats if it exists in the player's stats
                if (tempPrefixNameLowerCase in playerData && tempPrefixValue > 0) 
                    playerData[tempPrefixNameLowerCase] += tempPrefixValue;
            }

            //Add health based on player's constitution
            //playerData.health       += (itemStats.constitution * 5);

            if (item_type == 'weapon' || item_type == 'shield')
                htmlID = htmlID + '.weapon';

            else 
                htmlID = htmlID + '.equippeditem';
            
            equippedCount++;
        }

        //Bank item
        if (itemStats.location == 'Bank') {
            htmlID = htmlID + bankCount + '.bankitem';
            bankCount++;
        }

        updateItemCSS(htmlID, itemStats);   
    }

    //Update inventory count
    updateInventoryCount(craftingReturnArray[1] + inventoryCount - craftingReturnArray[0]);

    //herocode/bank
    updateBankCount(bankCount);
}

//Clears the previous inventory css in case they equipped a new item or received a new one
function clearInventoryItems() {

    for (let i = 0; i < getActualInventorySize(); i++) {

        //Item id
        let htmlID = 'div#' + i + '.inventoryitem';

        //Clear tooltip text
        $(htmlID).find('.tooltiptext').html('');

        $(htmlID).children().children().css('border', "solid 1.5px #847963");
        $(htmlID).css('border-color', 'transparent');
        $(htmlID).css('background-image', 'none');
    } 

    updateClickedItemCSS();
}

function clearAllInventoryItemsBackgroundColors() {

    for (let i = 0; i < getActualInventorySize(); i++) {
        let htmlID = 'div#' + i + '.inventoryitem';
        $(htmlID).css('background-color', 'transparent');
    } 
}

//Clears the previous inventory css in case they equipped a new item or unequipped one
function clearEquippedItems() {

    //Reset all equipped items
    for (let i = 0; i < numEquippedItems; i++) {
        let htmlID = 'div#' + i + '.equippeditem';
        $(htmlID).children().children().html('');
        $(htmlID).css("border", "solid 1px #847963");
        $(htmlID).css('background-image', 'none');
    } 

    //Reset mainhand css
    let mainHandID = 'div#6.weapon';
    $(mainHandID).children().children().html('');
    $(mainHandID).css("border", "solid 1px #847963");
    $(mainHandID).css('background-image', 'none');

    //Reset offhand css
    let offHandID = 'div#7.weapon';
    $(offHandID).children().children().html('');
    $(offHandID).css("border", "solid 1px #847963");
    $(offHandID).css('background-image', 'none');
}

//Clear the clicked item after it is used.
function clearClickedIDName() {
    clickedID = null;
    clickedName = null;
    clickedItemID = -1;
}

//Update the background color of clicked item
function updateClickedItemCSS() {

    if (clickedID != null) {
        let htmlID = 'div#' + clickedID + '.inventoryitem';
        //$(htmlID).css('background-color', 'teal');
    }          
}

//If an item is not equipped in an equipment slot, default background is added to the inventory slot
function addDefaultEquippedItemsBackgrounds() {

    for (const key in equippedItemLocations) {

        let itemLocationID = equippedItemLocations[key];
        let htmlID = 'div#' + itemLocationID + '.equippeditem';

        $(htmlID).css('background-image','url(images/gray/' + key + '.png)');
    }
}

//Change the background depending on the item
function updateItemCSS(htmlID, itemStats) {
    
    //Color should be dependent on the number of suffixes and prefixes
    let tempNumSuffixes = getNumberOfSuffixesOnItem(itemStats);
    let tempNumPrefixes = getNumberOfPrefixesOnItem(itemStats);
    let totalNumAffixes = tempNumSuffixes + tempNumPrefixes;

    let qualityColor = getItemColor(1);

    if (totalNumAffixes == 1 || totalNumAffixes == 2)
        qualityColor = getItemColor(2);

    if (totalNumAffixes >= 3)
        qualityColor = getItemColor(3);

    let itemToolTipString = '';

    //Undefined item stats passed
    if (!itemStats)
        return;

    //Not a resource
    if (itemStats.item_id != 0) {

        //Update background image
        let itemImageLocation = getItemImageBackground(itemStats.item_name);
        $(htmlID).css('background-image',itemImageLocation);

        //Tooltip
        itemToolTipString = makeItemToolTipText(itemStats);

        //If quality not 1, change it's color
        if (itemStats.quality >= 1) 
            $(htmlID).css("background-color", qualityColor);
        
    }
    
    //Resource
    if (itemStats.item_id == 0) {

        let resourceObject = resources[itemStats.item_name];

        if (typeof resourceObject !== 'undefined') {
            let resourceImage = 'url(' + resources[itemStats.item_name].resourceImage + ')';

            $(htmlID).css('background-image', resourceImage);

            //Update resource tooltip
            itemToolTipString =     '<div class = "itemname">' + resourceObject.resourceName + '</div>' + 
                                    '<div class = "itemType">' + resourceObject.resourceType + '</div>' + 
                                    '<div class = "itemDescription">' + resourceObject.resourceDescription + '</div>' + 
                                    '<div class = "itemText">' + resourceObject.resourceBuffText + '</div>';
                                    
        }
    }

    // Update the html text values of stats
    $(htmlID).find('.tooltiptext').html(itemToolTipString);

    //Update border of tooltip
    $(htmlID).find('.tooltiptext').css("border-color", qualityColor);

    //Change text color of item name
    $(htmlID).find('.itemname').css("color", qualityColor);

    //Update item id
    $(htmlID).attr("itemid", itemStats.item_id);

}

//Returns number of suffixes on an item
function getNumberOfSuffixesOnItem(item) {

    let suffixCount = 0;

    for (let i = 0; i < numSuffixes; i++) {

        let tempSuffixName = item['suffix' + i + '_name'];

        if (tempSuffixName != '' && tempSuffixName != null)
            suffixCount++;
    }

    return suffixCount;
}

//Returns number of prefixes on an item
function getNumberOfPrefixesOnItem(item) {

    let prefixCount = 0;

    for (let i = 1; i < numPrefixes + 1; i++) {

        let tempPrefixName = item['prefix' + i + '_name'];

        if (tempPrefixName != '' && tempPrefixName != null)
            prefixCount++;
    }

    return prefixCount;
}

//Returns image based on item name passed
function getItemImageBackground(item_name) {

    //remove spaces
    let newItemNameNoSpaces = item_name.replace(' ', '');

    return itemBG[newItemNameNoSpaces];
}

//Shows the item name and stats in a nice concise rpg style way
function makeItemToolTipText(itemStats) {

    //Get the item color
    let itemColor = getItemColor(itemStats.quality);

    //Add quality color to item name
    let itemString = '<div class = "itemname" style="color:' + itemColor + ';">' + itemStats.item_name + '</div>';

    //Add item level
    itemString += '<div class = "itemType">Item Level ' + itemStats.item_level + '</div>';

    //Add item quality
    if (itemStats.item_quality > 0)
        itemString += '<div class = "itemDescription">Quality ' + itemStats.item_quality + '%</div>';

    //Add item damage
    if (itemStats.item_damage > 0)
        itemString += itemStats.item_damage + ' Damage<br>';

    //Add item armor
    if (itemStats.item_armor > 0)
        itemString += itemStats.item_armor + ' Armor<br>';

    //Loop through suffixes and add them to the tooltip
    for (let i = 0; i < numSuffixes; i++) {

        let tempSuffixName = itemStats['suffix' + i + '_name'];

        if (tempSuffixName == null)
            continue;

        let tempSuffixValue = itemStats['suffix' + i + '_value'];

        //Suffix exists, add it to the tooltip
        if (tempSuffixName != '') 
            itemString += '+' + tempSuffixValue + ' ' + tempSuffixName + '<br>';
    }

    //Loop through prefixes and add them to the tooltip
    for (let i = 0; i < numPrefixes; i++) {
        
        let tempPrefixName = itemStats['prefix' + i + '_name'];

        if (tempPrefixName == null)
            continue;

        let tempPrefixValue = itemStats['prefix' + i + '_value'];

        //Prefix exists, add it to the tooltip
        if (tempPrefixName != '') 
            itemString += '+' + tempPrefixValue + ' ' + tempPrefixName + '<br>';  
    }

    //Add sell price to tooltip
    let itemSellPrice = calculateItemPrice(itemStats);

    itemString += '<div class = "itemSellPrice"> Sell Price: ' + itemSellPrice + '<img style="vertical-align:middle" id = "gold" src="images/currency/gold.png"/></div>';

    //Add seller login name if it exists
    if (itemStats.sellerlogin) 
        itemString += 'Seller: ' + itemStats.sellerlogin + '<br>';
    
    return itemString;
}

//Calculates price of passed item
function calculateItemPrice(itemStats) {

    //If it's a market item
    if (itemStats.sellprice)
        return itemStats.sellprice;

    //Otherwise calculate price
    else
        return 4 + itemStats.item_level;
}

function capitalizeFirstLetterOfString(stringPassed) {
    return stringPassed.charAt(0).toUpperCase() + stringPassed.slice(1);
}

//Since crafting items in player inventories aren't actual items, but values stored in a table. We need to turn them into something similar to a real item.
function addCraftingItemsToInventory() {

    //Keeps track of item location relative to other items in the player inventory
    let count = 0;
    let itemCount = 0;

    for (const key in resources) {

        //Object of the referenced resource
        let resourceObject = resources[key];
    
        //Player has none of that resource or negative
        if (playerData[key] <= 0)
            continue;

        let htmlID = 'div#' + count + '.inventoryitem';
        let resourceImage = 'url(' + resourceObject.resourceImage + ')';

        //Add item image as the background
        $(htmlID).css('background-image', resourceImage);

        //Calculate the sell price. Base price multipled by quantity.
        let tempSellPrice = 1 * playerData[key];

        //Tooltip
        let toolTipText =   '<div class = "itemname">' + resourceObject.resourceName + '</div>' + 
                            '<div class = "itemType">' + resourceObject.resourceType + '</div>' + 
                            '<div class = "itemDescription">' + resourceObject.resourceDescription + '</div>' + 
                            '<div class = "itemText">' + resourceObject.resourceBuffText + '</div>' + 
                            '<div class = "itemSellPrice"> Sell Price: ' + tempSellPrice + '<img style="vertical-align:middle" id = "gold" src="images/currency/gold.png"/></div>';

        //$(htmlID).children().children().html(toolTipText);
        $(htmlID).find('.tooltiptext').html(toolTipText);

        //Update resource amount
        $('div#' + count + '.resourceAmount').html(playerData[key]);
        $('div#' + count + '.resourceAmount').show();


        itemCount += playerData[key];
        count++;
    }

    return [count, itemCount];
}

//Updates the inventory count contained in the inventory container to reflect the player's inventory count
function updateInventoryCount(inventoryCount) {
    playerData.inventoryCount = inventoryCount;
    $('.inventoryCount').html(inventoryCount + '/' + getActualInventorySize());
}

//Pass an item_id and returns the item type
function lookUpItemType(item_id) {

    for (let i = 0; i < items.length; i++) {

        //If it's the item passed, return it's type
        if (items[i].item_id == item_id)
            return items[i].item_type;
    }  
}

//Get item object with passed item_id
function getItemObject(item_id) {

    for (let i = 0; i < items.length; i++) {

        //If it's the item passed, return it's type
        if (items[i].item_id == item_id)
            return items[i];
    }  
}

function getEquippedWeaponType() {

    for (let i = 0; i < items.length; i++) {

        let tempItem = items[i];

        //Weapon and equipped 
        if (tempItem['Inventory'] == 'Equipped' && tempItem['item_type'] == 'weapon') {

            const itemNameSplit = tempItem['item_name'].split(" ");
            return itemNameSplit[1];
        }
    }

    return 'none';
}

function getActualInventorySize() {
    return userdata.inventoryslots + baseInventorySize;
}

function getItemColor(quality) {

    qualityColor = 'white';

    switch(quality) {

        //Blue
        case 2:
            qualityColor = '#5479ff';
            break;

        //Yellow
        case 3:
            qualityColor = '#efe02d';
            break;

        case 4:
            qualityColor = '#8062FF';
            break;

        case 5:
            qualityColor = '#F70909';
            break;
    }

    return qualityColor;
}

function openEquipment() {

    //close vendor (herocode/vendor.js)
    closeVendor();

    //close bank (herocode/bank.js)
    closeBank();

    //close market
    closeMarket();

    //open equipment
    $('div.equipment').fadeIn();
    $('div.equipmentbutton').addClass('active');
}

function equipItem(item_id) {

    //Not a real item
    if (item_id == 0)
        return;

    //Create a request to equip an item
    if (checkUserInCooldown() === false) 
        $.ajax(requestEquipItem(item_id));
}