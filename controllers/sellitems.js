//Resources that users can sell
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
                            'milk', 'egg', 'cheese',

                            //Gems
                            'qualitygem', 'removestatsgem', 'alterationgem', 'transmutationgem', 'augmentgem'
                        ];

// This function handles item selling
exports.sellItems = function(userId, req){

  //User info
  let user = allUserData[userId];

  if (typeof user === 'undefined') 
      return;

  let userdata = user.userdata[0];

  if (typeof userdata === 'undefined') 
      return;

  let login = user.channelName;

  if (typeof login === 'undefined') 
      return;
    
  let totalSellPrice = 0;

  //Items to sell passed
  let itemIDArray = req.params.itemIDArray;
  let itemids = itemIDArray.split(',');

  //Resources to sell passed
  let resourceArray = req.params.resourceArray;
  let sufficientResourceArray = [];

  //Remove any duplicates users might have been injected
  let uniqueIDS = removeDuplicates(itemids);
  
  //Make sure that the ids actually exist in their inventory/equipment, users might inject these
  let checkedArray = checkIfIdsExistInItems(uniqueIDS, user.items);

  let checkedIDS = checkedArray[0];

  //Only run delete query if there are items to delete
  if (checkedIDS.length > 0) {
    totalSellPrice = checkedArray[1];

    //Array for both delete queries
    let deleteItemQueriesArray = makeDeleteItemsQueries(checkedIDS);

    //Delete items from their inventory
    executeQuery(deleteItemQueriesArray[0], function(err, result){
    });

    //Delete item from items table
    executeQuery(deleteItemQueriesArray[1], function(err, result){
    });
  }

  //If there are resources to sell, make sure the user has them
  if (resourceArray.length > 0) {

    let resourceArraySplit = resourceArray.split(',');

    //Array should be an even length (1 for resource name and 1 for the resource quantity)
    if (resourceArraySplit.length % 2 == 0) {
      sufficientResourceArray = checkIfUserHasResources(userdata, resourceArraySplit);
    }
  }

  //Make a query to update user gold and resources
  let updateQuery = makeResourceAndGoldQuery(userdata, sufficientResourceArray, totalSellPrice);
  
  //Run update query
  executeQuery(updateQuery, function(err, result){
  });
}

//Remove duplicates from given array
function removeDuplicates(passedArray){

  let uniqueArray = [];

  for (let i = 0; i < passedArray.length; i++){

    if(uniqueArray.indexOf(passedArray[i]) == -1)
      uniqueArray.push(passedArray[i])
  }

  return uniqueArray;
}

function checkIfUserHasResources(userdata, resourcesToSell) {

  let sufficientResourceArray = [];

  for(let i = 0; i < resourcesToSell.length; i += 2){

    let resourceName = resourcesToSell[i];
    let resourceQuantity = resourcesToSell[i + 1];

    //Check if it in sellable array
    if (resourceNames.includes(resourceName)) {

      //If they have enough, push to sufficient resource array
      if (userdata[resourceName] >= resourceQuantity) {

        //Remove resources locally
        userdata[resourceName] -= resourceQuantity;

        //Push to sufficient array
        sufficientResourceArray.push(resourceName);
        sufficientResourceArray.push(resourceQuantity);
      }

    }
  }

  return sufficientResourceArray;
}

//Checks if the items exists in ther inventory, otherwise remove the ids and continue with valid ones
function checkIfIdsExistInItems(itemids, useritems) {

  let totalValue = 0;

  for (let j = 0; j < itemids.length; j++) {

    let containsThis = false;

    for (let i = 0; i < useritems.length; i++) {

      let tempitem = useritems[i];

      //Item exists 
      if (tempitem.item_id == itemids[j]) {
        
        containsThis = true;

        //Remove item from json
        useritems.splice(i, 1);
      }
    }

    if(containsThis == false) {

     itemids.splice(j, 1);
   }
 }

 return [itemids, totalValue];
}

//Make a query to update resources and gold
function makeResourceAndGoldQuery(userdata, resourcesToSell, totalSellPrice) {

  //Add sell price for the resources
  for (let i = 0; i < resourcesToSell.length; i += 2) 
    totalSellPrice += parseInt(resourcesToSell[i + 1]);

  let updateQuery = 'UPDATE TwitchHeroes.users SET gold = gold + ' + totalSellPrice;

  //Loop  through array and add resources names and quantities
  for (let i = 0; i < resourcesToSell.length; i += 2) {

    let tempUpdateStatement = ', ' + resourcesToSell[i] + ' = ' + resourcesToSell[i] + ' - ' + resourcesToSell[i + 1];
    updateQuery += tempUpdateStatement;
  }

  //Final part of query
  updateQuery += ' WHERE login = "' + userdata.login + '";';

  //Update local gold
  userdata.gold += totalSellPrice;

  return updateQuery;
}

function makeDeleteItemsQueries(itemids) {

  let deleteInventoryItemsQuery = 'DELETE FROM TwitchHeroes.InventoryItems WHERE item_id IN (';
  let deleteItemsQuery =          'DELETE FROM TwitchHeroes.Items WHERE item_id IN (';
  let queryEnd = '';

  for (let i = 0; i < itemids.length; i++) {

    queryEnd += itemids[i];
    //If not last, add a comma
    if (i != itemids.length - 1) {
      queryEnd += ','
    }
  }

  queryEnd += ');';

  //Add end to both queries
  deleteInventoryItemsQuery += queryEnd;
  deleteItemsQuery += queryEnd;

  //Return array of both queries
  return [deleteInventoryItemsQuery, deleteItemsQuery];
}

function executeQuery(sql, callback) {

  let query = connection.query(sql, function(error, result) {
    if (error) {
      console.log('error in query in sell items');
    } 

    return callback('true');
  });
}