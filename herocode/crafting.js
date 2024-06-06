/*
    Module: crafting.js - Controller for crafting module
    Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
    This contains functions used for player interacting with the crafting container. Displays available recipes, materials required and allows the user
    to interact with the backened to craft items that end up in their inventory.
*/

//This object allows us to dynamically add these to the crafting container and easily add new crafts
const craftList = 
{
    //Alchemy
    MiningPotion: {craftName: 'Mining Potion', tabID: 0, resourceAmounts: [2], resourceNames: ['Mushroom'], craftingImages: ['images/alchemy/mushroom.png']},
    HarvestingPotion: {craftName: 'Harvesting Potion', tabID: 0, resourceAmounts: [2], resourceNames: ['Mushroom'], craftingImages: ['images/alchemy/mushroom.png']},
    WoodcuttingPotion: {craftName: 'Woodcutting Potion', tabID: 0, resourceAmounts: [2], resourceNames: ['Mushroom'], craftingImages: ['images/alchemy/mushroom.png']},

    //Cooking
    Cheese: {craftName: 'Cheese', tabID: 1, resourceAmounts: [2], resourceNames: ['Milk'], craftingImages: ['images/food/milk.png']},
    //Cheese: {craftName: 'Cheese', tabID: 1, resourceAmounts: [2], resourceNames: ['Milk'], craftingImages: ['images/food/milk.png']},

    //Copper
    CopperSword: {craftName: 'Copper Sword', tabID: 2, resourceAmounts: [1, 1], resourceNames: ['Copper Ingots', 'Wood Plank'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/woodplank.png']},
    CopperHelmet: {craftName: 'Copper Helmet', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},
    CopperArmor: {craftName: 'Copper Armor', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},
    CopperPants: {craftName: 'Copper Pants', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},
    CopperBoots: {craftName: 'Copper Boots', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingot'], craftingImages: ['images/crafting/copper-ingot.png']},

    //Gold
    GoldenRing: {craftName: 'Golden Ring', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    GoldenNecklace: {craftName: 'Golden Necklace', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    Goblet: {craftName: 'Goblet', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},

    //Gold tools
    GoldenPickaxe: {craftName: 'Golden Pickaxe', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    GoldenAxe: {craftName: 'Golden Axe', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    GoldenHoe: {craftName: 'Golden Hoe', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    GoldenShears: {craftName: 'Golden Shears', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},
    GoldenBucket: {craftName: 'Golden Bucket', tabID: 3, resourceAmounts: [2], resourceNames: ['Gold Ingots'], craftingImages: ['images/crafting/gold-ingot.png']},

    //Iron
    /*
    IronSword: {craftName: 'Iron Sword', tabID: 4, resourceAmounts: [2, 2], resourceNames: ['Copper Ingots', 'Bones'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/bone.png']},
    IronHelmet: {craftName: 'Iron Helmet', tabID: 4, resourceAmounts: [2, 2], resourceNames: ['Copper Ingots', 'Eyeballs'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/eyeball.png']},
    IronArmor: {craftName: 'Iron Armor', tabID: 4, resourceAmounts: [2, 2], resourceNames: ['Copper Ingots', 'Slimes'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/slime.png']},
    IronPants: {craftName: 'Iron Pants', tabID: 4, resourceAmounts: [2, 2], resourceNames: ['Copper Ingots', 'Bat Wings'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/batwing.png']},
    IronBoots: {craftName: 'Iron Boots', tabID: 4, resourceAmounts: [2, 2], resourceNames: ['Copper Ingots', 'Centaur Hooves'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/centaurhoof.png']},
    */

    //Wool
    WoolCap: {craftName: 'Wool Cap', tabID: 5, resourceAmounts: [2], resourceNames: ['Wool Cloth'], craftingImages: ['images/crafting/woolcloth.png']},
    WoolRobes: {craftName: 'Wool Robes', tabID: 5, resourceAmounts: [2], resourceNames: ['Wool Cloth'], craftingImages: ['images/crafting/woolcloth.png']},
    WoolPants: {craftName: 'Wool Pants', tabID: 5, resourceAmounts: [2], resourceNames: ['Wool Cloth'], craftingImages: ['images/crafting/woolcloth.png']},
    WoolBoots: {craftName: 'Wool Boots', tabID: 5, resourceAmounts: [2], resourceNames: ['Wool Cloth'], craftingImages: ['images/crafting/woolcloth.png']},

    /*
    //Silk
    SilkCap: {craftName: 'Silk Cap', tabID: 6, resourceAmounts: [2, 2], resourceNames: ['Wool Cloth', 'Eyeballs'], craftingImages: ['images/crafting/woolcloth.png', 'images/crafting/eyeball.png']},
    SilkRobes: {craftName: 'Silk Robes', tabID: 6, resourceAmounts: [2, 2], resourceNames: ['Wool Cloth', 'Slimes'], craftingImages: ['images/crafting/woolcloth.png', 'images/crafting/slime.png']},
    SilkPants: {craftName: 'Silk Pants', tabID: 6, resourceAmounts: [2, 2], resourceNames: ['Wool Cloth', 'Bat Wings'], craftingImages: ['images/crafting/woolcloth.png', 'images/crafting/batwing.png']},
    SilkBoots: {craftName: 'Silk Boots', tabID: 6, resourceAmounts: [2, 2], resourceNames: ['Wool Cloth', 'Centaur Hooves'], craftingImages: ['images/crafting/woolcloth.png', 'images/crafting/centaurhoof.png']},
    */

    //Leather
    LeatherCloak: {craftName: 'Leather Cloak', tabID: 7, resourceAmounts: [2], resourceNames: ['Leather'], craftingImages: ['images/crafting/leather.png']},
    LeatherGloves: {craftName: 'Leather Gloves', tabID: 7, resourceAmounts: [2], resourceNames: ['Leather'], craftingImages: ['images/crafting/leather.png']},
    LeatherBelt: {craftName: 'Leather Belt', tabID: 7, resourceAmounts: [2], resourceNames: ['Leather'], craftingImages: ['images/crafting/leather.png']},

    //Wood
    Arrows: {craftName: 'Arrows', tabID: 8, resourceAmounts: [1], resourceNames: ['Wood Planks'], craftingImages: ['images/crafting/woodplank.png']},
    WoodenStaff: {craftName: 'Wooden Staff', tabID: 8, resourceAmounts: [2], resourceNames: ['Wood Planks'], craftingImages: ['images/crafting/woodplank.png']},
    WoodenBow: {craftName: 'Wooden Bow', tabID: 8, resourceAmounts: [2], resourceNames: ['Wood Planks'], craftingImages: ['images/crafting/woodplank.png']},
    WoodenShield: {craftName: 'Wooden Shield', tabID: 8, resourceAmounts: [2], resourceNames: ['Wood Planks'], craftingImages: ['images/crafting/woodplank.png']},

    //Oak
    /*
    OakArrows: {craftName: 'Oak Arrows', tabID: 9, resourceAmounts: [1], resourceNames: ['Oak Planks'], craftingImages: ['images/crafting/oakplank.png']},
    OakStaff: {craftName: 'Oak Staff', tabID: 9, resourceAmounts: [2, 2], resourceNames: ['Oak Planks', 'Bones'], craftingImages: ['images/crafting/oakplank.png', 'images/crafting/bone.png']},
    OakBow: {craftName: 'Oak Bow', tabID: 9, resourceAmounts: [2, 2], resourceNames: ['Oak Planks', 'Bones'], craftingImages: ['images/crafting/oakplank.png', 'images/crafting/bone.png']},
    OakShield: {craftName: 'Oak Shield', tabID: 9, resourceAmounts: [2, 2], resourceNames: ['Oak Planks', 'Bones'], craftingImages: ['images/crafting/oakplank.png', 'images/crafting/bone.png']},
    */
};

/* might change crafting window to have item types instead of resources used
const craftList2 = 
{
    //Alchemy
    MiningPotion: {craftName: 'Mining Potion', tabID: 0, resourceAmounts: [1, 1], resourceNames: ['Empty Vial', 'Herb'], craftingImages: ['images/alchemy/emptyvial.png', 'images/alchemy/herb.png']},
    HarvestingPotion: {craftName: 'Harvesting Potion', tabID: 0, resourceAmounts: [1, 1], resourceNames: ['Empty Vial', 'Herb'], craftingImages: ['images/alchemy/emptyvial.png', 'images/alchemy/herb.png']},
    WoodcuttingPotion: {craftName: 'Woodcutting Potion', tabID: 0, resourceAmounts: [1, 1], resourceNames: ['Empty Vial', 'Herb'], craftingImages: ['images/alchemy/emptyvial.png', 'images/alchemy/herb.png']},

    //Cooking
    Cheese: {craftName: 'Cheese', tabID: 1, resourceAmounts: [2], resourceNames: ['Milk'], craftingImages: ['images/food/milk.png']},

    //Sword
    CopperSword: {craftName: 'Copper Sword', tabID: 2, resourceAmounts: [2, 1], resourceNames: ['Copper Ingots', 'Wood Plank'], craftingImages: ['images/crafting/copper-ingot.png', 'images/crafting/woodplank.png']},

    //Staff

    //Bow

    //Helmet
    CopperHelmet: {craftName: 'Copper Helmet', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},

    //Armor
    CopperArmor: {craftName: 'Copper Armor', tabID: 2, resourceAmounts: [3], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},

    //Pants
    CopperPants: {craftName: 'Copper Pants', tabID: 2, resourceAmounts: [2], resourceNames: ['Copper Ingots'], craftingImages: ['images/crafting/copper-ingot.png']},

    //Ring

    //Necklace
}
*/

//Sends the crafting request to the backend 
function requestCraftItem(craftName, craftAmount) {
    return {
        type: 'POST',
        url: backendurl + 'craftitem/' + craftName + '/' + craftAmount,
        //headers: { 'Authorization': 'Bearer ' + token },
        success: updateController,
        error: logError
    }
}

//Handles user actions regarding anything related to crafting
$(function() {

    //When a craft button is clicked, open up the div for the user to craft a specific quantity
    $(document.body).on('click', 'button#craft' ,function(){

        //Show the div for quantity clicking
        $(this).parent().find('.craftItem').show();

    });

    
    //Gets the quantity and creates a request for a craft
    $('.craftItemButton').on('click', function() {

        //Get the crafting variables from the html
        let craftName = $(this).parent().parent().find('.craft').html();
        let craftAmount = $(this).html();

        //Hide the div if they pressed close
        if (craftAmount == 'Close') {
            $(this).parent().hide();
            return;
        }

        //Check if user is in cooldown or not, if not then create a request to craft an item
        if (checkUserInCooldown() === false) {

            //Replace stuff before we send it to the backend
            let craftNameNoSpaces = craftName.replace(/\s/g, '');
            let craftUseAmountNoSpaces = craftAmount.split(' ')[1];

            //Request the craft with the amount
            $.ajax(requestCraftItem(craftNameNoSpaces, craftUseAmountNoSpaces));

            //Close the parent div container since we made the request
            $(this).parent().hide();

        } 
    }
    );

    //opens/closes up the crafting
    $('div.craftingbutton').click(function() {
        //if(!token) { return twitch.rig.log('Not authorized'); }
        if ($('div.crafting').css('display') == 'none') {
            $('div.crafting').fadeIn();
            $('div.craftingbutton').addClass('active');
        }
        
        else {
            $('div.crafting').fadeOut(); 
            $('div.craftingbutton').removeClass('active');
        }
    });

    //Opens crafting containers contents
    $('body').on('click', '.craftingCollapsible', function() {
        
        //First we make the contents of the collapsibles active or non-active
        let id = $(this).attr('id');
        let tempHTML = 'div#' + id + '.craftingContainer';

        if ($(tempHTML).hasClass('active')) {

            //Deactive the contents
            $(tempHTML).removeClass('active');
            $(tempHTML).hide();

            //Deactive the button
            $(this).removeClass('active');

        } else {
            //Remove all other active classes first
            for (let i = 0; i < 10; i++) {
                let tempContentID = 'div#' + i + '.craftingContainer';
                $(tempContentID).removeClass('active');
                $(tempContentID).hide();

                let tempButtonID = 'button#'+ i + '.craftingCollapsible';
                $(tempButtonID).removeClass('active');
            }

            //Then we make the non-active active that we just clicked
            $(tempHTML).addClass('active');
            $(tempHTML).show();

            $(this).addClass('active');
        }
        
    }
    );
});

function openCraftingWindow() {

    if ($('div.crafting').css('display') == 'none') {

        closeContainersOnSameSide('craftingbutton');
        $('div.crafting').fadeIn();
        $('div.craftingbutton').addClass('active');

    }
}

function buildCraftingWindow() {

    //Loop through the craft list and add their html to the spell window in the the correct tab
    for (const key in craftList) {

        let craftObject = craftList[key];
        let craftTitle = '';
        let craftResourcesRequired = '';

        //Loop through this crafting object and build title and resources required
        for (let i = 0; i < craftObject.resourceAmounts.length; i++) {

            craftTitle += craftObject.resourceAmounts[i] + ' ' +  craftObject.resourceNames[i];

            if (craftObject.resourceAmounts.length > 1) {

                //Add commas if not last index
                if (i != craftObject.resourceAmounts.length - 1) {
                    craftTitle += ', ';
                }   
            }

            craftResourcesRequired += craftObject.resourceAmounts[i] + 'x<img style="vertical-align:middle" id = "skillicon" src="' + craftObject.craftingImages[i] + '"/>'
        }

        let tempSpellHTML = '<div class = "craftingbuttoncontainer">' +

                                //Popup for how many to craft
                                '<div class="craftItem">' +
                                        '<div class="craftItemButton">Craft 1</div>' +
                                        '<div class="craftItemButton">Craft Max</div>' +
                                        '<div class="craftItemButton">Close</div>' +
                                '</div>' +

                                //Button
                                '<button class = "craft" id = "craft" data-toggle="tooltip" title="' + craftTitle + '">' + craftObject.craftName + '</button>' +

                                //Resources required for the craft
                                '<div class = "statright" id = "craft">' + craftResourcesRequired + '</div>' +

                            '</div>';

        //Add the html to the correct tab
        $('div#' + craftObject.tabID + '.craftingContainer').append(tempSpellHTML);
    }
}