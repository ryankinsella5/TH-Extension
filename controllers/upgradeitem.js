//Update item quality
const updateItemQualitySQLStatement = 'UPDATE TwitchHeroes.items SET item_quality = item_quality + ? WHERE item_id = ?;';

//Remove all stats from item
const removeAllItemStatsSQLStatement =	'UPDATE TwitchHeroes.items ' +
																				'SET ' +
																				'suffix0_name = "", suffix0_value = 0, ' +
																				'suffix1_name = "", suffix1_value = 0, ' +
																				'suffix2_name = "", suffix2_value = 0, ' +
																				'prefix0_name = "", prefix0_value = 0, ' +
																				'prefix1_name = "", prefix1_value = 0, ' +
																				'prefix2_name = "", prefix2_value = 0 ' +
																				'WHERE item_id = ?;'

//Gems used for upgrading items
const upgradeGems = ['qualitygem', 'scouringgem', 'alterationgem', 'transmutationgem', 'augmentgem', 'regalgem', 'exaltgem', 'chaosgem'];

//Max item quality
const maxItemQuality = 20;

//Max number of suffixes and prefixes
const numSuffixes = 3;
const numPrefixes = 3;

//Suffixes and their rolls based on item level. Allows us to adjust and add new stats easily.
const suffixes = 
{
  strength: {affixName: 'Strength', itemLevelMultiplier: .2},
  intelligence: {affixName: 'Intelligence', itemLevelMultiplier: .2},
  dexterity: {affixName: 'Dexterity', itemLevelMultiplier: .2},
  constitution: {affixName: 'Constitution', itemLevelMultiplier: .2},
  wisdom: {affixName: 'Wisdom', itemLevelMultiplier: .2},
};

//Keys for all suffixes for randomizing stats
const suffixKeys = Object.keys(suffixes);

//Prefixes and their rolls based on item level
const prefixes = 
{
  attackspeed: {affixName: 'Attack Speed', itemLevelMultiplier: .1},
  //movementspeed: {affixName: 'Movement Speed', itemLevelMultiplier: .1},
  firedamage: {affixName: 'Fire Damage', itemLevelMultiplier: .1},
  icedamage: {affixName: 'Ice Damage', itemLevelMultiplier: .1},
  lightningdamage: {affixName: 'Lightning Damage', itemLevelMultiplier: .1},
};

//Keys for all suffixes for randomizing stats
const prefixKeys = Object.keys(prefixes);

exports.upgradeItem = function(userId, req) {
  	
  //User info
  let user = allUserData[userId];
	let login = user.channelName;
	let userdata = user.userdata[0];
	let useritems = user.items;
	let user_id = userdata.user_id;

	//Passed information from request
	let item_id = req.params.item_id;
	let gem_name = req.params.gem_name;

	//Make sure gem exists
	if (!upgradeGems.includes(gem_name))
		return;

	//Make sure item exists
	let item = checkIfItemExists(item_id, useritems);

	//Undefined item
	if (!item)
		return;

	//Check if user has enough of the gem
	if (userdata[gem_name] <= 0)
		return;
		
	//Update gem count
 	//updateGemCount(userdata, user_id, gem_name, 1, function(err, result){
  //});

	let totalAffixCount = getSuffixCount(item) + getPrefixCount(item);
  		
  //Then execute the gem statement
	switch(gem_name) {

  	case 'qualitygem':

  		if (item.item_quality < maxItemQuality) {
  	  	item.item_quality += 5;
  	  	defaultQuery(updateItemQualitySQLStatement, [5, item_id], function(err, result){
  			});
  		}
  	  break;

  	case 'scouringgem':

  		//No affixes
  		if (totalAffixCount == 0)
  			return;

  		resetItemJSON(item);
  	  defaultQuery(removeAllItemStatsSQLStatement, [item_id], function(err, result){
  		});
  	  break;

  	case 'transmutationgem':

  		//item already has one affix
  		if (totalAffixCount > 0)
  			return;

  		transmuteItem(item, item_id);
  	  break;

  	case 'alterationgem':

  		//Can't use on normal or rare items
  		if (totalAffixCount == 0 || totalAffixCount > 2)
  			return;

  		alterationItem(item, item_id);
  	 	break;

 		//Adds a stat to a magic item
  	case 'augmentgem':

  		//Only works on items with 1 affix
  		if (totalAffixCount != 1) 
  			return;
  		
  		augmentItem(item, item_id);
  	 	break;

  	//Adds a stat to a magic item with 2 stats
  	case 'regalgem':

  		//Only works on items with 2 affixes
  		if (totalAffixCount != 2) 
  			return;
  		
  		regalItem(item, item_id);
  	 	break;
	}

}

