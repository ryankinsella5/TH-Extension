global.allMarketItems = [];
global.currentMarketItemsIndexed = [];

var marketIndex = 0;
const marketIndexIncrementAmount = 25;

//Market duration added
let addedMarketDuration = 3 * 24 * 60 * 60 * 1000;

//Queries all market items
const marketQuery = 'SELECT * FROM TwitchHeroes.marketitems mi JOIN TwitchHeroes.items i ON i.item_id = mi.item_id ORDER BY sellprice asc;';

//List a market item
const sqlInsertItemIntoMarket = 'INSERT INTO TwitchHeroes.marketitems values (?, ?, ?, ?, ?);'

//Delete item from player's inventory
const sqlDeleteItemFromInventoryItems = 'DELETE FROM TwitchHeroes.inventoryitems WHERE user_id = ? AND item_id = ?;';

//Insert into player's items
const sqlInsertItemIntoInventoryItems = 'INSERT INTO TwitchHeroes.inventoryitems values (?, ?);'

//Delete from martket
const sqlDeleteFromMarketItems = 'DELETE FROM TwitchHeroes.marketitems WHERE item_id = ?;';

//Update gold queries
const subtractUsersGoldSQL = 'UPDATE TwitchHeroes.users SET gold = gold - ? WHERE user_id = ?;';
const addUsersGoldSQL = 'UPDATE TwitchHeroes.users SET gold = gold + ? WHERE user_id = ?;';

//Check for expired items (pass current datetime)
const selectAllExpiredItemsSQL = 'SELECT * FROM TwitchHeroes.marketitems WHERE enddate < ?';

//Gets all market items
setInterval(function(){ queryMarketItems();}, 5000);

//Returns expired items to the player
setInterval(function(){ returnExpiredMarketItems();}, 5000);

//Refresh current market items
setInterval(function(){ refreshCurrentMarketItems();}, 60 * 1000);

function queryMarketItems() {

	connection.query(marketQuery, function(error, rows, fields) {
	    if (error) {
	        console.log('Error in query market query');
	      
	    } else {
	      allMarketItems = rows;
	    }
	});
}

//Returns all expired items to the player who listed it
function returnExpiredMarketItems() {

  connection.query(selectAllExpiredItemsSQL, Date.now(), function(error, rows, fields) {
      if (error) {
          console.log('Error in query selectAllExpiredItemsSQL');
        
      } else {

        for (let i = 0; i < rows.length; i++) {

          let tempItem = rows[i];
          let tempItemID = tempItem.item_id;

          //Parameters
          let deleteParameters = [tempItemID];
          let insertParameters = [tempItem.seller_id, tempItemID];

          //Delete item locally
          removeItemJSONMarket(tempItemID);

          //Delete item from market 
          deleteItemFromMarket(deleteParameters, function(err, result){
          });

          //Insert into sellers's inventory
          insertItemIntoInventory(insertParameters, function(err, result){
          });
          
        }
      }
  });
}

//We only want to pass a set amount of items to the front end
function refreshCurrentMarketItems() {

  //Get next x amount of market items
  let slicedArray = allMarketItems.slice(marketIndex * marketIndexIncrementAmount, (marketIndex + 1) * marketIndexIncrementAmount);

  //Set equal to sliced array (resets current array)
  currentMarketItemsIndexed = slicedArray;

  //Increment index
  marketIndex++;

  //Reset index if higher than market items length
  if ((marketIndex * marketIndexIncrementAmount) > allMarketItems.length) 
    marketIndex = 0;

}

//When a player attempts to list an item to the market
exports.listItemMarket = function(userId, req) {

	let user = allUserData[userId];
  let userdata = user.userdata[0];
  let login = user.channelName;
  let userid = userdata.user_id;

  //Passed parameters
  let item_id = req.params.item_id;
  let item_price = req.params.item_price;

  //If it exists already, don't add it
  if (checkIfItemExists(item_id) != null)
    return;

  //Parse as an integer
  let itemPriceInteger = parseInt(item_price);

  //If it's NaN (not an integer)
  if (isNaN(itemPriceInteger))
    return;

  //If it's too big, quit out
  if (itemPriceInteger > 2147483647)  
    return;

  //Market duration 
  let marketDuration = Date.now() + addedMarketDuration;

  let parameters1 = [userid, login, item_id, itemPriceInteger, marketDuration];
  let parameters2 = [userid, item_id];

  removeItemJSONUserItems(user.items, item_id);
  
  insertItemIntoMarket(parameters1, parameters2, function(err, result){
  });
}

