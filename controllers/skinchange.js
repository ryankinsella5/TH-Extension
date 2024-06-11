//Update player skin query
const updateSkinSQL = 'UPDATE TwitchHeroes.users SET skin_id = ? WHERE login = ?;';

//Number of possible skins
const numSkins = 10;

// This function handles skin changing
exports.skinChange = function(userId, req){

  let user = allUserData[userId];
  let userdata = user.userdata[0];
  let login = user.channelName;
  let skin_id = req.params.skin_id;
  let userid = userdata.user_id;

  if (skin_id > 0 && skin_id <= numSkins) {

    //Update json
    userdata.skin_id = skin_id;

  	updateUserSkin([skin_id, login], function(err, result){
    });
  }
}

function updateUserSkin(parameters, callback) {

  let query = connection.query(updateSkinSQL, parameters, function(error, result) {
      if (error) {
        console.log('error in query: ' + query.updateSkinSQL);
        callback(null, 'true');
        
      } else {
        callback(null, 'true');
      }
  });
}