//Transmute a normal item
function transmuteItem(item, item_id) {

	var affixName = getRandomAffix(item);

	if (affixName == 'suffix') {

		let affixObject = getRandomSuffixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
  	let sqlStatement = makeSuffixUpdateSQLStatement(affixObject.affixName, 1, affixValue);
	
  	//Update JSON
  	updateItemSuffixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}

	if (affixName == 'prefix') {

		let affixObject = getRandomPrefixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
  	let sqlStatement = makePrefixUpdateSQLStatement(affixObject.affixName, 1, affixValue);
	
  	//Update JSON
  	updateItemPrefixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}
	
}

//Alteration an magic item
function alterationItem(item, item_id) {

	var suffixOrPrefix = getRandomAffix(item);

	if (suffixOrPrefix == 'suffix') {

		let affixObject = getRandomSuffixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
		let sqlStatement = makeSuffixPrefixUpdateSQLStatement([affixObject.affixName, '', ''], [affixValue, 0, 0], ['', '', ''], [0, 0, 0]);

  	//Update JSON
  	resetItemJSON(item);
  	updateItemSuffixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}

	if (suffixOrPrefix == 'prefix') {

		let affixObject = getRandomPrefixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
  	let sqlStatement = makeSuffixPrefixUpdateSQLStatement(['', '', ''], [0, 0, 0], [affixObject.affixName, '', ''], [affixValue, 0, 0]);

  	//Update JSON
  	resetItemJSON(item);
  	updateItemPrefixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}
	
}

