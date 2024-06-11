/*
	This file is used to loop through userdata periodically and check if it has expired or not. This saves us memory that is being used by afk or users who have left.
*/

//Time in minutes to check all userdata
const intervalMinutes = 5;

//Final time in ms calculated when to check all userdata 
const intervalTimer = (1000 * 60 * intervalMinutes);

setInterval(function(){ checkIfUserDataExpired();},intervalTimer);

function checkIfUserDataExpired() {

	var currentDateTime = Date.now();

	for (const key in allUserData) {

		//If they have an afk timer
		if (allUserData[key].afkTimer !== 'undefined') {

			//If the afk timer is less than current date
			if (allUserData[key].afkTimer < currentDateTime) {

				//Delete the userdata
				delete allUserData[key];
			}
		}
	}
}