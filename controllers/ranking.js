global.rankingdata = {

	exp: {},
	mining: {},
	woodcutting: {},
	leatherworking: {},
	tailoring: {},
	blacksmithing: {},
	woodworking: {},
};

var rankDataKeys = ['exp', 'alchemy', 'blacksmithing', 'cooking', 'harvesting', 'jewelcrafting', 'leatherworking', 'mining', 'tailoring', 'woodcutting', 'woodworking'];
var rankIndex = 0;

//Gets the ranking
setInterval(function(){ queryRanking();},2500);

function queryRanking() {

	//console.log(rankingdata[0]);
	let tempKey = rankDataKeys[rankIndex];

	let rankingQuery = 'SELECT login, ' + tempKey + ' FROM twitchheroes.users ORDER BY ' + tempKey + ' desc;';

	connection.query(rankingQuery, function(error, rows, fields) {
	    if (error) {
	        console.log('Error in query ranking query');
	      
	    } else {
	        //only save top 10 players 
	        rankingdata[tempKey] = rows.splice(0, 10);

	        calculatePlayerlevels(tempKey);
	    }
	});

	if (rankIndex >= (rankDataKeys.length - 1)) {
		rankIndex = 0;
	 }

	else 
		rankIndex++;
}

//Calculate the player level and edit the rank array passed
function calculatePlayerlevels(tempKey) {

	for (let i = 0; i < rankingdata[tempKey].length; i++) {

		let tempExp = rankingdata[tempKey][i][tempKey];
		let playerLevel = levelCalculator(tempExp);
		rankingdata[tempKey][i][tempKey] = playerLevel;
	}
}


//Calculates player level 
function levelCalculator(exp) {

    let level = Math.floor(Math.sqrt(exp)) + 1;
    return level;
}