/*======================
 * Global Imports
 *======================*/
import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { enchants, weaponTagMapping, structures, loreLibrary, rarityLibrary, materials, uniqueItemsStats, placeholdersRPLV } from './const_config.js';
import { amplifiers } from './amplifuers.js';



/*======================
  Utility Functions
 ======================*/
// Roman numeral conversion functions
function intToRoman(num) {
  // Input validation
  if (num <= 0 || num > 3999) {
    throw new Error("Number must be between 1 and 3999");
  }

  const valueSymbols = [
    { value: 1000, symbol: "M" },
    { value: 900,  symbol: "CM" },
    { value: 500,  symbol: "D" },
    { value: 400,  symbol: "CD" },
    { value: 100,  symbol: "C" },
    { value: 90,   symbol: "XC" },
    { value: 50,   symbol: "L" },
    { value: 40,   symbol: "XL" },
    { value: 10,   symbol: "X" },
    { value: 9,    symbol: "IX" },
    { value: 5,    symbol: "V" },
    { value: 4,    symbol: "IV" },
    { value: 1,    symbol: "I" }
  ];
  
  let roman = "";
  for (const { value, symbol } of valueSymbols) {
    while (num >= value) {
      roman += symbol;
      num -= value;
    }
  }
  return roman;
}

function romanToInt(roman) {
  const romanMap = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };
  
  let num = 0;
  let prevValue = 0;
  
  // Process the numeral from right to left
  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanMap[roman[i]];
    if (currentValue === undefined) {
      throw new Error("Invalid Roman numeral character encountered: " + roman[i]);
    }
    
    if (currentValue < prevValue) {
      num -= currentValue;
    } else {
      num += currentValue;
      prevValue = currentValue;
    }
  }
  
  return num;
}

// Weapon classification system
function getWeaponTags(itemId) {
    // Loop through mapping and see if itemId contains one of the keys.
    for (const key in weaponTagMapping) {
        if (itemId.includes(key)) {
            // Always include the "all" tag.
            return ["all", ...weaponTagMapping[key]];
        }
    }
    player.sendMessage("§c[MINECRAFT] This item is not recognized as a known weapon.");
    return [];
}

// Enchantment parsing
function parseEnchantments(loreArray) {
    let enchants = {};
    let otherLore = [];
    for (let line of loreArray) {
        // Split the line into words; assume the last word is a potential Roman numeral.
        let words = line.trim().split(" ");
        if (words.length >= 2) {
            let possibleRoman = words[words.length - 1];
            let level = romanToInt(possibleRoman);
            // If the numeral converts to a valid level (> 0), treat this line as an enchantment.
            if (level && level > 0) {
                // The enchantment name is the remainder of the line.
                let name = words.slice(0, words.length - 1).join(" ");
                enchants[name] = level;
                continue;
            }
        }
        // If the line does not match the expected pattern, treat it as general lore.
        otherLore.push(line);
    }
    return { enchants, otherLore };
}

//Get value of scoreboard
function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}


/**=== EVENT LISTENERS ===*/

/**
 * Entity melee hits another entity
 */
world.afterEvents.entityHitEntity.subscribe((event) => {
    const damagingEntity = event.damagingEntity;
    if (damagingEntity.typeId != "minecraft:player") {
      return;
    }
  
  //get item
    const weaponStack = damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const weapon = weaponStack?.typeId;
    //test if weapon is real weapon
    const weaponTags = getWeaponTags(weapon);
    if (weaponTags.include("armor") || weaponTags.include("ranged") || weaponTags.includr("book") || weaponTags.include("elytra")) {
      console.log("WRONG ITEM");
      return;
    }
    if (!weaponTags.include("weapon")) {
      console.log("WTF");
      return;
    }
    
  
    //get enchanys from item
    let allLore = weaponStack.getLore();
    let { enchants: allEnchantments } = parseEnchantments(allLore);
    // The entity that was hit
    const hitEntity = event.hitEntity;

    let baseStrength = getScoreboardValue("strength", player);
    let amplifier = 1;
    // Handle custom melee enchantments
    }
});

/**
 * Entity hits a block
 */
world.afterEvents.entityHitBlock.subscribe((event) => {
    // The entity that caused the hit
    const damagingEntity = event.damagingEntity;

    // The block that was hit
    const hitBlock = event.hitBlock;

    // Handle custom block-hit enchantments
});

/**
 * Entity takes damage
 */
world.afterEvents.entityHurt.subscribe((event) => {
    // The entity that got hurt
    const hurtEntity = event.hurtEntity;

    // The source of the damage (can be another entity, projectile, etc.)
    const damageSource = event.damageSource;

    // Handle on-hurt enchantment effects
});

/**
 * Entity dies
 */
world.afterEvents.entityDie.subscribe((event) => {
    // The entity that died
    const deadEntity = event.deadEntity;

    // The source of the damage that caused death
    const damageSource = event.damageSource;

    // Handle on-kill enchantment effects
});

/**
 * Projectile hits an entity
 */
world.afterEvents.projectileHitEntity.subscribe((event) => {
    // The projectile that hit the entity (arrow, snowball, etc.)
    const projectile = event.projectile;

    // The entity that launched the projectile
    const source = event.source;

    // Detailed hit information
    const hitInfo = event.getEntityHit();

    // The entity that was hit
    const target = hitInfo.entity;

    // Handle custom projectile entity-hit enchantments
});

/**
 * Projectile hits a block
 */
world.afterEvents.projectileHitBlock.subscribe((event) => {
    // The projectile that hit the block
    const projectile = event.projectile;

    // The vector position where the projectile hit
    const hitVector = event.hitVector;

    // Handle custom projectile block-impact enchantments
});

/**
 * Item use
 */
world.afterEvents.itemUse.subscribe((event) => {
    // The player who used the item
    const source = event.source;

    // The item stack that was used
    const itemStack = event.itemStack;

    // Handle custom item use enchantments
});



/**=== MA8N FUNCTIONS FOR ENCHANTS ===*/
 

/**=== BOW ===*/
 
 function enderHunter(player, event) {
   
 }

