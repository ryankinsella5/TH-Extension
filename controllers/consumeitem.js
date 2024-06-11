const consumables = 
{
    Cheese: {colNameSubtracted: 'cheese', consumableRowName: 'foodname', consumableEndDateRow: 'foodduration', consumableDuration: 15},
    MiningPotion: {colNameSubtracted: 'miningpotion', consumableRowName: 'potionname', consumableEndDateRow: 'potionendtime', consumableDuration: 15},
    HarvestingPotion: {colNameSubtracted: 'harvestingpotion', consumableRowName: 'potionname', consumableEndDateRow: 'potionendtime', consumableDuration: 15},
    WoodcuttingPotion: {colNameSubtracted: 'woodcuttingpotion', consumableRowName: 'potionname', consumableEndDateRow: 'potionendtime', consumableDuration: 15},
};

// This function handles item consumption by the user
exports.consumeItem = function(userId, req){

    //User variables
    let user = allUserData[userId];
    let userdata = user.userdata[0];
    let login = user.channelName;

    //Consumable name passed from frontend
    let consumableNamePassed = req.params.itemName; 

    //Quantity to use passed
    let consumableItemQuantityPassed = req.params.itemQuantity;

    //Check if it's a real item
    if (consumables.hasOwnProperty(consumableNamePassed)) {

        let tempConsumableObject = consumables[consumableNamePassed];
        let consumableName = tempConsumableObject['colNameSubtracted'];

        //Check if user actually one of the item
        if (CheckIfUserHasConsumable(userdata, consumableName)) {

            let consumableAmount = 1;
            
            //If all was passed use all
            if (consumableItemQuantityPassed == 'All')
                consumableAmount = userdata[consumableName];

            //Update json with the amount being used
            userdata[consumableName] -= consumableAmount;

            let consumableBuffNameField = tempConsumableObject['consumableRowName'];
            let consumableBuffNDurationField = tempConsumableObject['consumableEndDateRow'];
            let consumableDuration = tempConsumableObject['consumableDuration'];

            //Adds minutes depending on skill level
            let additionalMinutesAdded = 0;

            //Update userdata to reflect results
            if (consumableBuffNameField == 'foodname') {
                additionalMinutesAdded = levelCalculator(userdata.cooking);
                userdata.foodname = consumableName;
            }

            if (consumableBuffNameField == 'potionname') {
                additionalMinutesAdded = levelCalculator(userdata.alchemy);
                userdata.potionname = consumableName;
            }

            let sql = makeSQLStatement(userdata, login, consumableName, consumableAmount, consumableBuffNameField, consumableBuffNDurationField, consumableDuration, additionalMinutesAdded);

            executeQuery(sql, function(err, result){
            });
        }
    }

}

function CheckIfUserHasConsumable(userdata, consumableName, consumableBuffNameField, consumableBuffNDurationField) {

	let userAmount = userdata[consumableName];

	if (userAmount > 0) {

        //Update consumable name
        userdata[consumableBuffNameField] = consumableName;

        return true;
	}

	else {
		return false;
	}
}

function makeSQLStatement(userdata, login, consumableName, consumableAmount, consumableBuffNameField, consumableBuffNDurationField, consumableDuration, additionalMinutesAdded) {

    let sqlStart =  'UPDATE TwitchHeroes.users SET ';
    let sqlEnd =    'WHERE login = "' + login + '";'; 

    //Subtract consumable
    let consumableSubtractedSQL = consumableName + ' = ' + consumableName + ' - ' + consumableAmount + ', ';

    //Buff name
    let consumableBuffName = consumableBuffNameField + ' = "' + consumableName + '", ';

    //Buff duration
    let dateTimeAddedMinutes = Date.now() + (consumableDuration + additionalMinutesAdded) * 60 * 1000;
    let consumableBuffDuration = consumableBuffNDurationField + ' = "' + dateTimeAddedMinutes + '" ';

    //Update amount of time for the consumable
    userdata[consumableBuffNDurationField] = dateTimeAddedMinutes;

    //Final sql
    let sqlFinal = sqlStart + consumableSubtractedSQL + consumableBuffName + consumableBuffDuration + sqlEnd;

    return sqlFinal;
}

function executeQuery(sql, callback) {

    let query = connection.query(sql, function(error, result) {

    if (error) {
        console.log('error in query: ' + query.sql);
        callback(null, 'true');
    } 

    else {
        callback(null, 'true');
    }
  });
}

//Calculates player level 
function levelCalculator(exp) {

    let level = Math.floor(Math.sqrt(exp)) + 1;
    return level;
}