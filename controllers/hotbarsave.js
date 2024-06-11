var numHotBarSlots = 9;
var saveHotbarQuery;

//Initializations
createPreparedSQL();

// This function handles hotbar saving by a user 
exports.hotbarSave = function(userId, req) {
  	
  //User info
  let user = allUserData[userId];
	let login = user.channelName;
	let userdata = user.userdata[0];

	//Hotbar
	let passedHotbar = req.params.hotbar;
	let userHotbar = passedHotbar.split(',');

	let correctSpellCount = 0;

	//verify the length is appropriate 
	if (userHotbar.length == numHotBarSlots) {

		//loothrough hotbar and count the number of correct spells in the hotbar array
		for (let i = 0; i < numHotBarSlots; i++) {

			let tempSpell = userHotbar[i];

			//if it's a real spell or the name is none, increment count
			if (spellList.hasOwnProperty(tempSpell) || tempSpell == 'none') {
				correctSpellCount++;
  		}
		}
	}

	//if every hotbar element is accurate, we can then save the hotbar
	if (correctSpellCount == numHotBarSlots) {

		//Push the login to complete the prepared sql parameters
		userHotbar.push(login);

		//add new hotbar to userdata
    addNewHotbarToUserData(userdata, userHotbar);

		//run query
		runSaveHotbarQuery(userHotbar, function(err, result){
    });

	}
	
}

//Only needs to be called once on backend start
function createPreparedSQL() {

	saveHotbarQuery = 'UPDATE TwitchHeroes.users SET ';
	var sqlEnd = ' WHERE login = ?;';

	for (var i = 0; i < numHotBarSlots; i++) {

		let tempMiddleStatement = 'hotbar' + (i + 1) + ' = ?'
		saveHotbarQuery += tempMiddleStatement;

		///if not the last element, add a comma
		if (i != numHotBarSlots -1) {
			saveHotbarQuery += ', '
		}
	}
	saveHotbarQuery += sqlEnd;
}

function runSaveHotbarQuery(userHotbar, callback) {

	var query = connection.query(saveHotbarQuery, userHotbar, function(error, result) {
      if (error) {
        console.log('error in query: ' + saveHotbarQuery.sql);
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  	});
}

function addNewHotbarToUserData(userdata, userHotbar) {

	for (var i = 0; i < numHotBarSlots; i++) {
		let tempHotbarSlotName = 'hotbar' + (i+1);
		userdata[tempHotbarSlotName] = userHotbar[i];
		
	}
}