//Defines dungeons so users can vote on them
global.dungeonVoteData = 
[ 

	{name: 'Centaur Village', tier: 1, votes: 0, description: '', drops: ['centaurhoof', 'hide'] },
	{name: 'Abandoned Cemetary', tier: 1, votes: 0, description: '', drops: ['bone', 'batwing', 'goldore'] },
	{name: 'Eerie Forest', tier: 1, votes: 0, description: '', drops: ['slime', 'eyeball', 'oak'] },
	
];

//Date for when voting ends
global.dungeonEndDate = new Date(new Date().toUTCString().substr(0, 25));

//Contains userId of users who have voted
var votedUsers = [];

//Initializations
getTimeLeft();
sendVotesToTextFile();

//Intervals
setInterval(function(){ getTimeLeft();},2000)
setInterval(function(){ sendVotesToTextFile();},2000)

//Gets the vote time left
function getTimeLeft() {

	//Read the time for when the dungeon ends
	fs.readFile('votetimeleft.txt', 'utf8', function(err, data) {
    if (err) throw err;
      dungeonEndDate = Date.parse(data);
  	});

	//Current utc time
  var currentUTCTime = new Date(new Date().toUTCString().substr(0, 25));

  //If the vote ended, reset the votes
  if (currentUTCTime > dungeonEndDate) 
  	resetDungeonVotes();
}

// This function handles voting by a user 
exports.userVote = function(userId, req) {
  
  //Current utc time
  let currentUTCTime = new Date(new Date().toUTCString().substr(0, 25));

  //If the vote is still going, let the user vote
	if (currentUTCTime < dungeonEndDate) {
		
		let userVote = req.params.vote;
		
		//If the user hasn't voted, add their vote
		if (!checkIfUserVoted(userId)) {
			addVote(userVote, userId);
		}
	}
}

//If the votedUser array contains their id, they have voted
function checkIfUserVoted(userId) {
	if (votedUsers.includes(userId)) 
		return true;

	return false;
}

function addVote(userVote, userId) {

	//Add channel id of user to voted users
	votedUsers.push(userId);

	//Add the user vote
	for (let i = 0; i < dungeonVoteData.length; i++) {
		if (dungeonVoteData[i].name == userVote) 
			dungeonVoteData[i].votes++;
	}
}

//Clear user votes and set all dungeon votes to 0
function resetDungeonVotes() {

	votedUsers = [];

	for (let i = 0; i < dungeonVoteData.length; i++) 
		dungeonVoteData[i].votes = 0;

	sendVotesToTextFile();
}

function sendVotesToTextFile() {

	let voteData = "";
	
	for (let i = 0; i < dungeonVoteData.length; i++) 
		voteData = voteData + dungeonVoteData[i].name + '|' + dungeonVoteData[i].votes + ',';

	fs.writeFile('dungeonvotes.txt', voteData, { flag: 'w+' }, err => {})
}