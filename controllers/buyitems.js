//Prepared queries
const updateUserGoldSQL = 'UPDATE TwitchHeroes.users SET gold = gold - ? WHERE login = ?;';
const updateUserBagSlotsSQL = 'UPDATE TwitchHeroes.users SET inventoryslots = inventoryslots + 1, gold = gold - ? WHERE login = ?';

//Crafting a tool query
const craftToolSQLStatement = 'INSERT INTO TwitchHeroes.items(item_name, item_type, gatherspeed) VALUES(?, ?, 5)';

//Inserting tool into player's inventory
const insertToolIntoInventory = 'INSERT into TwitchHeroes.inventoryItems values (?, ?);'

//Default inentory size
const baseInventorySize = 30;

//Contains buyable items from the vendor
const vendorBuyItems = {

  /*
  BasicPickaxe: {itemName: 'Basic Pickaxe', buyPrice: 0, toolType: 'pickaxe', itemType: 'tool'},
  BasicAxe: {itemName: 'Basic Axe', buyPrice: 0, toolType: 'axe', itemType: 'tool'},
  BasicHoe: {itemName: 'Basic Hoe', buyPrice: 0, toolType: 'hoe', itemType: 'tool'},
  BasicShears: {itemName: 'Basic Shears', buyPrice: 0, toolType: 'shears', itemType: 'tool'},
  BasicBucket: {itemName: 'Basic Bucket', buyPrice: 0, toolType: 'bucket', itemType: 'tool'},
  EmptyVial: {itemName: 'Empty Vial', buyPrice: 2, sqlRowName: 'emptyvial', itemType: 'potion'},
  */
};

const resourceNames = [ 
                            //Metal
                            'copperore', 'copperingot', 
                            'ironingot', 
                            'goldore', 'goldingot', 

                            //Wood
                            'wood', 'woodplank', 
                            'oak', 'oakplank', 

                            //Cloth
                            'wool', 'woolcloth', 
                            'silkcloth', 

                            //Leather
                            'hide', 'leather', 

                            //Monster drops
                            'bone', 'eyeball', 'slime', 'batwing', 'centaurhoof',

                            //Alchemy
                            'herb', 'emptyvial', 'essence', 

                            //Cooking
                            'milk'
];

// This function handles item buying
exports.buyItems = function(userId, req){

  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let login = user.channelName;
  let itemName = req.params.itemName;
  let userid = userdata.user_id;

  //Check if item is real
  if (vendorBuyItems.hasOwnProperty(itemName)) {

    let tempItem = vendorBuyItems[itemName];
    let buyPrice = tempItem.buyPrice;

    //If they have enough gold
    if (userdata.gold >= buyPrice) {

      //If it's a tool
      if (tempItem.itemType == 'tool') {

        //If they're full inventory, quit
        if (checkIfFullInventory(user, userdata)) {
          //console.log('full inventory');
          return;
        }
        let toolType = tempItem.toolType;
        let toolName = tempItem.itemName;

        //Make a tool object and push it into their items
        let itemJSON = {user_id: -1, Inventory: 'Inventory', item_name: toolName, quality: 1, item_id: -1, item_type: 'tool', item_level: 1, armor: 0, damage: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, gatherspeed: 10};

        user.items.push(itemJSON);

        //Execute the craft tool query 
        craftTool(user, userid, toolName, toolType, function(err, result){
        });

      }

      //Not a tool
      else {
        let sqlRowName = tempItem.sqlRowName;

        userdata.gold -= buyPrice;
        userdata.emptyvial += 1;
  
        updateUserGold([buyPrice, login], function(err, result){
        });
  
        let sqlPrepared = createAddItemsToInventoryPrepared(sqlRowName);
  
        addItemsToInventory(sqlPrepared, [1, login], function(err, result){
        });
      }
      
    }

  }

  //If it's a bag slot upgrade
  if (itemName == 'BagSlot') {

    //Check if they have enough gold
    let nextBagCost = getNextBagUpgradeCost(userdata);
    let userGold = userdata.gold;

    if (userGold >= nextBagCost) {

      //execute the query
      updateInventorySlotsAndUserGold([nextBagCost, login], function(err, result){
      });
      
      //update local gold
      userdata.gold -= nextBagCost;

      //update local inventory slots
      userdata.inventoryslots++;
    }
  }
}

function checkIfFullInventory(user, userdata) {

  let inventoryCount = 0;

  //Add resource count
  for (let i = 0; i < resourceNames.length; i++) {
    
    let resourceName = resourceNames[i];
    inventoryCount += userdata[resourceName];
  }

  //Add inventory item count
  for (var i = 0; i < user.items.length; i++) {

    //If it's in their inventory
    if (user.items[i]['Inventory'] == 'Inventory')
      inventoryCount += 1;
  }

  //If they have greater or equal to their number of inventory slots, return true
  if (inventoryCount >= userdata.inventoryslots + baseInventorySize)
    return true;
  
  return false;
}

//Craft a tool
function craftTool(user, userid, itemName, itemType, callback) {

  let query = connection.query(craftToolSQLStatement, [itemName, itemType], function(error, result) {

      if (error) {
        console.log('error in query: ' + query.craftToolSQLStatement);
        callback(null, 'true'); 
      } 

      else {

        let insertedID = result.insertId;

        //Add the inserted tool to the player's inventory
        insertToolIntoPlayersInventory(userid, insertedID, function(err, result){
        });

      }
  });
}

//Adds crafted tool into the player's inventory
function insertToolIntoPlayersInventory(userid, insertedID, callback) {

  let query = connection.query(insertToolIntoInventory, [userid, insertedID], function(error, result) {

      if (error) {
        console.log('error in query: ' + query.insertToolIntoInventory);
        callback(null, 'true');
      } 

      else {
        callback(null, 'true');
      }
  });
}

function updateUserGold(parameters, callback) {

  let query = connection.query(updateUserGoldSQL, parameters, function(error, result) {
      if (error) {
        console.log('error in query: ' + query.updateUserGoldSQL);
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

function createAddItemsToInventoryPrepared(itemName) {

  let query = 'UPDATE TwitchHeroes.users SET ' + itemName + ' = ' + itemName + ' + ? WHERE login = ?;';
  return query;
}

function addItemsToInventory(sqlPreparedStatement, parameters, callback) {

  let query = connection.query(sqlPreparedStatement, parameters, function(error, result) {
      if (error) {
        console.log('error in query: ' + query.sqlPreparedStatement);
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

function updateInventorySlotsAndUserGold(parameters, callback) {

  let query = connection.query(updateUserBagSlotsSQL, parameters, function(error, result) {
      if (error) {
        console.log('error in query: ' + query.updateUserBagSlotsSQL);
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

//Bag upgrade stuff
function getNextBagUpgradeCost(userdata) {

    let nextBagCost = userdata.inventoryslots * 5;
    return nextBagCost;
}
