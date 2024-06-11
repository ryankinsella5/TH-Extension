const sqlInsertItemIntoEquippedItems = 'INSERT into TwitchHeroes.equippeditems values (?, ?);'
const sqlDeleteItemFromInventoryItems = 'DELETE FROM TwitchHeroes.inventoryitems WHERE user_id = ? AND item_id = ?;';
const sqlInsertItemIntoInventoryItems = 'INSERT into TwitchHeroes.inventoryitems values (?, ?);'
const sqlDeleteItemFromEquippedItems = 'DELETE FROM TwitchHeroes.equippeditems WHERE user_id = ? AND item_id = ?;';

// This function handles item equipping by the user
exports.equipItem = function(userId, req){

  //User info
  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let useritems = user.items;
  let userid = userdata.user_id;

  //Item info
  let item_id = req.params.item_id;

  //Resource
  if (item_id <= 0)
    return;

  let item_location = getItemLocation(item_id, useritems);
  let item = useritems[item_location];
  let item_type = item.item_type;

  //check if the item is can be equipped and actually exists in the user's inventory
  if (item.Inventory == 'Inventory' && item.item_id == item_id) {

    let typeCheck = checkIfItemOfThatTypeIsEquipped(item_type, useritems);

    //if an item of that type is equipped, swap them
    if (typeCheck != false) {

      unequipItem(userid, typeCheck, useritems, function(err, result){
      });

      equipItem(userid, item_id, useritems, function(err, result){
      });
    }

    //otherwise just equip it
    else {
        equipItem(userid, item_id, useritems, function(err, result){
      });
    }
  }
}

//We pass the item_id and items and sort through all items to get it's location
//This is useful because we can use it to look data on it
//The only time this fails is if the user changes the values in html
function getItemLocation(item_id, useritems) {
  for (let i = 0; i < useritems.length; i++) {
    if (useritems[i].item_id == item_id) {
      return i;
    }
  }

  return false;
}

//Should return an item so we can just unequip it
function checkIfItemOfThatTypeIsEquipped(item_type, useritems) {

  for (let i = 0; i < useritems.length; i++) {
    if (useritems[i].Inventory == 'Equipped' && useritems[i].item_type == item_type) {
        return useritems[i].item_id;
    }
  }

  return false;
}

function equipItem(userid, item_id, useritems, callback) {

  let sqlEquipParameters = [userid, item_id];

  equipItemJSON(useritems, item_id);

  let insertItemIntoEquppedItemsQuery = connection.query(sqlInsertItemIntoEquippedItems, sqlEquipParameters, function(error, result) {
      if (error) {
          console.log('error in query: ' + insertItemIntoEquppedItemsQuery.sql);
        
      } else {

          let deleteItemFromInventoryItems = connection.query(sqlDeleteItemFromInventoryItems, sqlEquipParameters, function(error, result) {
            if (error) {
                console.log('error in query: ' + deleteItemFromInventoryItems.sql);
              
            } else {
              //console.log(deleteItemFromInventoryItems.sql);
            }
          });
      }
  });
}

function unequipItem(userid, item_id, useritems, callback) {

  let sqlUnequipParameters = [userid, item_id];

  unequipItemJSON(useritems, item_id);

  let insertItemIntoInventoryItemsQuery = connection.query(sqlInsertItemIntoInventoryItems, sqlUnequipParameters, function(error, result) {
    
      if (error) {
          console.log('error in query: ' + insertItemIntoInventoryItemsQuery.sql);
        
      } else {

          let deleteItemFromEquippedItems = connection.query(sqlDeleteItemFromEquippedItems, sqlUnequipParameters, function(error, result) {
            if (error) {
                console.log('error in query: ' + deleteItemFromEquippedItems.sql);
              
            } else {
              //console.log(deleteItemFromEquippedItems.sql);
            }
          });
      }
  });
}

function equipItemJSON(useritems, item_id) {

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Inventory' && useritems[i].item_id == item_id) {
      useritems[i].Inventory = 'Equipped';
      return;
    }

  }
}

function unequipItemJSON(useritems, item_id) {

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Equipped' && useritems[i].item_id == item_id) {
      useritems[i].Inventory = 'Inventory';
      return;
    }

  }
}

