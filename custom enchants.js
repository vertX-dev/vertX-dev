import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";



// Enchants
const enchants = {  
    aetherExchange: {  
        id: 10,  
        lvl: 1000,  
        name: "§cAether's Exchange",  
        type: "Curse",  
        maxLvl: 2,  
        description: "Convert all mana to double damage at Level 1 and store 80% of mana for up to 10x damage at Level 2",  
        cost: 8000,  
        enchantOn: ["weapon"],  
        rarity: "legendary"  
    },  
    abyssalBreaker: {  
        id: 11,  
        lvl: 999,  
        name: "§cAbyssal Breaker",  
        type: "Curse",  
        maxLvl: 5,  
        description: "Gain +50% damage per level with a 35% chance per level to trigger a random curse.",  
        cost: 7800,  
        enchantOn: ["weapon"],  
        rarity: "mythic"  
    },  
    wisdomWrath: {  
        id: 12,  
        lvl: 998,  
        name: "§6Wisdom's Wrath",  
        type: "Buff",  
        maxLvl: 10,  
        description: "Convert knowledge into power: +1 bonus damage per level every 10 levels.",  
        cost: 4000,  
        enchantOn: ["weapon"],  
        rarity: "legendary"  
    },  
    permafrost: {  
        id: 13,  
        lvl: 899,  
        name: "§9Permafrost",  
        type: "Buff",  
        maxLvl: 6,  
        description: "Encases foes in ice. Each hit slows and has a 7.5% chance to summon powder snow; frozen enemies take massive bonus damage.",  
        cost: 1000,  
        enchantOn: ["heavy", "normal", "long", "medium"],  
        rarity: "epic"  
    },  
    finalJudgement: {  
        id: 14,  
        lvl: 997,  
        name: "§5Final Judgement",  
        type: "Buff",  
        maxLvl: 6,  
        description: "Instantly decapitates foes below 15% health or when remaining health is less than 1x to 2.5x the hit damage. Kill chance scales from 1/20 to 5/20 (20/20 on level 6, but chances to obtain head remain 5/20) and guarantees a mob head drop.",  
        cost: 4400,  
        enchantOn: ["axe", "long", "medium"],  
        rarity: "epic"  
    },  
    swarmSlayer: {  
        id: 15,  
        lvl: 996,  
        name: "§2Swarm Slayer",  
        type: "Buff",  
        maxLvl: 4,  
        description: "Adds +15% damage per level when mobs are nearby and applies Slowness I to surrounding foes.",  
        cost: 700,  
        enchantOn: ["weapon"],  
        rarity: "uncommon"  
    },  
    sweepingEdge: {  
        id: 16,  
        lvl: 899,  
        name: "§eSweeping Edge",  
        type: "Buff",  
        maxLvl: 5,  
        description: "Enhances sweeping strikes with +20% bonus damage against multiple foes.",  
        cost: 400,  
        enchantOn: ["long", "heavy", "polearm"],  
        rarity: "rare"  
    },  
    quickstrike: {  
        id: 17,  
        lvl: 995,  
        name: "§eQuickstrike",  
        type: "Buff",  
        maxLvl: 5,  
        description: "Increase attack speed by 10% per level.",  
        cost: 1250,  
        enchantOn: ["weapon"],  
        rarity: "uncommon"  
    },  
    lifesteal: {  
        id: 18,  
        lvl: 994,  
        name: "§dLifesteal",  
        type: "Buff",  
        maxLvl: 4,  
        description: "Converts a portion of damage dealt into health. Restores 2.5% of damage per level.",  
        cost: 1800,  
        enchantOn: ["weapon"],  
        rarity: "rare"  
    },  
    gravityPull: {  
        id: 19,  
        lvl: 799,  
        name: "§bGravity Pull",  
        type: "Buff",  
        maxLvl: 3,  
        description: "Pulls nearby enemies towards the landing area of your projectile, with pull strength increasing per level.",  
        cost: 1700,  
        enchantOn: ["ranged", "trident"],  
        rarity: "epic"  
    },  
    enderSlayer: {  
        id: 20,  
        lvl: 500,  
        name: "§5Ender Slayer",  
        type: "Buff",  
        maxLvl: 8,  
        description: "Empowers your weapon to deal an extra 9% damage per level against mobs from the End dimension.",  
        cost: 800,  
        enchantOn: ["weapon"],  
        rarity: "rare"  
    },  
    lightWeight: {  
        id: 21,  
        lvl: 300,  
        name: "§eLight Weight",  
        type: "Trade Off",  
        maxLvl: 5,  
        description: "Enhances movement speed by +5% per level while reducing defense by -1% per level. Ideal for agile warriors willing to trade a bit of protection for increased mobility.",  
        cost: 300,  
        enchantOn: ["armor"],  
        rarity: "uncommon"  
    },  
    nightVision: {  
        id: 22,  
        lvl: 301,  
        name: "§aNight's Sight",  
        type: "Buff",  
        maxLvl: 1,  
        description: "Grants the wearer Night Vision, allowing clear visibility in the dark. Perfect for exploring caves or nighttime adventures.",  
        cost: 1700,  
        enchantOn: ["helmet"],  
        rarity: "rare"  
    },  
    enderHunter: {  
        id: 23,  
        lvl: 799,  
        name: "§5Ender Hunter",  
        type: "Buff",  
        maxLvl: 3,  
        description: "Enhances your bow or crossbow for attacks against Endermen. At Level 1, Endermen take only 60% of your normal damage (-40% penalty), while at Level 3 they take 120% (+20% bonus). Level 2 offers an intermediate effect (-10%)",  
        cost: 2500,  
        enchantOn: ["ranged", "trident"],  
        rarity: "epic"  
    },  
    manaBarrier: {  
        id: 24,  
        lvl: 302,  
        name: "§bMana Barrier",  
        type: "Trade Off",  
        maxLvl: 3,  
        description: "Converts 5% mana per level into defense. Grants +0.5 defense per mana used, with +0.5 extra per level. Caps at 500 defense. When hit, drains mana by 70% (L1), 40% (L2), or 10% (L3) of damage",  
        cost: 2000,  
        enchantOn: ["armor", "elytra"],  
        rarity: "rare"  
    },  
    skyPiercer: {  
        id: 25,  
        lvl: 399,  
        name: "§3Sky Piercer",  
        type: "Buff",  
        maxLvl: 6,  
        description: "Grants +10% damage per level while airborne. Unleash greater power from the skies",  
        cost: 2500,  
        enchantOn: ["elytra"],  
        rarity: "epic"  
    },  
    stormChain: {  
        id: 26,  
        lvl: 799,  
        name: "§5Storm Chain",  
        type: "Buff",  
        maxLvl: 7,  
        description: "Strikes up to 8 nearby enemies with lightning, chaining from the target. Range and count scale with level (up to 12 blocks). Chained enemies take 30% damage and are stunned for 1s",  
        cost: 8200,  
        enchantOn: ["bow"],  
        rarity: "legendary"  
    },  
    curseOfBreaking: {  
        id: 27,  
        lvl: 666,  
        name: "§cCurse of Breaking",  
        type: "Curse",  
        maxLvl: 3,  
        description: "Item breaks 2x/3x/4x faster depending on level. Durability is consumed rapidly.",  
        cost: -1200,  
        enchantOn: ["all"],  
        rarity: "common"  
    },  
    curseOfSlippery: {  
        id: 28,  
        lvl: 667,  
        name: "§cCurse of Slippery",  
        type: "Curse",  
        maxLvl: 1,  
        description: "Makes items occasionally slip from your hand. The item is randomly dropped while using tools or weapons.",  
        cost: -7000,  
        enchantOn: ["weapons", "ranged", "tool"],  
        rarity: "rare"  
    },  
    curseOfIncompatibility: {  //replaced
        id: 29999,  
        lvl: 19999,  
        name: "§cCurse of Incompatibility",  
        type: "Curse",  
        maxLvl: 40,  
        description: "Makes all other enchantments incompatible with the item",  
        cost: -3000000,  
        enchantOn: ["all"],  
        rarity: "legendary"  
    },  
    enlightenment: {  
        id: 30,  
        lvl: 307,  
        name: "§eEnlightenment",  
        type: "Buff",  
        maxLvl: 10,  
        description: "Increases experience gained from any source by 12.5% per level. Stacks with other armor pieces.",  
        cost: 3500,  
        enchantOn: ["armor", "elytra"],  
        rarity: "epic"  
    },  
    curseOfCorrosion: {  
        id: 31,  
        lvl: 900,  
        name: "§cCurse of Corrosion",  
        type: "Curse",  
        maxLvl: 20,  
        description: "Deals damage to the player when in contact with water or during rain. Takes 2 damage per level every 3 seconds when outside in rain or touching water.",  
        cost: -400,  
        enchantOn: ["armor", "elytra"],  
        rarity: "legendary"  
    },  
    curseOfOcean: {  
        id: 32,  
        lvl: 901,  
        name: "§cCurse of Ocean",  
        type: "Curse",  
        maxLvl: 5,  
        description: "Makes the player drown instantly upon contact with water, taking 10x damage from drowning. Grants additional debuffs: Blindness, Weakness, Mining Fatigue, Slowness, and Nausea.",  
        cost: -500,  
        enchantOn: ["armor", "elytra"],  
        rarity: "legendary"  
    },  
    heatResistance: {  
        id: 33,  
        lvl: 333,  
        name: "§eHeat Resistance",  
        type: "Buff",  
        maxLvl: 5,  
        description: "Provides passive protection against high temperatures, reducing heat damage and preventing overheating.",  
        cost: 2200,  
        enchantOn: ["armor"],  
        rarity: "rare"  
    },  
    coldResistance: {  
        id: 34,  
        lvl: 333,  
        name: "§bCold Resistance",  
        type: "Buff",  
        maxLvl: 5,  
        description: "Provides passive protection against cold, reducing the risk of frostbite and mitigating slowing effects from low temperatures.",  
        cost: 2200,  
        enchantOn: ["armor"],  
        rarity: "rare"  
    },  
    frost: {  
        id: 35,  
        lvl: 334,  
        name: "§3Frost",  
        type: "Buff",  
        maxLvl: 7,  
        description: "Activates only when ambient temperature is high; temporarily reduces the surrounding temperature and then goes into cooldown.",  
        cost: 1800,  
        enchantOn: ["armor"],  
        rarity: "epic"  
    },  
    thermalEquilibrium: {  
        id: 36,  
        lvl: 333,  
        name: "§aThermal Equilibrium",  
        type: "Buff",  
        maxLvl: 5,  
        description: "Combines heat and cold resistance, providing balanced protection against both high temperatures and freezing conditions.",  
        cost: 3000,  
        enchantOn: ["armor"],  
        rarity: "epic"  
    },  
    markExplosion: {  
        id: 37,  
        lvl: 799,  
        name: "§6Mark & Burst",  
        type: "Buff",  
        maxLvl: 1,  
        description: "Marks an enemy on the first shot. On the second shot, triggers an explosion causing 500% AoE explosion based on normal damage.",  
        cost: 9000,  
        enchantOn: ["ranged"],  
        rarity: "legendary"  
    }  
};