//When a player attempts to buy an item from the market
exports.buyItemMarket = function(userId, req) {

  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let login = user.channelName;
  let item_id = req.params.item_id;
  let userid = userdata.user_id;

  //Get item price if the item exists
  var itemObject = checkIfItemExists(item_id);

  //Item doesn't exist
  if (itemObject == null)
    return;

  //If the item expired
  if (itemObject.enddate < Date.now())
    return;

  let itemPrice = itemObject.sellprice;

  //Check if player has enough gold
  if (userdata.gold >= itemPrice) {

    //Make paramters for queries
    let deleteParameters = [item_id];
    let insertParameters = [userid, item_id];

    //Updating gold paramters
    let buyerParameters = [itemPrice, userid];
    let sellerParameters = [itemPrice, itemObject.seller_id];

    //Delete item locally
    removeItemJSONMarket(item_id);

    //Delete item from database
    deleteItemFromMarket(deleteParameters, function(err, result){
    });

    //Insert item into inventory
    insertItemIntoInventory(insertParameters, function(err, result){
    });

    //Update gold for buyer
    subtractUserGold(buyerParameters, function(err, result){
    });

    //Update gold for seller
    addUserGold(sellerParameters, function(err, result){
    });
  }

}

//Returns item if it exists
function checkIfItemExists(item_id) {

  for (let i = 0; i < allMarketItems.length; i++) {
    
    let tempMarketItem = allMarketItems[i];

    if (tempMarketItem.item_id == item_id)
      return tempMarketItem;
  }

  return null;
}

//Removes the purchased item from json
function removeItemJSONMarket(item_id) {

  //Remove from all market items
  for (let i = 0; i < allMarketItems.length; i++) {

    //Remove item
    if (allMarketItems[i].item_id == item_id) 
      allMarketItems.splice(i, 1);
  }

  //Remove from current indexed market items
  for (let i = 0; i < currentMarketItemsIndexed.length; i++) {

    //Remove item
    if (currentMarketItemsIndexed[i].item_id == item_id) 
      currentMarketItemsIndexed.splice(i, 1);
  }
}

//Removes the item from user's json
function removeItemJSONUserItems(useritems, item_id) {

  for (let i = 0; i < useritems.length; i++) {

    //Remove item
    if (useritems[i].item_id == item_id) 
      useritems.splice(i, 1);
  }
}

function insertItemIntoMarket(parameters1, parameters2, callback) {

  let query = connection.query(sqlInsertItemIntoMarket, parameters1, function(error, result) {
      if (error) {
        console.log('error in query sqlInsertItemIntoMarket');
        callback(null, 'true');
        
      } else {

        let deleteItemFromInventoryItems = connection.query(sqlDeleteItemFromInventoryItems, parameters2, function(error, result) {
            if (error) {
                console.log('error in query deleteItemFromInventoryItems');
            }
          });

        callback(null, 'true');
      }
  });
}

function deleteItemFromMarket(parameters, callback) {

  //Delete from market
  let query = connection.query(sqlDeleteFromMarketItems, parameters, function(error, result) {
      if (error) {
        console.log('error in query sqlDeleteFromMarketItems');
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

function insertItemIntoInventory(parameters, callback) {

  //Delete from market
  let query = connection.query(sqlInsertItemIntoInventoryItems, parameters, function(error, result) {
      if (error) {
        console.log('error in query sqlInsertItemIntoInventoryItems');
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

function addUserGold(parameters, callback) {

  let query = connection.query(addUsersGoldSQL, parameters, function(error, result) {
      if (error) {
        console.log('error in query: addUsersGoldSQL');
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}

function subtractUserGold(parameters, callback) {

  let query = connection.query(subtractUsersGoldSQL, parameters, function(error, result) {
      if (error) {
        console.log('error in query: subtractUsersGoldSQL');
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}
