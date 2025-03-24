import { world, system, EquipmentSlot } from "@minecraft/server"
import { ilib } from './ilib.js'
/*
utils require ilib
you can use full version of ilib or
use this simple version for running without crashes:

export function ilib(name) {
     return name;
}
*/


//Function for progress bars with ilib
export function pbar(pbarValue, pbarMaxValue, maxLength, ebarIcon, fbarIcon) {
    const percent = (pbarValue / pbarMaxValue) * maxLength;
    const filledBars = ilib(fbarIcon).repeat(Math.max(0, Math.min(maxLength, Math.floor(percent))));
    const emptyBars = ilib(ebarIcon).repeat(maxLength - filledBars.length);
}
//Function for progress bars without ilib
export function pbarm(pbarValue, pbarMaxValue, maxLength, ebarIcon, fbarIcon) {
    const percent = (pbarValue / pbarMaxValue) * maxLength;
    const filledBars = fbarIcon.repeat(Math.max(0, Math.min(maxLength, Math.floor(percent))));
    const emptyBars = ebarIcon.repeat(maxLength - filledBars.length);
}


//Function for scoreboards
export function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}


//Function for random
export function rnb(min, max) {
    const rnum = (Math.random() * (max - min)) + min;
    return rnum;
}


//Function for random item
export function rni(listName) {
    const ridfl = listName[Math.floor((Math.random()) * listName.length)]);
    return ridfl;
}


//Function for value preview with arrow; 0 for sum and 1 for percents
export function ilibUFSvalWA(baseValue, sumORpercent, fsvalue, iname) {
    let cvalue = 0;
    
    if (sumORpercent == 0) {
        //sum
        cvalue = Math.floor(baseValue + fsvalue);
    }
    if (sumORpercent == 1) {
        //percent
        cvalue = Math.floor(baseValue * (1 + (fsvalue / 100)));
    }
    //create output string
    const outputString = `${baseValue} ${ilib(iname)}    ${ilib(arrowRight)}    ${cvalue} ${ilib(iname)} `;
    return outputString;
}
//Function for calculating next value
export function UFSval(baseValue, sumORpercent, fsvalue) {
    let cvalue = 0;
    
    if (sumORpercent == 0) {
        //sum
        cvalue = Math.floor(baseValue + fsvalue);
    }
    if (sumORpercent == 1) {
        //percent
        cvalue = Math.floor(baseValue * (1 + (fsvalue / 100)));
    }    
    return cvalue;
}


//Function add value to scoreboard
export function upscoreb(player, scoreboard, value) {
    player.runCommandAsync(`scoreboard players add @s ${scoreboard} ${value} `);
}

//Function set value to scoreboard
export function setscoreb(player, scoreboard, value) {
    player.runCommandAsync(`scoreboard players set @s ${scoreboard} ${value} `);
}


//Function for life steal
export function lsteal(to, amount) {
    const healPercent = getScoreboardValue("lifeStealPercent", to);
    const maxheal = getScoreboardValue("lifeStealMax", to);
    upscore(to, "health", Math.min(maxheal, (healPercent * amount / 100)));
}


//weapon cooldowns library
export function cooldownTestWeapon(player) {
    const cooldown = getCooldown();
}


//Info of item(lore)
export function glore(player, slot) {
    let lore = player.getComponent("minecraft:equippable")?.getEquipment(slot).getLore();
    return lore;
}


//Get item
export function fsItem(player, slot) {
    let item = player.getComponent("minecraft:equippable")?.getEquipment(slot);
    return item;
}


//Get stats of player
export function getPlayerStats(player) {
    let stats = {
        health: getScoreboardValue("health", player),
        mana: getScoreboardValue("mana", player),
        stamina: getScoreboardValue("stamina", player),
        defence: getScoreboardValue("defence", player),
        strength: getScoreboardValue("strength", player),
        resistance: getScoreboardValue("resistance", player),
        shield: getScoreboardValue("shield", player),
        maxHealth: getScoreboardValue("maxHealth", player)
    }
    return stats;
}


/*Revive items
 * info:
 * rh - restored health
 * ch - chance of use
 * qq - queue of use (decide what item will be used first if player have more then 1); also uid
 * dl - if true item will be destroyed when used
 * rd - cooldown for next revive item can be used
 * ttr - time to revive, player will go to spectator mode before can be revived
 * dfn - debuff name, give player debuff
*/
export const reviveItems = {
    "minecraft:totem_of_undying": 50
}
