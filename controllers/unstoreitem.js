//Inserting item into player's inventory
const insertItemIntoInventory = 'INSERT into TwitchHeroes.inventoryItems values (?, ?);'

//Delete item from player's bank
const deleteItemFromBankItems = 'DELETE FROM TwitchHeroes.bank WHERE user_id = ? AND item_id = ?;';

// This function handles item unstoring items by the user
exports.unstoreItem = function(userId, req){

  //User info
  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let useritems = user.items;
  let userid = userdata.user_id;

  //Item info
  let item_id = req.params.item_id;
  

  if (checkIfItemExistsAndIsInBank(item_id, useritems)) {

      unstoreItem(userid, item_id, useritems, function(err, result){
      });
  }

  return;
}

//Make sure it exists
function checkIfItemExistsAndIsInBank(item_id, useritems) {
  for (let i = 0; i < useritems.length; i++) {

    let tempItem = useritems[i];

    if (tempItem.item_id && tempItem.Inventory == 'Bank') 
      return true;
  }

  return false;
}

//Store item
function unstoreItem(userid, item_id, useritems, callback) {

  let sqlStoreParameters = [userid, item_id];

  unstoreItemJSON(useritems, item_id)

  let insertItemIntoInventoryQuery = connection.query(insertItemIntoInventory, sqlStoreParameters, function(error, result) {
      if (error) {
          console.log('error in query: ' + insertItemIntoInventoryQuery.sql);
        
      } else {

          let deleteItemFromBankItemsQuery = connection.query(deleteItemFromBankItems, sqlStoreParameters, function(error, result) {
            if (error) {
                console.log('error in query: ' + deleteItemFromBankItemsQuery.sql);
              
            } else {
              //console.log('deleted');
            }
          });
      }
  });
}

function unstoreItemJSON(useritems, item_id) {

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Bank' && useritems[i].item_id == item_id) {
      useritems[i].Inventory = 'Inventory';
      return;
    }

  }
}