//Augment an magic item
function augmentItem(item, item_id) {

	var suffixOrPrefix = getRandomAffix(item);

	if (suffixOrPrefix == 'suffix') {

		let affixObject = getRandomSuffixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
		
  	//This is the index of where an affix doesn't exist, we will add it here
		let affixIndex = getAvailableIndexForSuffix(item);
		
		//Make arrays out of the existing item
		let itemArrays = makeArrayForAnExistingItem(item);

		//Update affix name
		itemArrays[0][affixIndex] = affixObject.affixName;

		//Update affix value
		itemArrays[1][affixIndex] = affixValue;

		//Pass the updated arrays
		let sqlStatement = makeSuffixPrefixUpdateSQLStatement(itemArrays[0], itemArrays[1], itemArrays[2], itemArrays[3]);

  	//Update JSON
  	//resetItemJSON(item);
  	//updateItemSuffixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}

	if (suffixOrPrefix == 'prefix') {

		let affixObject = getRandomPrefixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
  	
  	//This is the index of where an affix doesn't exist, we will add it here
  	let affixIndex = getAvailableIndexForPrefix(item);

  	//Make arrays out of the existing item
  	let itemArrays = makeArrayForAnExistingItem(item);

  	//Update affix name
		itemArrays[2][affixIndex] = affixObject.affixName;

		//Update affix value
		itemArrays[3][affixIndex] = affixValue;

		let sqlStatement = makeSuffixPrefixUpdateSQLStatement(itemArrays[0], itemArrays[1], itemArrays[2], itemArrays[3]);

  	//Update JSON
  	//resetItemJSON(item);
  	//updateItemPrefixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}
	
}

//Regal a magic item
function regalItem(item, item_id) {

	var suffixOrPrefix = getRandomAffix(item);

	if (suffixOrPrefix == 'suffix') {

		let affixObject = getRandomSuffixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
		
  	//This is the index of where an affix doesn't exist, we will add it here
		let affixIndex = getAvailableIndexForSuffix(item);
		
		//Make arrays out of the existing item
		let itemArrays = makeArrayForAnExistingItem(item);

		//Update affix name
		itemArrays[0][affixIndex] = affixObject.affixName;

		//Update affix value
		itemArrays[1][affixIndex] = affixValue;

		//Pass the updated arrays
		let sqlStatement = makeSuffixPrefixUpdateSQLStatement(itemArrays[0], itemArrays[1], itemArrays[2], itemArrays[3]);

  	//Update JSON
  	//resetItemJSON(item);
  	//updateItemSuffixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}

	if (suffixOrPrefix == 'prefix') {

		let affixObject = getRandomPrefixObjectNotOnItem(item);
  	let affixValue = getRandomValueForObjectPassed(item, affixObject);
  	
  	//This is the index of where an affix doesn't exist, we will add it here
  	let affixIndex = getAvailableIndexForPrefix(item);

  	//Make arrays out of the existing item
  	let itemArrays = makeArrayForAnExistingItem(item);

  	//Update affix name
		itemArrays[2][affixIndex] = affixObject.affixName;

		//Update affix value
		itemArrays[3][affixIndex] = affixValue;

		let sqlStatement = makeSuffixPrefixUpdateSQLStatement(itemArrays[0], itemArrays[1], itemArrays[2], itemArrays[3]);

  	//Update JSON
  	//resetItemJSON(item);
  	//updateItemPrefixJSON(item, affixObject.affixName, affixValue, 1);

  	//Execute query
  	defaultQuery(sqlStatement, [item_id], function(err, result){
  	});
	}
	
}

//Returns the index of where a suffix can be added
function getAvailableIndexForSuffix(item) {

	for (let i = 0; i < numSuffixes; i++) {

		if (item['suffix' + i + '_name'] == '')
			return i;
	}

	return 'none available';
}

//Returns the index of where a prefix can be added
function getAvailableIndexForPrefix(item) {

	for (let i = 0; i < numPrefixes; i++) {

		if (item['prefix' + i + '_name'] == '')
			return i;
	}

	return 'none available';
}

//Pass an item and return arrays for updating it's sql. We can then modify these arrays with new values to pass to the backend.
function makeArrayForAnExistingItem(item) {

	let suffixNameArray = ['', '', ''];
	let suffixValueArray = [0, 0, 0];
	let prefixNameArray = ['', '', ''];
	let prefixValueArray = [0, 0, 0];

	//Add suffixes
	for (let i = 0; i < numSuffixes; i++) {

		let tempSuffixName = item['suffix' + i + '_name'];

		//If the affix exists, update the arrays
		if (tempSuffixName != '') {
			suffixNameArray[i] = tempSuffixName
			suffixValueArray[i] = item['suffix' + i + '_value'];
		}
		
	}

	//Add prefixes
	for (let i = 0; i < numPrefixes; i++) {

		let tempPrefixName = item['prefix' + i + '_name'];

		//If the affix exists, update the arrays
		if (tempPrefixName != '') {
			prefixNameArray[i] = tempPrefixName;
			prefixValueArray[i] = item['prefix' + i + '_value'];
		}
		
	}

	return [suffixNameArray, suffixValueArray, prefixNameArray, prefixValueArray];
}

//Returns number of suffixes on an item
function getSuffixCount(item) {

	let suffixCount = 0;

	for (let i = 0; i < numSuffixes; i++) {

		if (item['suffix' + i + '_name'] != '')
			suffixCount++;
	}

	return suffixCount;
}

//Returns number of prefixes on an item
function getPrefixCount(item) {

	let prefixCount = 0;

	for (let i = 0; i < numPrefixes; i++) {

		if (item['prefix' + i + '_name'] != '')
			prefixCount++;
	}

	return prefixCount;
}

//Returns whether the affix will be a suffix or a prefix. 
function getRandomAffix(item) {
	
	//Random integer 0 or 1
	let randomInt = Math.round(Math.random());

	//Suffix
	if (randomInt == 0) {

		let suffixCount = getSuffixCount(item);

		//Not max suffixes
		if (suffixCount < numSuffixes)
			return 'suffix';
	}

	//Prefix
	if (randomInt == 1) {

		let prefixCount = getPrefixCount(item);

		//Not max prefixes
		if (prefixCount < numPrefixes)
			return 'prefix';
	}

	return 'none';
	
}

//Gets a random suffix that's not on the item already
function getRandomSuffixObjectNotOnItem(item) {

	//Random suffix object
	let randomSuffixObject = getRandomSuffixObject();

	//Roll until we get a stat that's not on the item already
	while (item.suffix0_name == randomSuffixObject.affixName || item.suffix1_name == randomSuffixObject.affixName || item.suffix2_name == randomSuffixObject.affixName) 
		randomSuffixObject = getRandomSuffixObject();
	
	return randomSuffixObject;
}

//Gets a random prefix that's not on the item already
function getRandomPrefixObjectNotOnItem(item) {

	//Random prefix object
	let randomPrefixObject = getRandomPrefixObject();

	//Roll until we get a stat that's not on the item already
	while (item.prefix0_name == randomPrefixObject.affixName || item.prefix1_name == randomPrefixObject.affixName || item.prefix2_name == randomPrefixObject.affixName) 
		randomPrefixObject = getRandomPrefixObject();
	
	return randomPrefixObject;
}

//Returns random suffix object
function getRandomSuffixObject() {

	let randomKey = suffixKeys[Math.floor(Math.random() * suffixKeys.length)];

	return suffixes[randomKey];
}

//Returns random prefix object
function getRandomPrefixObject() {

	let randomKey = prefixKeys[Math.floor(Math.random() * prefixKeys.length)];

	return prefixes[randomKey];
}

//Gets random value based on multiplier and item level of item passed
function getRandomValueForObjectPassed(item, affixObject) {

	//Roll value for the affix
	return Math.floor(5 + Math.random() * item.item_level * affixObject.itemLevelMultiplier);
}

//Pass an item suffix to make a sql statement to modify it
function makeSuffixUpdateSQLStatement(affixName, affixNumber, affixValue) {
	return 'UPDATE TwitchHeroes.items SET suffix' + affixNumber + '_name = "' + affixName + '", suffix' + affixNumber + '_value = ' + affixValue + ' WHERE item_id = ?;';
}

function makePrefixUpdateSQLStatement(affixName, affixNumber, affixValue) {
	return 'UPDATE TwitchHeroes.items SET prefix' + affixNumber + '_name = "' + affixName + '", prefix' + affixNumber + '_value = ' + affixValue + ' WHERE item_id = ?;';
}

//Pass arrays to update multiple sql values
function makeSuffixPrefixUpdateSQLStatement(suffixNameArray, suffixValueArray, prefixNameArray, prefixValueArray) {
	
	let sqlStatement = 'UPDATE TwitchHeroes.items SET ';

	//Add suffixes
	for (let i = 0; i < numSuffixes; i++) 
		sqlStatement += 'suffix' + i + '_name = "' + suffixNameArray[i] + '", suffix' + i + '_value = ' + suffixValueArray[i] + ', ';

	//Add prefixes
	for (let i = 0; i < numPrefixes; i++) {
		sqlStatement += 'prefix' + i + '_name = "' + prefixNameArray[i] + '", prefix' + i + '_value = ' + prefixValueArray[i];

		//If not last add comma
		if (i != (numPrefixes - 1))
			sqlStatement += ', ';
	}

	//Add where statement
	sqlStatement += ' WHERE item_id = ?;';

	//console.log(sqlStatement);

	return sqlStatement;
}

//Updates item suffix value and name at index
function updateItemSuffixJSON(item, suffixName, suffixValue, index) {

	item['suffix' + index + '_name'] = suffixName;
	item['suffix' + index + '_value'] = suffixValue;
}

//Updates item prefix value and name at index
function updateItemPrefixJSON(item, prefixName, prefixValue, index) {

	item['prefix' + index + '_name'] = prefixName;
	item['prefix' + index + '_value'] = prefixValue;
}

//Resets all affixes on an item
function resetItemJSON(item) {

	//Reset suffixes
	for (let i = 0; i < numSuffixes; i++) {
		item['suffix' + i + '_name'] = "";
		item['suffix' + i + '_value'] = 0;
	}

	//Reset prefixes
	for (let i = 0; i < numPrefixes; i++) {
		item['prefix' + i + '_name'] = "";
		item['prefix' + i + '_value'] = 0;
	}
}

//Updates gem count in the database
function updateGemCount(userdata, user_id, gem_name, gem_quantity, callback) {

	//Update gem count in json
	userdata[gem_name] -= 1;

	let sqlStatement = makeGemCountReduceSQLStatement(gem_name);

  let query = connection.query(sqlStatement, [gem_quantity, user_id], function(error, result) {

      if (error) {
        console.log('error in query: updateGemCount');
        callback(null, 'true'); 
      } 

      else {
      	callback(null, 'true');
      }
  });
}

//Pass a gem name, will return a query to reduce the count of that gem
function makeGemCountReduceSQLStatement(gem_name) {
	return 'UPDATE TwitchHeroes.users SET ' + gem_name + ' = ' + gem_name + ' - ? WHERE user_id = ?;';
}

//Pass a query and parameters here to execute
function defaultQuery(queryPassed, parameters, callback) {

  let query = connection.query(queryPassed, parameters, function(error, result) {

      if (error) {
        console.log('error in query: ' + queryPassed);
        callback(null, 'true'); 
      } 

      else {
      	callback(null, 'true');
      }
  });
}

//Check if item exists and return it
function checkIfItemExists(item_id, useritems) {

  for (let i = 0; i < useritems.length; i++) {

  	//Exists for id passed
    if (useritems[i].item_id == item_id)
    	return useritems[i];
  }

  return undefined;
}