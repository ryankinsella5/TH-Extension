//Defines parameters for resources necessary and produced by crafting
const crafts = 
{
  //Alchemy
  MiningPotion: {craftType: 'resource', colNameAdded: ['miningpotion'], addedAmount: [1], colNameSubtracted: ['herb'], subtractedAmount: [2], xpColName: 'alchemy', xpAdded: 2},
  HarvestingPotion: {craftType: 'resource', colNameAdded: ['harvestingpotion'], addedAmount: [1], colNameSubtracted: ['herb'], subtractedAmount: [2], xpColName: 'alchemy', xpAdded: 2},
  WoodcuttingPotion: {craftType: 'resource', colNameAdded: ['woodcuttingpotion'], addedAmount: [1], colNameSubtracted: ['herb'], subtractedAmount: [2], xpColName: 'alchemy', xpAdded: 2},
  
  //Copper 
  CopperSword: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Copper Sword', item_type: 'weapon', item_level: 1, armor: 0, colNameSubtracted: ['copperingot', 'woodplank'], subtractedAmount: [1, 1], xpColName: 'blacksmithing', xpAdded: 2},
  CopperHelmet: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Copper Helmet', item_type: 'helmet', item_level: 1, armor: 2, colNameSubtracted: ['copperingot'], subtractedAmount: [2], xpColName: 'blacksmithing', xpAdded: 2},
  CopperArmor: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Copper Armor', item_type: 'armor', item_level: 1, armor: 4, colNameSubtracted: ['copperingot'], subtractedAmount: [2], xpColName: 'blacksmithing', xpAdded: 2},
  CopperPants: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Copper Pants', item_type: 'pants', item_level: 1, armor: 3, colNameSubtracted: ['copperingot'], subtractedAmount: [2], xpColName: 'blacksmithing', xpAdded: 2},
  CopperBoots: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Copper Boots', item_type: 'boots', item_level: 1, armor: 2, colNameSubtracted: ['copperingot'], subtractedAmount: [2], xpColName: 'blacksmithing', xpAdded: 2},
  
  //Food
  Cheese: {craftType: 'resource', colNameAdded: ['cheese'], addedAmount: [1], colNameSubtracted: ['milk'], subtractedAmount: [2], xpColName: 'cooking', xpAdded: 2},

  //Gold
  GoldenRing: {craftType: 'equipment', bonusStat: 'wisdom', item_name: 'Golden Ring', item_type: 'ring', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  GoldenNecklace: {craftType: 'equipment', bonusStat: 'wisdom', item_name: 'Golden Necklace', item_type: 'necklace', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  Goblet: {craftType: 'equipment', bonusStat: 'wisdom', item_name: 'Goblet', item_type: 'trinket', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},

  //Gold tools
  GoldenPickaxe: {craftType: 'equipment', bonusStat: '', item_name: 'Golden Pickaxe', item_type: 'tool', tool_type: 'pickaxe', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  GoldenAxe: {craftType: 'equipment', bonusStat: '', item_name: 'Golden Axe', item_type: 'tool', tool_type: 'axe', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  GoldenHoe: {craftType: 'equipment', bonusStat: '', item_name: 'Golden Hoe', item_type: 'tool', tool_type: 'hoe', item_level: 2, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  GoldenShears: {craftType: 'equipment', bonusStat: '', item_name: 'Golden Shears', item_type: 'tool', tool_type: 'shears', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},
  GoldenBucket: {craftType: 'equipment', bonusStat: '', item_name: 'Golden Bucket', item_type: 'tool', tool_type: 'bucket', item_level: 1, armor: 0, colNameSubtracted: ['goldingot'], subtractedAmount: [2], xpColName: 'jewelcrafting', xpAdded: 4},

  //Iron
  /*
  IronSword: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Iron Sword', item_type: 'weapon', item_level: 2, armor: 0, colNameSubtracted: ['copperingot', 'bone'], subtractedAmount: [2, 2], xpColName: 'blacksmithing', xpAdded: 4},
  IronHelmet: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Iron Helmet', item_type: 'helmet', item_level: 2, armor: 4, colNameSubtracted: ['copperingot', 'eyeball'], subtractedAmount: [2, 2], xpColName: 'blacksmithing', xpAdded: 4},
  IronArmor: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Iron Armor', item_type: 'armor', item_level: 2, armor: 5, colNameSubtracted: ['copperingot', 'slime'], subtractedAmount: [2, 2], xpColName: 'blacksmithing', xpAdded: 4},
  IronPants: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Iron Pants', item_type: 'pants', item_level: 2, armor: 4, colNameSubtracted: ['copperingot', 'batwing'], subtractedAmount: [2, 2], xpColName: 'blacksmithing', xpAdded: 4},
  IronBoots: {craftType: 'equipment', bonusStat: 'strength', item_name: 'Iron Boots', item_type: 'boots', item_level: 2, armor: 3, colNameSubtracted: ['copperingot', 'centaurhoof'], subtractedAmount: [2, 2], xpColName: 'blacksmithing', xpAdded: 4},
  */

  //Leather
  LeatherCloak: {craftType: 'equipment', bonusStat: 'dexterity', item_name: 'Leather Cloak', item_type: 'cloak', item_level: 1, armor: 0, colNameSubtracted: ['leather'], subtractedAmount: [2], xpColName: 'leatherworking', xpAdded: 4},
  LeatherBelt: {craftType: 'equipment', bonusStat: 'dexterity', item_name: 'Leather Belt', item_type: 'belt', item_level: 1, armor: 0, colNameSubtracted: ['leather'], subtractedAmount: [2], xpColName: 'leatherworking', xpAdded: 4},
  LeatherGloves: {craftType: 'equipment', bonusStat: 'dexterity', item_name: 'Leather Gloves', item_type: 'gloves', item_level: 1, armor: 0, colNameSubtracted: ['leather'], subtractedAmount: [2], xpColName: 'leatherworking', xpAdded: 4},
  
  //Oak
  /*
  OakArrows: {craftType: 'resource', colNameAdded: ['arrows'], addedAmount: [100], colNameSubtracted: ['oakplank'], subtractedAmount: [1], xpColName: 'woodworking', xpAdded: 2},
  OakStaff: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Oak Staff', item_type: 'weapon', item_level: 2, armor: 0, colNameSubtracted: ['oakplank', 'bone'], subtractedAmount: [2, 2], xpColName: 'woodworking', xpAdded: 6},
  OakBow: {craftType: 'equipment', bonusStat: 'dexterity', item_name: 'Oak Bow', item_type: 'weapon', item_level: 2, armor: 0, colNameSubtracted: ['oakplank', 'bone'], subtractedAmount: [2, 2], xpColName: 'woodworking', xpAdded: 6},
  OakShield: {craftType: 'equipment', bonusStat: 'constitution', item_name: 'Oak Shield', item_type: 'shield', item_level: 2, armor: 4, colNameSubtracted: ['oakplank', 'bone'], subtractedAmount: [2, 2], xpColName: 'woodworking', xpAdded: 6},
  */

  //Silk
  /*
  SilkCap:    {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Silk Cap', item_type: 'helmet', item_level: 2, armor: 2, colNameSubtracted: ['woolcloth', 'eyeball'], subtractedAmount: [2, 2], xpColName: 'tailoring', xpAdded: 4},
  SilkRobes:  {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Silk Robes', item_type: 'armor', item_level: 2, armor: 3, colNameSubtracted: ['woolcloth', 'slime'], subtractedAmount: [2, 2], xpColName: 'tailoring', xpAdded: 4},
  SilkPants:  {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Silk Pants', item_type: 'pants', item_level: 2, armor: 3, colNameSubtracted: ['woolcloth', 'batwing'], subtractedAmount: [2, 2], xpColName: 'tailoring', xpAdded: 4},
  SilkBoots:  {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Silk Boots', item_type: 'boots', item_level: 2, armor: 2, colNameSubtracted: ['woolcloth', 'centaurhoof'], subtractedAmount: [2, 2], xpColName: 'tailoring', xpAdded: 4},
  */
  
  //Wood
  WoodenStaff: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Wooden Staff', item_type: 'weapon', item_level: 1, armor: 0, colNameSubtracted: ['woodplank'], subtractedAmount: [2], xpColName: 'woodworking', xpAdded: 2},
  WoodenBow: {craftType: 'equipment', bonusStat: 'dexterity', item_name: 'Wooden Bow', item_type: 'weapon', item_level: 1, armor: 0, colNameSubtracted: ['woodplank'], subtractedAmount: [2], xpColName: 'woodworking', xpAdded: 2},
  WoodenShield: {craftType: 'equipment', bonusStat: 'constitution', item_name: 'Wooden Shield', item_type: 'shield', item_level: 1, armor: 2, colNameSubtracted: ['woodplank'], subtractedAmount: [2], xpColName: 'woodworking', xpAdded: 2},
  Arrows: {craftType: 'resource', colNameAdded: ['arrows'], addedAmount: [50], colNameSubtracted: ['woodplank'], subtractedAmount: [1], xpColName: 'woodworking', xpAdded: 1},

  //Wool
  WoolCap: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Wool Cap', item_type: 'helmet', item_level: 1, armor: 1, colNameSubtracted: ['woolcloth'], subtractedAmount: [2], xpColName: 'tailoring', xpAdded: 2},
  WoolRobes: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Wool Robes', item_type: 'armor', item_level: 1, armor: 2, colNameSubtracted: ['woolcloth'], subtractedAmount: [2], xpColName: 'tailoring', xpAdded: 2},
  WoolPants: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Wool Pants', item_type: 'pants', item_level: 1, armor: 2, colNameSubtracted: ['woolcloth'], subtractedAmount: [2], xpColName: 'tailoring', xpAdded: 2},
  WoolBoots: {craftType: 'equipment', bonusStat: 'intelligence', item_name: 'Wool Boots', item_type: 'boots', item_level: 1, armor: 1, colNameSubtracted: ['woolcloth'], subtractedAmount: [2], xpColName: 'tailoring', xpAdded: 2},
};

const sqlInsertNewItem =  'INSERT INTO TwitchHeroes.items(item_name, item_type, item_level, item_armor, item_damage) ' + 
                          'VALUES(?, ?, ?, ?, ?)';

const sqlInsertItemIntoInventory = 'INSERT into TwitchHeroes.inventoryItems values (?, ?);'

const possibleStatNames = ['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom'];

// This function handles item crafting 
exports.craftController = function(userId, req) {
  
  let user = allUserData[userId];

  //Make sure it's defined
  if (typeof user === 'undefined') 
      return;

  let login = user.channelName;

  //Make sure it's defined
  if (typeof login === 'undefined') 
      return;

  let userdata = user.userdata[0];

  //Make sure it's defined
  if (typeof userdata === 'undefined') 
      return;

  //This is the userid in the database
  let userid = userdata.user_id;

  //Make sure it's defined
  if (typeof userid === 'undefined') 
      return;

  //Parameters passed from the front end  
  let craftNamePassed = req.params.craftName;
  let craftAmountPassed = req.params.craftAmount;

  //Craft object using the parameters passed
  let craftingParameters = crafts[craftNamePassed];

  //if the craft actually exists
  if (craftingParameters) {

    //Check if they can craft at least one
    if (checkIfSufficientResources(craftingParameters, userdata)) {

      //Default craft amount is 1 unless they pass max
      let craftAmount = 1;

      //If max was passed craft max
      if (craftAmountPassed == 'Max')
        craftAmount = checkIfUserCanCraftMultiple(craftingParameters, userdata);

      //Max is 0, don't craft. (We check this already but might as well again)
      if (craftAmount <= 0)
        return;

      //Update local resource and xp amount before we query
      updateUserLocalDataForMultipleCrafts(user, userdata, craftAmount, craftingParameters);

      //Update resources based on max amount. Craft items after this is a successful query. 
      updateCraftingResources(userid, user, craftAmount, craftingParameters, makeParameters(login, craftingParameters, craftAmount), makeSQLUpdateResourcesStatement (craftingParameters, userdata), function(err, result){
      });
    }
  }
}

//Updates resources and xp locally
function updateUserLocalDataForMultipleCrafts(user, userdata, maxCraftAmount, craftingParameters) {

  //Loop through and subtract from local user 
  for (let i = 0; i < craftingParameters.colNameSubtracted.length; i++) {

    let tempName = craftingParameters.colNameSubtracted[i];
    let tempAmount = craftingParameters.subtractedAmount[i] * maxCraftAmount;

    //Subtract resources
    userdata[tempName] = userdata[tempName] - tempAmount;
  }

  //Add xp
  userdata[craftingParameters.xpColName] += craftingParameters.xpAdded * maxCraftAmount;

  //If it doesn't add anything return
  if (!craftingParameters.colNameAdded) 
    return;

  //Otherwise, loop through and add to local user 
  for (let i = 0; i < craftingParameters.colNameAdded.length; i++) {

    let tempName = craftingParameters.colNameAdded[i];
    let tempAmount = craftingParameters.addedAmount[i] * maxCraftAmount;

    //Add resources
    userdata[tempName] = userdata[tempName] + tempAmount;
  }
}

//Crafts the equipmentment the specified number of times
function craftEquipmentNumTimes(userid, user, craftingParameters, maxCraftAmount) {

  for (let i = 0; i < maxCraftAmount; i++) {

      craftEquipment(userid, user, craftingParameters, function(err, result){
      });
  }
}

//We will need to check if the craft takes more than one type of resource
function checkIfSufficientResources(craftingParameters, userdata) {

  for (let i = 0; i < craftingParameters.colNameSubtracted.length; i++) {
    if (userdata[craftingParameters.colNameSubtracted[i]] < craftingParameters.subtractedAmount[i]) {
      return false;
    }
  }

  return true;
}

//This allows us to add and subtract multiple resources along with crafting experience
function makeSQLUpdateResourcesStatement(craftingParameters, userdata) {

  let sqlFinal =  'UPDATE TwitchHeroes.users SET ';
  let sqlEnd =    'WHERE login = ?;'; 

  //Add crafting experience to this query
  sqlFinal = sqlFinal + craftingParameters.xpColName + ' = ' + craftingParameters.xpColName + ' + ?' + ', ';

  //Add added to sql statement, we need to check if exists because some recipes may not add resources
  if (craftingParameters.colNameAdded) {
    for (let i = 0; i < craftingParameters.colNameAdded.length; i++) {
      sqlFinal = sqlFinal + craftingParameters.colNameAdded[i] + ' = ' + craftingParameters.colNameAdded[i] + ' + ?, ';
    }
  }
  
  //Add subtracted to sql statement
  for (let i = 0; i < craftingParameters.colNameSubtracted.length; i++) {
    sqlFinal = sqlFinal + craftingParameters.colNameSubtracted[i] + ' = ' + craftingParameters.colNameSubtracted[i] + ' - ? ';

    //if it's not the last one add a comma
    if (i != craftingParameters.colNameSubtracted.length - 1) 
      sqlFinal = sqlFinal + ',';
  }

  sqlFinal = sqlFinal + sqlEnd;

  return sqlFinal;
}

function makeParameters(login, craftingParameters, maxCraftAmount) {
  
  let parameters = [];

  //Push xp parameter
  parameters.push(craftingParameters.xpAdded * maxCraftAmount);

  //Add add params, we need to check if exists because some recipes may not add resources 
  if (craftingParameters.colNameAdded) {
    for (let i = 0; i < craftingParameters.colNameAdded.length; i++)
      parameters.push(craftingParameters.addedAmount[i] * maxCraftAmount);
  }

  //Add subtracted params
  for (let i = 0; i < craftingParameters.colNameSubtracted.length; i++) 
    parameters.push(craftingParameters.subtractedAmount[i] * maxCraftAmount);

  parameters.push(login);

  return parameters;
}

function updateCraftingResources(userid, user, maxCraftAmount, equipmentCraftingParameters, craftingParameters, sql, callback) {

  let query = connection.query(sql, craftingParameters, function(error, result) {

      if (error) 
        console.log('error in query updating crafting resources');

      else {

        //No error, craft equipment if possible.
        if (equipmentCraftingParameters.craftType == 'equipment') 
            craftEquipmentNumTimes(userid, user, equipmentCraftingParameters, maxCraftAmount);
      }
      return callback('true');
  });
}


function makeItemParameters(userid, craftingParameters) {
  
  let item_name = craftingParameters.item_name;  
  let item_type = craftingParameters.item_type;
  let item_level = 1;
  let item_damage = 0;
  let item_armor = craftingParameters.armor;

  //If the type is a tool
  if (item_type == 'tool') {

    //Tool type is used instead of item_type in the paramters
    item_type = craftingParameters.tool_type;
  }

  if (item_type == 'weapon') 
      item_damage = 5;

  let sqlParameters = [item_name, item_type, item_level, item_armor, item_damage];

  return sqlParameters;
}


function statRoll(item_level, item_name, bonusStat) {

  //Total of stats to return
  let stats = {strength: 0, dexterity: 0, intelligence: 0, constitution: 0, wisdom: 0};

  //Stat names
  let statOneName = rollRandomStatName();
  let statTwoName = rollRandomStatName();

  //Roll stat two name until it's not the same
  while (statOneName == statTwoName) 
    statTwoName = rollRandomStatName();

  //Add stats
  stats[statOneName] = randomStatValue(item_level);
  stats[statTwoName] = randomStatValue(item_level);

  //Adds bonus stat 
  stats[bonusStat] += item_level * 3;

  return stats;
}

function randomStatValue(item_level) {
  return Math.floor(Math.random() * item_level * 2 + 1);
}

//Rolls a random possible stat
function rollRandomStatName() {
  return possibleStatNames[Math.floor(Math.random()*possibleStatNames.length)];
}

function craftEquipment(userid, user, craftingParameters, callback) {

  let createNewItemParameters = makeItemParameters(userid, craftingParameters);

  let createNewItemQuery = connection.query(sqlInsertNewItem, createNewItemParameters, function(error, result) {

      if (error) 
          console.log('error in query crafting equipment');
          
      else 
      {
        let insertItemIntoInventoryQuery = connection.query(sqlInsertItemIntoInventory, [userid, result.insertId], function(error, result) {
        
        if (error) 
          console.log('error in inserting crafting item into inventory');
        
        });
      }

      return callback('true');
  });

}


//Max amount that the user can craft
function checkIfUserCanCraftMultiple(craftingParameters, userdata) {

  //Array of all subtract names
  let tempColNameSubtractedArray = craftingParameters.colNameSubtracted;

  //Array of all subtract amounts
  let tempAmountSubtractedArray = craftingParameters.subtractedAmount;

  //The lowest out of all materials. Set to nothing so we can initialize in the first loop.
  let lowestCraftAmountPossible;

  //Loop through subtract array and return minimum
  for (let i = 0; i < tempColNameSubtractedArray.length; i++) {

    let colNameSubtracted = tempColNameSubtractedArray[i];
    let amountForCraftRequired = tempAmountSubtractedArray[i];

    //User resource amount of current index
    let tempUserResourceAmount = userdata[colNameSubtracted];

    //Divide current amount by craft required and floor it
    let tempMaxPossibleForCraft = Math.floor(tempUserResourceAmount / amountForCraftRequired); 

    //If lowest hasn't been set yet, set it and continue to next
    if (!lowestCraftAmountPossible) {
      lowestCraftAmountPossible = tempMaxPossibleForCraft;
      continue;
    }

    //If it's lower than the lowest, set it to the lowest
    if (tempMaxPossibleForCraft < lowestCraftAmountPossible)
      lowestCraftAmountPossible = tempMaxPossibleForCraft;
  }

  return lowestCraftAmountPossible;
}






/*
function qualityRoll() {

  let qualityRoll = parseInt(Math.floor(Math.random() * 100 + 1));  

  if (qualityRoll <= 50) 
    return 1;

  if (qualityRoll <= 80) 
    return 2;

  if (qualityRoll <= 99) 
    return 3;

  if (qualityRoll <= 100) 
    return 4;
}
*/