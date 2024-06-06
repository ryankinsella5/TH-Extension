/*
	Module: skills.js - Controller for skills module
	Copyright twitch.tv/twitch_heroes 2022. All Rights Reserved.
    
	This module is used for building the skills window and updating it with skill experience sent from the backend.
*/

//Allows us to easily build the skills window and add new ones if necessary.
const skillObjects = 
{
    alchemy:        {   skill1Start: 'Increases the duration of alchemy buffs by ', 
                        skillEnd: ' minute(s)', 
                        skillBaseAmount: 0, 
                        skillRatio: 1,
                    },

    blacksmithing:  {   skill1Start: 'Increases Strength by ', 
                        skillEnd: '', 
                        statIncrease: 'strengthFromSkills', 
                        skillBaseAmount: 0, 
                        skillRatio: 2,

                        skill2Start: 'Increases the chance of getting an extra resource while smithing by ', 
                        skill2End: '%', 
                        skill2BaseAmount: 5, 
                        skill2Ratio: 2,
                    },

    cooking:        {   skill1Start: 'Increases Constitution by ', 
                        skillEnd: ' ', 
                        statIncrease: 'constitutionFromSkills', 
                        skillBaseAmount: 0, 
                        skillRatio: 2,
                    },

    harvesting:     {   skill1Start: 'Increases the chance of getting an extra resource while harvesting by ', 
                        skillEnd: '% (Animals, Herbs)', 
                        skillBaseAmount: 5, 
                        skillRatio: 1,
                    },

    jewelcrafting:  {   skill1Start: 'Increases wisdom by ', 
                        statIncrease: 'wisdomFromSkills', 
                        skillEnd: '', 
                        skillBaseAmount: 0, 
                        skillRatio: 2,
                    },

    leatherworking: {   skill1Start: 'Increases attack speed by ', 
                        skillEnd: '%', 
                        skillBaseAmount: 0, 
                        skillRatio: 3,

                        skill2Start: 'Increases the chance of getting an extra resource while leatherworking by ', 
                        skill2End: '%', 
                        skill2BaseAmount: 5, 
                        skill2Ratio: 2,
                    },

    mining:         {   skill1Start: 'Increases the chance of getting an extra ore while mining by ', 
                        skillEnd: '%', 
                        skillBaseAmount: 5, 
                        skillRatio: 1,
                    },

    tailoring:      {   skill1Start: 'Increases Intelligence by ',
                        statIncrease: 'intelligenceFromSkills', 
                        skillEnd: '', 
                        skillBaseAmount: 0,
                        skillRatio: 2,

                        skill2Start: 'Increases the chance of getting an extra resource while spinning cloth by ', 
                        skill2End: '%', 
                        skill2BaseAmount: 5, 
                        skill2Ratio: 2,
                    },

    woodcutting:    {   skill1Start: 'Increases the chance of getting an extra wood while woodcutting by ', 
                        skillEnd: '%',
                        skillBaseAmount: 5, 
                        skillRatio: 1,
                    },

    woodworking:    {   skill1Start: 'Increases Dexterity by ', 
                        statIncrease: 'dexterityFromSkills', 
                        skillEnd: '', 
                        skillBaseAmount: 0, 
                        skillRatio: 2,

                        skill2Start: 'Increases the chance of getting an extra resource while woodworking by ', 
                        skill2End: '%', 
                        skill2BaseAmount: 5, 
                        skill2Ratio: 1,
                    },

}; 

//Handles user actions regarding anything related to the skills container
$(function() {

    //opens/closes up the skills
    $('div.skillsbutton').click(function() {

        //If not visible, show it
        if ($('div.skills').css('display') == 'none') {
            $('div.skills').fadeIn();
            $('div.skillsbutton').addClass('active');
            return;
        }
        
        //If visible, hide it
        $('div.skills').fadeOut(); 
        $('div.skillsbutton').removeClass('active');
    });

});


//Builds the skill window based on the skill objects
function buildSkillWindow() {

	for (const key in skillObjects) {

		let tempSkillObject = skillObjects[key];

		let skillHTML =	'<div class = "statcontainer">' + 
                        	'<div class = "statleft">' +
                            	'<div class="tooltip">' +
                                	'<img style="vertical-align:middle" id = "skillicon" src="images/skillicons/' + key + '.png"/> '  + key +
                                	'<span class="tooltiptext" id = "' + key + 'tooltip">0/0</span>' +
                            	'</div>' +
                        	'</div>' +
                        	'<div class = "statright" id = "' + key + '">1' + '</div>' +
                    	'</div>';

        $('div.skills').append(skillHTML);
	}
}

//Updates the skill window with player experience
function updateSkillWindow() {

	//Updates skill level
	for (const key in skillObjects) {

		let skillExp = playerData[key];
		let skillLevel = levelCalculator(skillExp);

		//Updates the skill level
		$('div#' + key + '.statright').html(skillLevel);

		updatePassedSkillTooltip(key, skillExp);
	}
}

//Updates the skill's tooltip with current xp, required xp to level and skill bonuses
function updatePassedSkillTooltip(skillName, skillExp) {

    //Skill object
	let tempSkillObject = skillObjects[skillName];

    //Tooltip location
	let tooltipHTMLID = '#' + skillName + 'tooltip';

    //Tooltip contents
    let tooltipContents = '';

    //Skill 1
    let skill1Start = tempSkillObject.skill1Start;
    let statIncrease = tempSkillObject.statIncrease;
    let totalSkillAmount = Math.floor((levelCalculator(skillExp) + tempSkillObject.skillBaseAmount) / tempSkillObject.skillRatio);

    //Add skill 1 contents
    tooltipContents += '&#8226;' + skill1Start + totalSkillAmount + tempSkillObject.skillEnd + '<br>';

    //Skill 2
    let skill2Start = tempSkillObject.skill2Start;

    //Add skill 2 to tooltip if it exists
    if (typeof(skill2Start) != "undefined") {
        let totalSkill2Amount = Math.floor((levelCalculator(skillExp) + tempSkillObject.skill2BaseAmount) / tempSkillObject.skill2Ratio);
        tooltipContents += '&#8226;' + skill2Start + totalSkill2Amount + tempSkillObject.skill2End + '<br>';
    }

    //Add total xp and xp to level to end of tooltip
    tooltipContents += '<div class = "spellText">' + 'Total xp: ' + formatCurrentExpAndNextLevel(skillExp) + '</div>';

    //Add total contents to the tooltip
    $(tooltipHTMLID).html(tooltipContents);

    //if the skill increases a stat, add it to stats screen
    if (typeof(statIncrease) != "undefined") 
        playerData[statIncrease] += totalSkillAmount;
}

//Format experience into a neat format 
function formatCurrentExpAndNextLevel(exp) {

    let currentLevel = levelCalculator(exp);
    let nextExp = Math.pow((currentLevel), 2);
    let xpString = exp + '/' + nextExp;

    return xpString;
}
