global.allUserData = {};

const sqlCheckIfUserExists = "SELECT Count(*) as 'count' FROM twitchheroes.users where login = ?;";

const sqlCreateUserAccount = "INSERT INTO TwitchHeroes.users(login, display_name) VALUES(?, ?);";

const sqlGetUserData =    'SELECT * FROM twitchheroes.users WHERE login = ?';

const sqlGetUserItems =   'SELECT qq.* from ' +
                          '(SELECT ii.user_id "User_Id", "Inventory", i.item_name, i.item_quality, i.item_id, i.item_type, i.item_level, i.item_armor, i.item_damage, suffix0_name, suffix0_value, i.suffix1_name, suffix1_value, suffix2_name, suffix2_value, prefix0_name, prefix0_value, i.prefix1_name, prefix1_value, prefix2_name, prefix2_value ' +
                          'FROM TwitchHeroes.items i ' +
                          'JOIN TwitchHeroes.inventoryItems ii ON ii.item_id = i.item_id ' +
                          'UNION  ' +
                          'SELECT ei.user_id "User_Id", "Equipped", i.item_name, i.item_quality, i.item_id, i.item_type, i.item_level, i.item_armor, i.item_damage, suffix0_name, suffix0_value, i.suffix1_name, suffix1_value, suffix2_name, suffix2_value, prefix0_name, prefix0_value, i.prefix1_name, prefix1_value, prefix2_name, prefix2_value ' +
                          'FROM TwitchHeroes.items i ' +
                          'JOIN TwitchHeroes.equippedItems ei ON ei.item_id = i.item_id ' +
                          'UNION ' +
                          'SELECT ei.user_id "User_Id", "Bank", i.item_name, i.item_quality, i.item_id, i.item_type, i.item_level, i.item_armor, i.item_damage, suffix0_name, suffix0_value, i.suffix1_name, suffix1_value, suffix2_name, suffix2_value, prefix0_name, prefix0_value, i.prefix1_name, prefix1_value, prefix2_name, prefix2_value ' +
                          'FROM TwitchHeroes.items i ' +
                          'JOIN TwitchHeroes.equippedItems ei ON ei.item_id = i.item_id ' +
                          ') qq   ' +
                          'LEFT JOIN TwitchHeroes.users u ON qq.User_Id = u.user_id WHERE u.login = "twitch_heroes" ' +
                          'ORDER BY item_quality, item_level desc';

//Insert tools to database
const craftToolSQLStatement = 'INSERT INTO TwitchHeroes.items(item_name, item_type, gatherspeed) VALUES(?, ?, 5)';

//Inserting tool into player's inventory
const insertToolIntoInventory = 'INSERT into TwitchHeroes.inventoryItems values (?, ?);'

//Only called on start
clearNewHeroesFile();

exports.getUserInfo = function(twitchUserID) {

  //if the user doesn't exist in the user json, request their channel name
  if (!allUserData[twitchUserID]) {
    requestTwitchUsername(twitchUserID, function(result){
    });
  }

  //if the user exists in the user json, query for their data
  if (allUserData[twitchUserID]) {

      let login = allUserData[twitchUserID].channelName;
      updateEquippedSession(login, twitchUserID, function(result){
      });
  }
}

function requestTwitchUsername(twitchUserID, callback) {

  request({
    url: 'https://api.twitch.tv/helix/users?id=' + twitchUserID, 
    headers: {
                'Authorization': 'Bearer ' + appAccessToken,
                'Client-Id': '04lcd6n5s6hgh7ljlqaw59o7cvvpl7',
              },
    json: true
    }, function(error, response, body) {

      if (typeof body['data'] !== 'undefined') {

        let channelName = body['data'][0]['login'];
        let userData = {channelName: channelName, userdata: [], items: []};
        allUserData[twitchUserID] = userData;

        console.log(channelName + ' has joined');

        //check if they have an account in the database
        checkIfAccountExists(channelName, twitchUserID, function(result){
        });

        //Add them to the join list
        addHeroToJoinList(channelName, callback)
      }

      else {
        console.log('app token needs to be refreshed');
      }
      
      return callback('true');
    });
}

//Lets us bypass irc
function addHeroToJoinList(channelName, callback) {

  console.log('Adding ' + channelName + ' to the join list')
  let heroName = channelName + ' ';

  fs.writeFile('newheroes.txt', heroName, { flag: 'a+' }, err => {})

  return callback('true');
}

function checkIfAccountExists(channelName, twitchUserID, callback) {

  console.log('Checking if account exists for ' + channelName);

  //Query if account exists
  connection.query(sqlCheckIfUserExists, channelName, function(error, rows, fields) {
      if (error) {
          console.log('error in query: ' + sqlCheckIfUserExists.sql);
        
      } else {

          var userCount = rows[0]['count'];
          
          //Account doesn't exist in db
          if (userCount == 0) {
            createUserAccount(channelName, function(err, result){
            });
          }

          //Account exists
          else {
            updateEquippedSession(channelName, twitchUserID, function(result){
            });
          }

          return callback('true');
      }
  });
}

function createUserAccount(channelName, callback) {
  
  console.log('Creating user account for ' + channelName);

  connection.query(sqlCreateUserAccount, [channelName, channelName], function(error, result) {

      if (error) {
          console.log('error in query: ' + sqlCreateUserAccount.sql);
        
      } else {
          console.log('Account created for ' + channelName);

          let databaseID = result.insertId;

          console.log('inserted id:' + databaseID);
      }

      return callback('true');
  });
}

function updateEquippedSession(channelName, twitchUserID, callback) {

  //Query for user info
  connection.query(sqlGetUserData, channelName, function(error, rows, fields) {
      if (error) {
        console.log('error in query updating userinfo');
        return callback('true');
        
      } else {

          if (allUserData[twitchUserID]) 
            allUserData[twitchUserID].userdata = rows;
      }

  });

  //Query for user items
  connection.query(sqlGetUserItems, channelName, function(error, rows, fields) {
      if (error) {
          console.log('error in query get user items');
        
      } else {

          if (allUserData[twitchUserID]) 
            allUserData[twitchUserID].items = rows; 
      }

      return callback('true');
  });

}

function clearNewHeroesFile() {
  fs.writeFile('newheroes.txt', '', { flag: 'w+' }, err => {})
}