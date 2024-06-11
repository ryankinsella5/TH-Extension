//Base bank size
const baseBankSize = 30;

//Inserting item into player's bank
const insertItemIntoBank = 'INSERT into TwitchHeroes.bank values (?, ?);'

//Delete item from player's inventory
const deleteItemFromInventoryItems = 'DELETE FROM TwitchHeroes.inventoryitems WHERE user_id = ? AND item_id = ?;';

// This function handles item storing items by the user
exports.storeItem = function(userId, req){

  //User info
  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let useritems = user.items;
  let userid = userdata.user_id;

  //Item info
  let item_id = req.params.item_id;
  
  //If full bank, return
  if (checkIfFullBank(useritems)) {
    return;
  }

  if (checkIfItemExistsAndIsInInventory(item_id, useritems)) {

      storeItem(userid, item_id, useritems, function(err, result){
      });
  }
}

//Check if the bank is full before attempting to store items.
function checkIfFullBank(useritems) {

  let bankCount = 0;
  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Bank')
      bankCount++;
  }

  //If count is more, return true (full bank)
  if (bankCount >= baseBankSize)
    return true;

  //Not full
  return false;
}

//Make sure it exists
function checkIfItemExistsAndIsInInventory(item_id, useritems) {
  for (let i = 0; i < useritems.length; i++) {

    let tempItem = useritems[i];

    if (tempItem.item_id && tempItem.Inventory == 'Inventory') 
      return true;
  }

  return false;
}

//Store item
function storeItem(userid, item_id, useritems, callback) {

  let sqlStoreParameters = [userid, item_id];

  storeItemJSON(useritems, item_id)

  let insertItemIntoBankQuery = connection.query(insertItemIntoBank, sqlStoreParameters, function(error, result) {
      if (error) {
          console.log('error in query: ' + insertItemIntoBankQuery.sql);
        
      } else {

          let deleteItemFromInventoryItemsQuery = connection.query(deleteItemFromInventoryItems, sqlStoreParameters, function(error, result) {
            if (error) {
                console.log('error in query: ' + deleteItemFromInventoryItemsQuery.sql);
              
            } else {
              //console.log('deleted');
            }
          });
      }
  });
}

function storeItemJSON(useritems, item_id) {

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Inventory' && useritems[i].item_id == item_id) {
      useritems[i].Inventory = 'Bank';
      return;
    }

  }
}
