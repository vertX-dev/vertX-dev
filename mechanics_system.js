import { world, system, EquipmentSlots } from "@minecraft/server";
import { lsteal, setscoreb, upscoreb, getScoreboardValue, cooldownTestWeapon, getPlayerStats, fsItem, reviveItems } from './utils.js'

// Transform damage to scoreboard (BETA)
world.afterEvents.entityHealthChanged.subscribe((eventData) => {
    const entity = eventData.entity;

    // Check if the entity is a player
    if (entity.typeId === "minecraft:player") {
        const player = world.getPlayers()[0];
        
        const currentHealth = eventData.newValue;
        const playerName = entity.nameTag;
        const oldValue = eventData.oldValue
        
        let damageToPlayer = oldValue - currentHealth;
        if (damageToPlayer > 0) {
            let stats = getPlayerStats(player);
            let value = stats.shield - Math.max(damageToPlayer - ((damageToPlayer * stats.resistance / 2) + stats.defence), 0);
            if (value >= 0) {
                setscoreb(player, "shield", value);
            } else {
                setscoreb(player, "shield", 0);
                setscoreb(player, "health", Math.max((stats.health + value), 0);
            }
        }
    }
});


// Lifesteal
world.afterEvents.entityHurt.subscribe((damageData) => {
    if (damageData.damageSource.damagingEntity?.typeId === "minecraft:player") {
        lsteal(damageData.damageSource.damagingEntity, damageData.damage);
    }
});


// Atack cooldown melee
// hdt - hit data test
world.afterEvents.entityHitEntity.subscribe((hdt) => {
    if (hdt.damagingEntity.typeId === "minecraft:player") {
        setscoreb(hdt.damagingEntity, "atackCooldown", Math.max(cooldownTestWeapon(hdt.damagingEntity), getScoreboardValue("atackCooldown", hdt.damagingEntity))
    }
});

//every tick tests
system.runInterval(() => {
    let players = world.getAllPlayers();
    for (let player of players) {
        let tps = getScoreboardValue("tps", player);
        colectUseDataOfPlayer(player, tps);
        
        
        if (tps >= 20) {
            setscoreb(player, "tps", -1);
        }
        if (tps < 20) {
            upscoreb(player, "tps", 1);
        }
    }
}, 1);

//Data of player actions
function colectUseDataOfPlayer(player, tps) {
    let stats = getPlayerStats(player);
    
    //events
    
    //Can be revived?
    if (stats.health <= 0) canRevive(player, stats.maxHealth);
    
    //restore stats
    if (tps == 15) reStats(player, stats);
    
    //reduce cooldowns
    rcd(player, stats);
}




//event functions

//Revive
function canRevive(player, maxHealth) {
    let revived == false;
    //conditions
    if ((revived == false) && (fsItem(player, "offhand").typeId === "minecraft:totem_of_undying" || fsItem(player, "mainhand").typeId === "minecraft:totem_of_undying")) {
        player.runCommandAsync("clear @s totem_of_undying 0 1");
        setscoreb(player, "health", Math.floor(maxHealth * 30 / 100));
        revived == true;
    }
    
    
    
    //kill player if not revived
    if (revived == false) {
        setscoreb(player, "health", Math.floor(maxHealth * 50 / 100));
        player.runCommandAsync("kill @s");
    }
}


//Restore stats
function reStats(player, stats) {
    // Health
    if (stats.health < stats.maxHealth) {
        upscoreb(player, "health", stats.healthRegeneration);
    }

    // Mana
    if (stats.mana < stats.maxMana) {
        upscoreb(player, "mana", stats.manaRegeneration);
    }

    // Stamina
    if (stats.stamina < stats.maxStamina) {
        upscoreb(player, "stamina", stats.staminaRegeneration);
    }

    // Shield
    if (stats.shield < stats.maxShield) {
        //every 5 instance of regeneration
        if (stats.shieldSRG >= 5) {
            upscoreb(player, "shield", stats.shieldRegeneration);
            setscoreb(player, "shieldSRG", 0);
        }
        if (stats.shieldSRG < 5) {
            upscoreb(player, "shieldSRG", 1);
        }
    }
}


//cooldown
function rcd(player, stats) {
    let cdrd = (-1 * stats.cooldownBuff / 100) - 1 
    if (stats.cooldown1 > 0) {
        upscoreb(player, "cooldown1t", cdrd);
    }
    if (stats.cooldown2 > 0) {
        upscoreb(player, "cooldown2t", cdrd);
    }
    if (stats.cooldown3 > 0) {
        upscoreb(player, "cooldown3t", cdrd);
    }
    if (stats.cooldownMW > 0) {
        upscoreb(player, "cooldownMWt", cdrd);
    }
}


//display