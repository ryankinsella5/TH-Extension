const sqlInsertItemIntoInventoryItems = 'INSERT into TwitchHeroes.inventoryitems values (?, ?);'
const sqlDeleteItemFromEquippedItems = 'DELETE FROM TwitchHeroes.equippeditems WHERE user_id = ? AND item_id = ?;';

// This function handles item equipping by the user
exports.unequipItem = function(userId, req){

  let user = allUserData[userId];
  let useritems = user.items;
  let userid = user.userdata[0].user_id;
  let item_id = req.params.item_id;

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Equipped' && useritems[i].item_id == item_id) {

      unequipItemJSON(item_id, useritems);
      unequipItem(userid, item_id, function(err, result){

      });
    }

  }
}

function unequipItem(userid, item_id, useritems, callback) {

  let sqlUnequipParameters = [userid, item_id];

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

function unequipItemJSON(item_id, useritems) {

  for (let i = 0; i < useritems.length; i++) {

    if (useritems[i].Inventory == 'Equipped' && useritems[i].item_id == item_id) {
      useritems[i].Inventory = 'Inventory';
      return;
    }

  }
}
