//List of legal hero actions and required stats to use them
global.spellList = 
{
    //Strength
    autoattack: {spellName: 'Auto Attack', tabID: 1, spellToolTipText: 'Slash the target causing damage equal to strength plus weapon damage', mana: 1, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/sword-black.png'},
    lightningstrike: {spellName: 'Lightning Strike', tabID: 1, spellToolTipText: 'Strike the target causing damage equal to strength plus 50% of intelligence plus weapon damage', mana: 5, strength: 40, intelligence: 30, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/lightningsword-black.png'},
    siphoningstrike: {spellName: 'Siphoning Strike', tabID: 1, spellToolTipText: 'Siphon mana from the target causing damage equal to strength plus weapon damage recovering 5% of damage dealt as mana', mana: 0, strength: 40, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 30, buffSpell: 'no', spellImage: 'images/spells/leech-black.png'},
    cleave: {spellName: 'Cleave', tabID: 1, spellToolTipText: 'Slash the target and two closest enemies within proximity causing damage equal to strength plus weapon damage', mana: 7, strength: 60, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 0, buffSpell: 'no', spellImage: 'images/spells/slash-black.png'},

    //Intelligence
    firebolt: {spellName: 'Fire Bolt', tabID: 2, spellToolTipText: 'Throws a bolt of fire dealing damage equal to intelligence plus weapon damage', mana: 1, strength: 0, intelligence: 15, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/fireball-black.png'},
    icebolt: {spellName: 'Ice Bolt', tabID: 2, spellToolTipText: 'Launches a bolt of ice dealing damage equal to intelligence and slowing the target by 25% plus weapon damage', mana: 3, strength: 0, intelligence: 25, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/icebolt-black.png'},
    rockthrow: {spellName: 'Rock Throw', tabID: 2, spellToolTipText: 'Throw a rock dealing damage equal to intelligence plus 50% of strength plus weapon damage', mana: 5, strength: 30, intelligence: 40, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/rock-black.png'},
    firerain: {spellName: 'Fire Rain', tabID: 2, spellToolTipText: 'Showers all enemies with fire dealing damage equal to 50% of intelligence plus weapon damage', mana: 10, strength: 0, intelligence: 50, dexterity: 0, constitution: 0, buffSpell: 'no', spellImage: 'images/spells/firerain-black.png'},

    //Wisdom
    heal: {spellName: 'Heal', tabID: 3, spellToolTipText: "Heals lowest target hero in clicked proximity for 25% of wisdom plus weapon damage", mana: 5, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 10, buffSpell: 'no', spellImage: 'images/spells/heal-black.png'},
    holystrike: {spellName: 'Holy Strike', tabID: 3, spellToolTipText: 'Pierce the target causing damage equal to wisdom plus 50% of constitution and heals for 5% of damage done', mana: 5, strength: 0, intelligence: 0, dexterity: 0, constitution: 20, wisdom: 30, buffSpell: 'no', spellImage: 'images/spells/holystrike-black.png'},
    massheal: {spellName: 'Mass Heal', tabID: 3, spellToolTipText: "Heals all target heroes in a range of 3 from clicked proximity for 25% of wisdom plus weapon damage", mana: 10, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 35, buffSpell: 'no', spellImage: 'images/spells/massheal-black.png'},

    //Buffs
    combatmaster: {spellName: 'Combat Master', tabID: 4, spellToolTipText: "Increases your dexterity by 10 for 15 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 40, constitution: 0, buffSpell: 'yes', spellImage: 'images/spells/ninja-black.png'},
    defend: {spellName: 'Defend', tabID: 4, spellToolTipText: "Increases the user's armor by 25% of constitution for 15 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 40, wisdom: 0, buffSpell: 'yes', spellImage: 'images/spells/shield-black.png'},
    minorwisdom: {spellName: 'Minor Wisdom', tabID: 4, spellToolTipText: "Increases the user's mana regeneration by 5 for 15 minutes", mana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, wisdom: 40, buffSpell: 'yes', spellImage: 'images/spells/bookaura-black.png'},
};

//Used to update the duration for buff spells
const buffSpells = 
{
    combatmaster: {buffRowName: 'combatmaster', buffDuration: 10, statDurationIncreaseIndex: 2},
    minorwisdom:  {buffRowName: 'minorwisdom', buffDuration: 10, statDurationIncreaseIndex: 4},
    defend:       {buffRowName: 'defend', buffDuration: 10, statDurationIncreaseIndex: 3},
};

//Resources that are usable as actions
const usableResources = ['copperore', 'copperingot', 'goldore', 'goldingot', 'wool', 'woolcloth', 'woodlog', 'woodplank', 'oaklog', 'oakplank', 'hide', 'milk', 'egg', 'slime', 'bone', 'eyeball', 'centaurhoof', 'batwing', 'essence'];

//Tools that are usable as actions
const usableTools = ['basicpickaxe', 'basicaxe', 'basichoe', 'basicshears', 'basicbucket', 'goldenpickaxe', 'goldenaxe', 'goldenhoe', 'goldenshears', 'goldenbucket'];

const usableToolsNames = ['Basic Pickaxe', 'Basic Axe', 'Basic Hoe', 'Basic Shears', 'Basic Bucket', 'Golden Pickaxe', 'Golden Axe', 'Golden Hoe', 'Golden Shears', 'Golden Bucket'];

//Used to check if they can use a spell
const statsUsedForSpellRequirements = ['strength', 'intelligence', 'dexterity', 'constitution', 'wisdom'];

//Skills that increase user stats needed to be added to the user total stats
const statsIncreasedBySkills = 
{
  strength: {skillName: 'blacksmithing', skillRatio: 2},
  intelligence: {skillName: 'tailoring', skillRatio: 2},  
  dexterity: {skillName: 'woodworking', skillRatio: 2}, 
  constitution: {skillName: 'cooking', skillRatio: 2}, 
  wisdom: {skillName: 'jewelcrafting', skillRatio: 2}, 
};

//Every x levels increases all stats by 1
const statLevelRatio = 5;

//Only called on start
clearHeroActionsFile();

// This function handles block clicking by the user
exports.blockAction = function(userId, req) {

  //User info
  let user = allUserData[userId];
  let login = user.channelName;

  //Action passed by user
  let action = req.params.action;
  let x = req.params.x;
  let y = req.params.y;
  let item_id = req.params.item_id;
  
  //if a legal spell
  if (spellList.hasOwnProperty(action)) {

    let tempTotalUserStats = getUserTotalStats(user);

    //Also check if the user can actually use the spell
    if (checkIfUserCanUseSpell(action, tempTotalUserStats)) {

      //If it's not a buff spell
      if (spellList[action].buffSpell == 'no') {
        //console.log('adding action: ' + action);
        addActions(login + "|" + x + "|" + y + "|" + action + ",");
        return;
      }

      //If it's a buff spell
      let userdata = user.userdata[0];

      //Build the query
      let buffRowName = buffSpells[action].buffRowName;

      //Buff duration based on level
      let buffDuration = buffSpells[action].buffDuration + levelCalculator(userdata.exp) / 5;

      let sqlBuffStatement = makeSQLBuffStatement(userdata, login, buffRowName, buffDuration);

      //Execute the query
      executeQuery(sqlBuffStatement, function(err, result){
      });
      
    }
  }

  //If it's a resource passed and is usable
  if (usableResources.includes(action)) {

    //console.log('adding action: ' + action);
    addActions(login + "|" + x + "|" + y + "|" + action + ",");
    return;
  }

  //If it's a tool passed and is usable
  if (usableTools.includes(action)) {

    let gatherspeed = getToolGatherSpeed(user, action);

    addActions(login + "|" + x + "|" + y + "|" + action + "|" + gatherspeed + ",");
    return;
  }
  
}

function getToolGatherSpeed(user, toolName) {

  let userItems = user.items;
  let toolNameCapitalized = getToolNameCapitalized(toolName);


  for (let i = 0; i < userItems.length; i++) {

    let tempItem = userItems[i];

    //If it's equipped
    if (tempItem.Inventory == 'Equipped') {

      //And the same name
      if (tempItem.item_name == toolNameCapitalized)
        return tempItem.gatherspeed;
    }
  }
    
  return 0;
}

function getToolNameCapitalized(toolName) {
  let toolIndex = usableTools.indexOf(toolName);
  return usableToolsNames[toolIndex];
}

//Sum of all user stats from equipped items
function getUserTotalStats(user) {

  var userdata = user.userdata[0];

  //Total of player's stats
  let totalStatsArray = [0, 0, 0, 0, 0];

  //Player items
  let playerItems = user.items;

  //Loop through player items
  for (const key in playerItems) {

    //Current item
    let tempItem = playerItems[key];

    //if the item is equipped add stats
    if (tempItem.Inventory == 'Equipped') {

      //Loop through each stat and add it
      for (let i = 0; i < statsUsedForSpellRequirements.length; i++) {

        let statName = statsUsedForSpellRequirements[i];
        totalStatsArray[i] += tempItem[statName];
      }
    }
  }

  let index = 0;

  //Loop through skills and add to total stats
  for (const key in statsIncreasedBySkills) {

    let tempObject = statsIncreasedBySkills[key];
    let skillName = tempObject.skillName;

    //if it doesn't exist go to next
    if (skillName == '') {
      index++;
      continue;
    }

    let skillRatio = tempObject.skillRatio;

    let skillExp = userdata[skillName];
    let skillLevel = levelCalculator(skillExp);
    totalStatsArray[index] += Math.floor(skillLevel / skillRatio);

    index++;
  }

  //Add stat points by on player's level
  let playerLevel = levelCalculator(userdata.exp);
  let playerLevelStatIncrease = Math.floor(playerLevel / statLevelRatio);

  //Add stats from player level
  for (let i = 0; i < totalStatsArray.length; i++) {
    totalStatsArray[i] += playerLevelStatIncrease;
  }

  return totalStatsArray;
}

//Returns true if player has enough stats to use the spell
function checkIfUserCanUseSpell(spellName, userTotalStats) {

  let tempSpellObject = spellList[spellName];

  for (let i = 0; i < statsUsedForSpellRequirements.length; i++) {

    let tempStatName = statsUsedForSpellRequirements[i];

    //If their stat is lower than requirement return false
    if (userTotalStats[i] < tempSpellObject[tempStatName]) 
      return false;
  }

  return true;
}

//Calculates player level 
function levelCalculator(exp) {

    let level = Math.floor(Math.sqrt(exp)) + 1;
    return level;
}

function makeSQLBuffStatement(userdata, login, buffRowName, buffDuration) {

    let sqlStart =  'UPDATE TwitchHeroes.users SET ';
    let sqlEnd =    'WHERE login = "' + login + '";'; 

    //Buff duration
    let dateTimeAddedMinutes = Date.now() + (buffDuration * 60 * 1000);

    //Make the sql row update statement
    let sqlBuffDuration = buffRowName + ' = "' + dateTimeAddedMinutes + '" ';

    //Update amount of time for the buff locally
    userdata[buffRowName] = dateTimeAddedMinutes;

    //Combine the sql
    let sqlFinal = sqlStart + sqlBuffDuration + sqlEnd;

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

function addActions (data) {
  fs.writeFile('actions.txt', data, { flag: 'a+' }, err => {})
}

function clearHeroActionsFile() {
  fs.writeFile('actions.txt', '', { flag: 'w+' }, err => {})
}