// Function to convert an integer (up to 20) to a Roman numeral
function intToRoman(num) {
  const valueSymbols = [
    { value: 10, symbol: "X" },
    { value: 9,  symbol: "IX" },
    { value: 5,  symbol: "V" },
    { value: 4,  symbol: "IV" },
    { value: 1,  symbol: "I" }
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


// Function to convert a Roman numeral (up to 20) to an integer
function romanToInt(roman) {
  const romanMap = {
    I: 1,
    V: 5,
    X: 10
  };
  
  let num = 0;
  let prevValue = 0;
  
  // Process the numeral from right to left
  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanMap[roman[i]];
    if (!currentValue) {
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


//Random cursed enchant
function randomCurse(count, level, list) {
    let curses = [];
    return curses;
}

function getScoreboardValue(scoreboard, player) {
    const scoreboardObj = world.scoreboard.getObjective(scoreboard);
    const scoreboardValue = scoreboardObj.getScore(player);
    return scoreboardValue;
}


world.afterEvents.chatSend.subscribe((eventData) => {
    const message = eventData.message.trim();

    // Check if the message starts with .enchant command
    if (message.startsWith(".enchant")) {
        const player = eventData.sender;
        const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
        const itemId = itemStack?.typeId;
        
        player.sendMessage("§cYou have 2 seconds to close chat for enchanting");

        // Create the main enchanting UI
        const enchantingMainUI = new ActionFormData()
            .title("Enchanting Menu")
            .body("Select an option:")
            .button("Enchant")
            .button("Enchant with Book")
            .button("Upgrades")
            .button("Library");

        // Show the form to the player and handle the response.
        system.runTimeout(() => {
            enchantingMainUI.show(player).then((response) => {
                if (!response.canceled) {
                    if (response.selection == 0) handleEnchant(player, itemId, itemStack);
                    if (response.selection == 1) handleEnchantWithBook(player, itemId, itemStack);
                    if (response.selection == 2) handleUpgrade(player);
                    if (response.selection == 3) handleLibrary(player);
                }
            });
        },40);
        
    }
});


function getWeaponTags(itemId) {
    // A mapping for known weapons and their manually assigned tags.
    // You can add or adjust the tags here as needed.
    const weaponTagMapping = {
        "sai":         ["weapon", "sai", "light", "short"],
        "nunchaku":    ["weapon", "nunchaku", "light", "short"],
        "dagger":      ["weapon", "dagger", "light", "short"],
        "rapier":      ["weapon", "rapier", "light", "long"],
        "kama":        ["weapon", "kama", "normal", "short"],
        "katana":      ["weapon", "katana", "normal", "long"],
        "gladius":     ["weapon", "gladius", "normal", "short"],
        "sword":       ["weapon", "sword", "normal", "medium"],
        "cutlass":     ["weapon", "cutlass", "normal", "medium"],
        "machete":     ["weapon", "machete", "normal", "medium"],
        "scimitar":    ["weapon", "scimitar", "light", "short"],
        "broadsword":  ["weapon", "broadsword", "heavy", "medium"],
        "longsword":   ["weapon", "longsword", "heavy", "long"],
        "staff":       ["weapon", "staff", "blunt", "long"],
        "morningstar": ["weapon", "morningstar", "heavy", "medium"],
        "mace":        ["weapon", "mace", "blunt"],
        "khopesh":     ["weapon", "khopesh", "normal", "short"],
        "cleaver":     ["weapon", "cleaver", "normal","heavy", "short"],
        "lance":       ["weapon", "lance", "polearm", "long"],
        "claymore":    ["weapon", "claymore", "heavy", "long"],
        "hammer":      ["weapon", "hammer", "heavy", "blunt"],
        "battleaxe":   ["weapon", "battleaxe", "medium"],
        "greatsword":  ["weapon", "greatsword", "heavy", "long"],
        "trident":     ["weapon", "trident", "polearm"],
        "bow":         ["ranged", "bow"],
        "crossbow":    ["ranged", "crossbow"],
        "helmet":      ["armor", "helmet"],
        "chestplate":  ["armor", "chestplate"],
        "leggings":    ["armor", "leggings"],
        "boots":       ["armor", "boots"],
        "axe":         ["tool", "axe"],
        "elytra":      ["elytra"],
        "gun":         ["ranged", "gun"],
        "wuco:book":   ["all", "armor", "axe", "battleaxe", "gun", "blunt", "book", "boots", "bow", "broadsword", "chestplate", "cleaver", "claymore", "crossbow", "cutlass", "dagger", "elytra", "gladius", "greatsword", "hammer", "heavy", "helmet", "kama", "katana", "khopesh", "leggings", "lance", "light", "longsword", "mace", "machete", "medium", "morningstar", "nunchaku", "normal", "polearm", "rapier", "ranged", "scimitar", "sai", "short", "staff", "sword", "tool", "trident", "weapon"]
            
    };

    // Loop through mapping and see if itemId contains one of the keys.
    // You can adjust this lookup to be an exact match if needed.
    for (const key in weaponTagMapping) {
        if (itemId.includes(key)) {
            // Always include the "all" tag.
            return ["all", ...weaponTagMapping[key]];
        }
    }

    player.sendMessage("§cThis item is not recognized as a known weapon.");
    return [];
}

//Combine enchantments
function combineEnchants(itemEnchants, bookEnchants, player) {
    // Combine the enchantments
    const combinedEnchants = { ...itemEnchants };
    
    // Merge enchantments from book
    for (let enchant in bookEnchants) {
        if (combinedEnchants.hasOwnProperty(enchant)) {
            // Find the matching enchantment data from the enchants object
            const enchantData = Object.values(enchants).find(e => e.name === enchant);
            const maxLevel = enchantData ? enchantData.maxLvl : Infinity

            if (combinedEnchants[enchant] === bookEnchants[enchant]) {
                // If levels are the same, increment by 1 but don't exceed max level
                combinedEnchants[enchant] = Math.min(combinedEnchants[enchant] + 1, (maxLevel + getScoreboardValue("enchantBreak", player)));
            } else {
                // If levels are different, take the highest level
                combinedEnchants[enchant] = Math.max(combinedEnchants[enchant], bookEnchants[enchant]);
            }
        } else {
            combinedEnchants[enchant] = bookEnchants[enchant];
        }
    }

    // Check for Abyssal Breaker
    if (bookEnchants.hasOwnProperty(enchants.abyssalBreaker.name)) {
        let curse = randomCurse();
        combinedEnchants[curse.name] = curse.level;
    }

    return combinedEnchants;
}

// Add function to validate enchantment conflicts
function validateEnchantmentConflicts(combinedEnchants) {
    // Create a map to track enchantment groups
    const groupCounts = {};
    
    // Check each enchantment
    for (const enchantName in combinedEnchants) {
        // Find the enchantment data
        const enchantData = Object.values(enchants).find(e => e.name === enchantName);
        if (enchantData && enchantData.group) {
            // Initialize group counter if it doesn't exist
            if (!groupCounts[enchantData.group]) {
                groupCounts[enchantData.group] = [];
            }
            // Add enchantment to its group
            groupCounts[enchantData.group].push(enchantName);
            
            // Check if group has more than one enchantment
            if (groupCounts[enchantData.group].length > 1) {
                return false;
             //   throw new Error(`Incompatible enchantments: ${groupCounts[enchantData.group].join(", ")} cannot be combined because they belong to the same group: ${enchantData.group}`);
            }
        }
    }
    return true;
}


//enchant with book
function handleEnchantWithBook(player, itemId, itemStack) {
    console.log(`[DEBUG] Starting enchanting process`);

    try {
        // Get the equipment component
        const equipment = player.getComponent("minecraft:equippable");
        if (!equipment) {
            player.sendMessage("§cError: Could not access equipment!");
            return;
        }

        // Get the book from offhand
        const bookStack = equipment.getEquipment(EquipmentSlot.Offhand);
        if (!bookStack || bookStack.typeId !== "wuco:book") {
            player.sendMessage("§eYou must hold a book in your offhand!");
            return;
        }

        // Get the item's current lore
        const itemLore = itemStack.getLore ? itemStack.getLore() : [];
        const bookLore = bookStack.getLore ? bookStack.getLore() : [];

        console.log('[DEBUG] Current lore:', { itemLore, bookLore });

        // Parse enchantments
        let { enchants: itemEnchants, otherLore: itemOtherLore } = parseEnchantments(itemLore);
        let { enchants: bookEnchants } = parseEnchantments(bookLore);

        // Combine enchantments using the new function
        const combinedEnchants = combineEnchants(itemEnchants, bookEnchants, player);
        
        if (!validateEnchantmentConflicts(combinedEnchants)) {
            player.sendMessage("§c[MINECRAFT] Unsupported combination of enchantments!");
            return;
        }

        // Build new lore
        let newLore = [...itemOtherLore];
        for (let enchantName in combinedEnchants) {
            let romanLevel = intToRoman(combinedEnchants[enchantName]);
            newLore.push(enchantName + " " + romanLevel);
        }

        // Create new ItemStack for the enchanted item
        const newItem = itemStack.clone();
        if (newItem.setLore) {
            newItem.setLore(newLore);
            console.log(newItem.getLore());
        }

        // Update both hands
        try {
            // Update main hand
            let equipmen = player.getComponent("minecraft:equippable");
            equipmen.setEquipment(EquipmentSlot.Mainhand, newItem);
            player.runCommand("replaceitem entity @s slot.weapon.offhand 0 air");

            player.sendMessage("§aItem enchanted successfully!");
        } catch (equipError) {
            console.log('[ERROR] Equipment update failed:', equipError);
            
            // Try alternative inventory approach
            try {
                const inventory = player.getComponent("minecraft:inventory");
                if (inventory && inventory.container) {
                    // Update main hand item
                    inventory.container.setItem(player.selectedSlot, newItem);
                    player.sendMessage("§aItem enchanted successfully! (alt method)");
                }
            } catch (invError) {
                console.log('[ERROR] Inventory update failed:', invError);
                player.sendMessage("§cFailed to update items!");
            }
        }

    } catch (error) {
        console.log('[ERROR] Enchanting process failed:', error);
        player.sendMessage("§cAn error occurred while enchanting!");
    }
}




//Enchant
function handleEnchant(player, itemId, itemStack) {
    if (!itemId || !itemStack) {
        player.sendMessage("§cYou must hold an item to enchant!");
        return;
    }

    // Get item tags to determine valid enchantments
    const itemTags = getWeaponTags(itemId);
    if (itemTags.length === 0) return; // getWeaponTags already sends an error message

    // Get current enchantments on the item
    const itemLore = itemStack.getLore ? itemStack.getLore() : [];
    let { enchants: currentEnchants } = parseEnchantments(itemLore);

    // Create the form
    const form = new ModalFormData()
        .title("Enchant Item");

    // Keep track of available enchants for processing response
    const availableEnchants = [];

    // Add sliders for each valid enchant
    for (const [enchantId, enchantData] of Object.entries(enchants)) {
        // Check if the enchant can be applied to this item type
        const canApply = enchantData.enchantOn.some(tag => itemTags.includes(tag));
        if (canApply) {
            availableEnchants.push(enchantData);
            const currentLevel = currentEnchants[enchantData.name] || 0;
            
            // Create slider label with name and cost
            const costText = enchantData.cost > 0 ? 
                `§c-${enchantData.cost}` : 
                `§a${enchantData.cost}`;
            const label = `${enchantData.name} (${costText})`;
            
            // Add slider
            form.slider(
                label,
                0,                      // min level (0 = not applied)
                enchantData.maxLvl,     // max level from enchant data
                1,                      // step size
                currentLevel           // current level (if exists)
            );
        }
    }

    // Show the form to the player
    form.show(player).then((response) => {
        if (response.canceled) return;

        try {
            // Calculate total cost and build new enchantments
            let totalCost = 0;
            let newEnchants = {};

            response.formValues.forEach((level, index) => {
                if (level > 0) { // Only process enchants that were selected
                    const enchant = availableEnchants[index];
                    newEnchants[enchant.name] = level;
                    
                    // Calculate cost based on level selected
                    const enchantCost = enchant.cost * level;
                    totalCost += enchantCost;

                    // Count curses for potential discounts
                    }
                }
            });

            // Apply cost discounts
            const finalCost = calculateEnchantmentCost(player, totalCost, curseCount);

            // Check if player can afford the enchantment
            const points = world.scoreboard.getObjective("points")?.getScore(player) || 0;
            if (points < finalCost) {
                player.sendMessage(`§cYou need ${finalCost} points to apply these enchantments!`);
                return;
            }

            // Create new item with enchantments
            const newItem = itemStack.clone();
            let newLore = [];
            
            // Add each enchantment to lore
            for (const [enchantName, level] of Object.entries(newEnchants)) {
                newLore.push(`${enchantName} ${intToRoman(level)}`);
            }
            
            // Set the new lore
            if (newItem.setLore && validateEnchantmentConflicts(newLore)) {
                newItem.setLore(newLore);
            } else {
                player.sendMessage("§c[MINECRAFT] Unsupported combination of enchantments!");
                return;
            }

            // Update the item in player's hand
            try {
                const equipment = player.getComponent("minecraft:equippable");
                if (equipment) {
                    equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                    
                    // Deduct points
                    player.runCommand(`scoreboard players remove @s points ${finalCost}`);
                    
                    player.sendMessage(`§aSuccessfully applied enchantments for ${finalCost} points!`);
                }
            } catch (error) {
                console.error("Failed to update item:", error);
                player.sendMessage("§cFailed to apply enchantments!");
            }

        } catch (error) {
            console.error("Error in enchant handling:", error);
            player.sendMessage("§cAn error occurred while enchanting!");
        }
    });
}
/**
 * Function to calculate the enchantment cost discount based on player's upgrades
 * @param {object} player - The player object
 * @param {number} baseCost - The base enchantment cost
 * @param {number} curseCount - Number of curses on the item
 * @returns {number} - The final cost after discounts
 */
function calculateEnchantmentCost(player, baseCost, curseCount = 0) {
    // Helper function to get scoreboard values

    // Get player's upgrade levels
    const enchantCostLevel = getScoreboardValue("enchant_cost_level", player) || 0;
    const cursesBonusLevel = getScoreboardValue("curses_bonus_level", player) || 0;
    
    // Calculate discounts
    // Base discount: 3% per enchant_cost_level
    const baseDiscount = enchantCostLevel * 0.03; // 3% per level
    
    // Curse bonus: 4% per curse per curses_bonus_level
    const curseDiscount = (curseCount * cursesBonusLevel * 0.04); // 4% per level per curse
    
    // Calculate final cost with discounts
    // 1. Apply base discount first
    // 2. Then apply curse discount
    // 3. Ensure cost never goes below 1
    const finalCost = Math.max(1, Math.floor(baseCost * (1 - baseDiscount - curseDiscount)));
    
    // Log calculation details for debugging
    console.log(`[DEBUG] Cost Calculation:
        Base Cost: ${baseCost}
        Enchant Cost Level: ${enchantCostLevel} (${(baseDiscount * 100).toFixed(1)}% discount)
        Curse Count: ${curseCount}
        Curses Bonus Level: ${cursesBonusLevel} (${(curseDiscount * 100).toFixed(1)}% discount)
        Final Cost: ${finalCost}`);
    
    return finalCost;
}

// Function to handle the "Library" option.
function handleLibrary(player) {
    // Get the tag and parse unlocked enchants
    const tag = player.getTags().find(tag => tag.startsWith("unlockedEnchants:"));
    if (!tag) {
        player.sendMessage("§cYou don't have any unlocked enchantments!");
        return;
    }

    // Extract IDs from tag and split them into array of numbers
    const unlockedIds = tag.replace("unlockedEnchants:", "")
        .match(/.{1,2}/g)  // Split into pairs of digits
        .map(id => parseInt(id));  // Convert to numbers

    // Create main menu
    const mainMenu = new ActionFormData()
        .title("Enchantments Library");

    // Create array to store valid enchants for reference
    const validEnchants = [];

    // Add buttons for each unlocked enchant
    for (const id of unlockedIds) {
        const enchant = Object.values(enchants).find(e => e.id === id);
        if (enchant) {
            validEnchants.push(enchant);
            mainMenu.button(enchant.name); // Add button with enchant name
        }
    }

    // Show main menu and handle response
    mainMenu.show(player).then(response => {
        if (response.canceled) return;

        // Get selected enchant
        const selectedEnchant = validEnchants[response.selection];
        
        // Create detail menu
        const detailMenu = new ActionFormData()
            .title(selectedEnchant.name)
            .body(
                `§lType:§r ${selectedEnchant.type}\n` +
                `§lMax Level:§r ${selectedEnchant.maxLvl}\n` +
                `§lRarity:§r ${selectedEnchant.rarity}\n` +
                `§lCost:§r ${selectedEnchant.cost}\n` +
                `§lApplies To:§r ${selectedEnchant.enchantOn}\n\n` +
                `§lDescription:§r\n${selectedEnchant.description}`
            )
            .button("Back to Library");

        // Show detail menu
        detailMenu.show(player).then(detailResponse => {
            if (detailResponse.canceled || detailResponse.selection === 0) {
                // If "Back" is pressed or menu is canceled, show main menu again
                handleLibrary(player);
            }
        });
    });
}


function handleUpgrade(player) {
    // Add the getScoreboardValue function for reference
    
    // Get player's current upgrade levels from scoreboards
    const enchantCostLevel = getScoreboardValue("enchant_cost_level", player) || 0;
    const cursesBonusLevel = getScoreboardValue("curses_bonus_level", player) || 0;
    const maxEnchantLevel = getScoreboardValue("max_enchant_level", player) || 0;
    const maxEnchantsLevel = getScoreboardValue("max_enchants_level", player) || 0;
    
    // Get player's currency/points for upgrades
    const enchantPoints = getScoreboardValue("enchant_points", player) || 0;
    
    // Create upgrade menu
    const form = new ActionFormData()
        .title("Enchantment Upgrades")
        .body(`You have ${enchantPoints} upgrade points available.`)
        .button(`Enchant Cost: -${enchantCostLevel * 3}% (Level ${enchantCostLevel}/25)`)
        .button(`Curses Bonus: +${cursesBonusLevel * 4}% (Level ${cursesBonusLevel}/25)`)
        .button(`Max Enchant Level: ${maxEnchantLevel + 1}/25`)
        .button(`Max Enchants Per Item: ${maxEnchantsLevel + 1}/10`)
        .button("Exit");
    
    form.show(player).then(response => {
        if (response.canceled) return;
        
        // Calculate cost - you can adjust this formula
        const upgradePointCost = 5 + (response.selection * 2);
        
        switch (response.selection) {
            case 0: // Enchant Cost
                if (enchantCostLevel < 25 && enchantPoints >= upgradePointCost) {
                    player.runCommand(`scoreboard players remove @s enchant_points ${upgradePointCost}`);
                    player.runCommand("scoreboard players add @s enchant_cost_level 1");
                    player.sendMessage("§aEnchant Cost discount upgraded!");
                } else if (enchantCostLevel >= 25) {
                    player.sendMessage("§cYou've reached the maximum level for Enchant Cost reduction!");
                } else {
                    player.sendMessage(`§cNot enough points! You need ${upgradePointCost} points.`);
                }
                break;
                
            case 1: // Curses Bonus
                if (cursesBonusLevel < 25 && enchantPoints >= upgradePointCost) {
                    player.runCommand(`scoreboard players remove @s enchant_points ${upgradePointCost}`);
                    player.runCommand("scoreboard players add @s curses_bonus_level 1");
                    player.sendMessage("§aCurses Bonus upgraded!");
                } else if (cursesBonusLevel >= 25) {
                    player.sendMessage("§cYou've reached the maximum level for Curses Bonus!");
                } else {
                    player.sendMessage(`§cNot enough points! You need ${upgradePointCost} points.`);
                }
                break;
                
            case 2: // Max Enchant Level
                if (maxEnchantLevel < 25 && enchantPoints >= upgradePointCost) {
                    player.runCommand(`scoreboard players remove @s enchant_points ${upgradePointCost}`);
                    player.runCommand("scoreboard players add @s max_enchant_level 1");
                    player.sendMessage("§aMax Enchant Level upgraded!");
                } else if (maxEnchantLevel >= 25) {
                    player.sendMessage("§cYou've reached the maximum Enchant Level!");
                } else {
                    player.sendMessage(`§cNot enough points! You need ${upgradePointCost} points.`);
                }
                break;
                
            case 3: // Max Enchants Per Item
                if (maxEnchantsLevel < 10 && enchantPoints >= upgradePointCost) {
                    player.runCommand(`scoreboard players remove @s enchant_points ${upgradePointCost}`);
                    player.runCommand("scoreboard players add @s max_enchants_level 1");
                    player.sendMessage("§aMax Enchants Per Item upgraded!");
                } else if (maxEnchantsLevel >= 10) {
                    player.sendMessage("§cYou've reached the maximum number of enchants per item!");
                } else {
                    player.sendMessage(`§cNot enough points! You need ${upgradePointCost} points.`);
                }
                break;
                
            case 4: // Exit
                return;
        }
        
        // Show the menu again after selection
        handleUpgrade(player);
    });
}



// Helper function to parse enchantments from a lore array.
// Returns an object with two properties:
// - enchants: an object mapping enchantment names to numeric levels.
// - otherLore: an array containing non-enchantment lore.
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

