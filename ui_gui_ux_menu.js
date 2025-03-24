import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ilib } from './ilib.js';
import { pbar, getScoreboardValue, UFSval, ilibUFSvalWA, upscoreb, setscoreb } from './utils.js';

world.beforeEvents.itemUse.subscribe((data) => {
    let player = data.source;
    if (data.itemStack.typeId == "wuco:menu") mainMenuUi(player);
});


//Main menu interface
function mainMenuUi(player) {
    new ActionFormData()
        .title("§aMAIN MENU")
        .body("")
        .button("§3STATS", "textures/ui/stats_icon")
        .button("§3SKILLS", "textures/ui/skills_icon")
        .button("§3PROGRESSION", "textures/ui/progression_icon")
        .button("§3SETTINGS", "textures/ui/icon_setting")
        .button("§cCLOSE MENU", "textures/ui/cancel")
        .show(player)
        .then((r) => {
            if (!r.canceled) {
                if (r.selection == 0) statsMenuUi(player);
                if (r.selection == 1) skillsMenuUi(player);
                if (r.selection == 2) progressionMenuUi(player);
                if (r.selection == 3) settingsMenuUi(player);
            }
        });
}


//Function for stats menu 
function statsMenuUi(player) {
    
    const lvl      = getScoreboardValue("playerLevel", player);
    const cxp      = getScoreboardValue("currentXP", player);
    const nlxp     = getScoreboardValue("nextLevelXP", player);
    const nspoints = getScoreboardValue("normalStatPoints", player);
    const sspoints = getScoreboardValue("superStatPoints", player);
    const health   = getScoreboardValue("maxHealth", player);
    const defense  = getScoreboardValue("defense", player);
    const shield   = getScoreboardValue("maxShield", player);
    const mana     = getScoreboardValue("maxMana", player);
    const stamina  = getScoreboardValue("maxStamina", player);
    const strength = getScoreboardValue("strength", player);
    
    // Additional values for each stat
    const ahealth   = getScoreboardValue("ahealth", player);
    const adefense  = getScoreboardValue("adefense", player);
    const ashield   = getScoreboardValue("ashield", player);
    const amana     = getScoreboardValue("amana", player);
    const astamina  = getScoreboardValue("astamina", player);
    const astrength = getScoreboardValue("astrength", player);
    
    const body = `
§eLevel: §b${lvl}            ${ilib("normalStatPoint")} §b${nspoints}   ${ilib("superStatPoint")} §b${sspoints}

§eXP: §b${cxp}/${nlxp}


${ilib("health")} §eHealth: §b${health} §7(${ahealth})
${ilib("defense")} §eDefense: §b${defense} §7(${adefense})
${ilib("shield")} §eShield: §b${shield} §7(${ashield})
${ilib("mana")} §eMana: §b${mana} §7(${amana})
${ilib("stamina")} §eStamina: §b${stamina} §7(${astamina})
${ilib("strength")} §eStrength: §b${strength} §7(${astrength})
    `;
    
    new ActionFormData()
        .title("§aYOUR STATS")
        .body(body)
        .button("§3UPGRADE STATS", "textures/ui/upgrade_icon")
        .button("§3UPGRADE SPECIAL SKILLS", "textures/ui/upgrade_special_skills_icon")
        .button("§cCLOSE MENU", "textures/ui/cancel")
        .show(player)
        .then((r) => {
            if (!r.canceled) {
                if (r.selection == 0) upStatsMenuUi(player, " ");
                if (r.selection == 1) upSpecialSkillMenuUi(player);
            }
        });
}

//Upgrade normal stats menu
function upStatsMenuUi(player, error) {
    let healthVal, defenseVal, shieldVal, manaVal, staminaVal, strengthVal;
    
    const showMax = player.hasTag("showMaxValuesInStats");
    
    if (showMax) {
        healthVal   = getScoreboardValue("maxHealth", player);
        defenseVal  = getScoreboardValue("defense", player);
        shieldVal   = getScoreboardValue("maxShield", player);
        manaVal     = getScoreboardValue("maxMana", player);
        staminaVal  = getScoreboardValue("maxStamina", player);
        strengthVal = getScoreboardValue("strength", player);
    } else {
        healthVal   = getScoreboardValue("bhealth", player);
        defenseVal  = getScoreboardValue("bdefense", player);
        shieldVal   = getScoreboardValue("bshield", player);
        manaVal     = getScoreboardValue("bmana", player);
        staminaVal  = getScoreboardValue("bstamina", player);
        strengthVal = getScoreboardValue("bstrength", player);
    }
    
    // Create preview strings using ilibUFSvalWA
    const healthStr   = ilibUFSvalWA(healthVal, 0, 5, "health");
    const defenseStr  = ilibUFSvalWA(defenseVal, 0, 5, "defense");
    const shieldStr   = ilibUFSvalWA(shieldVal, 0, 5, "shield");
    const manaStr     = ilibUFSvalWA(manaVal, 0, 5, "mana");
    const staminaStr  = ilibUFSvalWA(staminaVal, 0, 5, "stamina");
    const strengthStr = ilibUFSvalWA(strengthVal, 0, 5, "strength");
    
    const points = getScoreboardValue("normalStatPoints", player);
    
    new ActionFormData()
        .title("Upgrade Stats")
        .body(`${error} \n${ilib("normalStatPoint")} ${points} `)
        .button("§eHealth\n" + healthStr)
        .button("§eDefense\n" + defenseStr)
        .button("§eShield\n" + shieldStr)
        .button("§eMana\n" + manaStr)
        .button("§eStamina\n" + staminaStr)
        .button("§eStrength\n" + strengthStr)
        .button("§cCLOSE MENU", "textures/ui/cancel")
        .show(player)
        .then((r) => {
            if (!r.canceled) {
                if (r.selection == 0) upgradeStatsPlayer(player, "bhealth", points, upValue);
                if (r.selection == 1) upgradeStatsPlayer(player, "bdefense", points, upValue);
                if (r.selection == 2) upgradeStatsPlayer(player, "bshield", points, upValue);
                if (r.selection == 3) upgradeStatsPlayer(player, "bmana", points, upValue);
                if (r.selection == 4) upgradeStatsPlayer(player, "bstamina", points, upValue);
                if (r.selection == 5) upgradeStatsPlayer(player, "bstrength", points, upValue);
            }
        });
}

function upgradeStatsPlayer(player, name, points, upValue) {
    if (points >= 1) {
        upscoreb(player, name, UFSval(getScoreboardValue(name, player), 0, upValue));
        upStatsMenuUi(player, " ");
    } else {
        upStatsMenuUi(player, "§4NOT ENOUGH POINTS FOR UPGRADE!")
    }
}


function upSpecialSkillMenuUi(player) {
    const lvl = getScoreboardValue("playerLevel", player);
    const cxp = getScoreboardValue("currentXP", player);
    const nlxp = getScoreboardValue("nextLevelXP", player);
    const nspoints = getScoreboardValue("normalStatPoints", player);
    const sspoints = getScoreboardValue("superStatPoints", player);
    const health = getScoreboardValue("maxHealth", player);
    const defense = getScoreboardValue("defense", player);
    const shield = getScoreboardValue("maxShield", player);
    const mana = getScoreboardValue("maxMana", player);
    const stamina = getScoreboardValue("maxStamina", player);
    const strength = getScoreboardValue("strength", player);

    
    
    
}