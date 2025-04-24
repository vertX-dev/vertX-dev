/*======================
 * Global Imports
 *======================*/
import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";





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

//reduce xp lvl
function rdxplvl(num) {
  let level;

  if (num <= 352) {
    // Levels 0–16
    level = Math.sqrt(num + 9) - 3;
  } else if (num <= 1507) {
    // Levels 17–31
    level = (81 / 10) + Math.sqrt((2 / 5) * (num - (7839 / 40)));
  } else {
    // Levels 32+
    level = (325 / 18) + Math.sqrt((2 / 9) * (num - (54215 / 72)));
  }

  return Math.floor(level); // Minecraft levels are whole numbers
}

//Random rarity
function getRandomRarity() {
    const entries = Object.entries(rarityLibrary);
    const totalWeight = entries.reduce((sum, [_, rarity]) => sum + rarity.weight, 0);
    let random = Math.random() * totalWeight;

    for (const [_, rarity] of entries) {
        if (random < rarity.weight) {
            return rarity;
        }
        random -= rarity.weight;
    }
}



/*======================
  Core Enchanting Logic
 ======================*/

/*-------------------------------------------
  Primary enchantment system functionality
-------------------------------------------*/

// Combine the enchantments
function combineEnchants(itemEnchants, bookEnchants, player) {
    const combinedEnchants = { ...itemEnchants };
    // Merge enchantments from book
    for (let enchant in bookEnchants) {
        if (combinedEnchants.hasOwnProperty(enchant)) {
            // Find the matching enchantment data from the enchants object
            const enchantData = Object.values(enchants).find(e => e.name === enchant);
            const maxLevel = enchantData ? enchantData.maxLvl : Infinity

            if (combinedEnchants[enchant] === bookEnchants[enchant]) {
                // If levels are the same, increment by 1 but don't exceed max level
                combinedEnchants[enchant] = Math.min(combinedEnchants[enchant] + 1, maxLevel);
            } else {
                // If levels are different, take the highest level
                combinedEnchants[enchant] = Math.max(combinedEnchants[enchant], bookEnchants[enchant]);
            }
            
        } else {
            combinedEnchants[enchant] = bookEnchants[enchant];
        }
    }
    return combinedEnchants;
}


//Function to validate enchantment conflicts
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
                return false;//conflict between enchantments
             //   throw new Error(`Incompatible enchantments: ${groupCounts[enchantData.group].join(", ")} cannot be combined because they belong to the same group: ${enchantData.group}`);
            }
        }
    }
    return true;//all enchsnts are valid
}






/*======================
  Command Handlers
 ======================*/


//=========================NORMAL ENCHANTING===========================================
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
    let { enchants: currentEnchants, otherLore: itemOtherLore } = parseEnchantments(itemLore);
    const points = player.getTotalXp();
//------------------UI-----------------------------------------------------------
    
    // Create the form
    const form = new ModalFormData()
        .title(`Enchant Item      XP: §a${points}`);

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
                `§c${enchantData.cost}` : 
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
    form.submitButton("§dENCHANT");

    // Show the form to the player
    form.show(player).then((response) => {
//-----------------UI RESPONSE----------------------------------------------------
        
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
                }
            });

            // Check if player can afford the enchantment
            if (points < totalCost) {
                player.sendMessage(`§cYou need ${totalCost} xp to apply these enchantments!`);
                return;
            }

            // Create new item with enchantments
            const newItem = itemStack.clone();
            let newLore = [...itemOtherLore];
            
            // Add each enchantment to lore
            for (const [enchantName, level] of Object.entries(newEnchants)) {
                newLore.push(`${enchantName} ${intToRoman(level)}`);
            }
            
            // Set the new lore
            if (newItem.setLore && validateEnchantmentConflicts(newEnchants)) {
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
                    player.runCommand(`xp -99999L @s`);
                    player.runCommand(`xp ${rdxplvl(points - totalCost)}L @s`);
                    
                    player.sendMessage(`§aSuccessfully applied enchantments for ${totalCost} xp!`);
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
//========================================================================================



//===========TRANSFER ENCHANTMENTS FROM BOOK TO ITEM==============================================
function handleEnchantWithBook(player, itemId, itemStack) {
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

        // Get item tags to determine valid enchantments
        const itemTags = getWeaponTags(itemId);
        if (itemTags.length === 0) return; // getWeaponTags already sends an error message

        // Get the item's current lore
        const itemLore = itemStack.getLore ? itemStack.getLore() : [];
        const bookLore = bookStack.getLore ? bookStack.getLore() : [];

        // Parse enchantments
        let { enchants: itemEnchants, otherLore: itemOtherLore } = parseEnchantments(itemLore);
        let { enchants: bookEnchants } = parseEnchantments(bookLore);

        // Filter book enchants to only include valid ones for this item type
        const validBookEnchants = {};
        for (const [enchantName, level] of Object.entries(bookEnchants)) {
            // Find the enchantment data
            const enchantData = Object.values(enchants).find(e => e.name === enchantName);
            if (enchantData) {
                // Check if any of the item's tags match the enchantment's valid targets
                const canApply = enchantData.enchantOn.some(tag => itemTags.includes(tag));
                if (canApply) {
                    validBookEnchants[enchantName] = level;
                }
            }
        }

        // Combine enchantments using the filtered book enchants
        const combinedEnchants = combineEnchants(itemEnchants, validBookEnchants, player);
        
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

            // If some enchants were filtered out, notify the player
            if (Object.keys(bookEnchants).length !== Object.keys(validBookEnchants).length) {
                player.sendMessage("§eNot all enchantments could be applied because they were not compatible with this item.");
            }
            
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
//====================================================================



//==========================LIBRARY===================================

//need rework
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
//====================================================================



//=========================UPGRADE ENCHANT LEVEL===========================================
function handleUpgrade(player, itemStack) {
    if (!itemStack) {
        player.sendMessage("§cYou must hold an item to upgrade!");
        return;
    }

    // Get current enchantments on the item
    const itemLore = itemStack.getLore ? itemStack.getLore() : [];
    let { enchants: currentEnchants, otherLore: itemOtherLore } = parseEnchantments(itemLore);

    // Find upgradeable enchants (those with breakLevel: true)
    const upgradeableEnchants = [];
    for (const [enchantName, currentLevel] of Object.entries(currentEnchants)) {
        const enchantData = Object.values(enchants).find(e => e.name === enchantName);
        if (enchantData && (enchantData.breakLevel || currentLevel < enchantData.maxLvl)) {
            upgradeableEnchants.push({
                name: enchantName,
                currentLevel,
                maxLevel: enchantData.maxLvl,
                breakLevel: enchantData.breakLevel || false,
                baseCost: enchantData.cost
            });
        }
    }

    if (upgradeableEnchants.length === 0) {
        player.sendMessage("§cNo upgradeable enchantments found on this item!");
        return;
    }

    // Check for guaranteed upgrade scoreboard
    const hasGuaranteedUpgrade = getScoreboardValue("guaranteedUpgrade", player) > 0;

    // Create the form
    const form = new ModalFormData()
        .title("Upgrade Enchantment");

    // Add dropdown for enchant selection
    const enchantNames = upgradeableEnchants.map(e => 
        `${e.name} ${intToRoman(e.currentLevel)} (${e.breakLevel ? "Unlimited" : `Max: ${e.maxLevel}`})`
    );
    form.dropdown("Select Enchantment", enchantNames);

    // Add slider for bulk upgrades (1-25)
    form.slider("Number of Attempts", 1, 25, 1, 1);

    // Add toggle for guaranteed upgrade if available
    if (hasGuaranteedUpgrade) {
        form.toggle("Use Guaranteed Upgrade", false);
    }

    // Show the form to the player
    form.show(player).then((response) => {
        if (response.canceled) return;

        const selectedEnchant = upgradeableEnchants[response.formValues[0]];
        const attempts = response.formValues[1];
        const useGuaranteed = hasGuaranteedUpgrade && response.formValues[2];
        
        // Calculate base cost and success chance
        let baseCost = Math.abs(selectedEnchant.baseCost);
        const currentLevel = selectedEnchant.currentLevel;
        const levelsAboveMax = Math.max(0, currentLevel - selectedEnchant.maxLevel);

        // If level is above max and enchant doesn't have breakLevel, prevent upgrade
        if (levelsAboveMax > 0 && !selectedEnchant.breakLevel) {
            player.sendMessage(`§cThis enchantment cannot be upgraded beyond level ${selectedEnchant.maxLevel}!`);
            return;
        }

        // Calculate increased cost for levels above max
        if (levelsAboveMax > 0) {
            baseCost *= Math.floor(Math.min((1.4 * levelsAboveMax), 40));
        }

        // Calculate total cost for all attempts
        const totalCost = baseCost * attempts;

        // Check if player has enough XP
        const playerXP = player.getTotalXp();
        if (playerXP < totalCost) {
            player.sendMessage(`§cYou need ${totalCost} XP for ${attempts} attempts! (You have ${playerXP})`);
            return;
        }

        // Deduct XP
        player.runCommand(`xp -99999L @s`);

        let successCount = 0;
        let newLevel = currentLevel;
        
        let refund = rdxplvl(playerXP - totalCost);
        let attemptsForUpgrade = 0;
        // Process each attempt
        for (let i = 0; i < attempts; i++) {
            // Calculate success chance (reduces by 20% of original per level)
            let chance = 75 * Math.pow(0.8, currentLevel + i);
            chance = Math.max(chance, 1); // Cap at 1% minimum
            attemptsForUpgrade++;

            // Roll for success or use guaranteed upgrade
            const success = useGuaranteed || (Math.random() * 100 <= chance);

            if (success) {
                successCount++;
                newLevel++;
                if (useGuaranteed) {
                    // Deduct guaranteed upgrade
                    player.runCommand("scoreboard players remove @s guaranteedUpgrade 1");
                    refund = rdxplvl((playerXP - totalCost) + (baseCost * (attempts - attemptsForUpgrade)));
                    break; // Exit loop after using guaranteed upgrade
                }
                refund = rdxplvl((playerXP - totalCost) + (baseCost * (attempts - attemptsForUpgrade)));
                break;
            }
        }

        if (successCount > 0) {
            // Create new item with upgraded enchant
            const newItem = itemStack.clone();
            let newLore = [...itemOtherLore];
            
            // Update the enchantment level
            for (const [enchantName, level] of Object.entries(currentEnchants)) {
                if (enchantName === selectedEnchant.name) {
                    newLore.push(`${enchantName} ${intToRoman(newLevel)}`);
                } else {
                    newLore.push(`${enchantName} ${intToRoman(level)}`);
                }
            }

            // Set the new lore and update item
            if (newItem.setLore) {
                newItem.setLore(newLore);
                try {
                    const equipment = player.getComponent("minecraft:equippable");
                    if (equipment) {
                        equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                        player.sendMessage(
                            `§a=== Upgrade Results ===\n` +
                            `§6Enchantment:§r ${selectedEnchant.name}\n` +
                            `§6New Level:§r ${intToRoman(newLevel)}\n` +
                            `§6Attempts:§r ${attemptsForUpgrade}\n` +
                            `§6XP Cost:§r ${totalCost - refund}`
                        );
                        player.runCommand(`xp ${refund}L @s`);
                    }
                } catch (error) {
                    console.error("Failed to update item:", error);
                    player.sendMessage("§cFailed to upgrade enchantment!");
                }
            }
        } else {
            // All attempts failed
            player.sendMessage(
                `§c=== Upgrade Failed ===\n` +
                `§6Enchantment:§r ${selectedEnchant.name}\n` +
                `§6Attempts:§r ${attempts}\n` +
                `§6XP Cost:§r ${totalCost}`
            );
            player.runCommand(`xp ${refund}L @s`);
        }
    });
}
//====================================================================



/*======================
  Event Listeners
 ======================*/

//chat command
world.beforeEvents.playerInteractWithBlock.subscribe((eventData) => {
    // Check if the interacted block is the enchanter block
    if (eventData.block.typeId === "wuco:enchanter") {
        // Get the player who interacted with the block
        const player = eventData.player;
        
        // Get the item in the player's main hand
        const itemStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
        const itemId = itemStack?.typeId;

        // Optional: Log the interaction for debugging
        console.warn(`Player ${player.name} interacted with enchanter block`);
        
        // Create the main enchanting UI with button icons
        const enchantingMainUI = new ActionFormData()
            .title("Enchanting Menu")
            .body("Select an option:")
            .button("Enchant", "textures/items/book_enchanted.png")
            .button("Enchant with Book", "textures/items/book_enchanted.png")
            .button("Upgrade", "textures/items/diamond.png")
            .button("Library", "textures/blocks/bookshelf.png");

        // Show the form to the player and handle the response.
        // Small delay to ensure proper UI display after interaction
        system.runTimeout(() => {
            enchantingMainUI.show(player).then((response) => {
                if (!response.canceled) {
                    if (response.selection === 0) handleEnchant(player, itemId, itemStack);
                    if (response.selection === 1) handleEnchantWithBook(player, itemId, itemStack);
                    if (response.selection === 2) handleUpgrade(player, itemStack);
                    if (response.selection === 3) handleLibrary(player);
                }
            });
        }, 10);
    }
});


//================================TRIGGERS============================



//====================================================================

/*======================
   Loot Table System
======================*/
system.runInterval(() => {
    // Get all players
    const players = world.getAllPlayers();
    
    for (const player of players) {
        // Get player's main hand item
        const equipment = player.getComponent("minecraft:equippable");
        if (!equipment) continue;
        
        const itemStack = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (!itemStack) continue;
        
        // Get item lore
        const lore = itemStack.getLore();
        if (!lore || lore.length === 0) continue;
        
        // Check each line of lore for the special tag
        for (const line of lore) {
            if (line.startsWith('§klt{')) {
                // Extract the tag between curly braces
                const match = line.match(/§klt\{([^}]+)\}/);
                if (match && match[1]) {
                    const specialTag = match[1];
                    // Call the processing function with the extracted tag
                    loreAndEnchants(player, specialTag, itemStack);
                }
            }
        }
    }
}, 20); // Run every 20 ticks (1 second)


//§klt{Structure}
function loreAndEnchants(player, specialTag, itemStack) {
    // Debug mode
    const DEBUG = true;
    function debug(...args) {
        if (DEBUG) console.warn('[LootEnchant Debug]:', ...args);
    }

    try {
        // 1. Clone itemStack
        const newItem = itemStack.clone();
        debug('Item cloned successfully');

        // 2. Identify structure
        const structure = structures[specialTag];
        if (!structure) {
            debug('Invalid structure tag:', specialTag);
            return;
        }
        debug('Structure identified:', structure.id, 'LootLevel:', structure.lootLevel, 'MaxEnchants:', structure.maxEnchants);

        // Get item tags for filtering enchantments
        const itemTags = getWeaponTags(itemStack.typeId);
        debug('Item tags:', itemTags);
        if (itemTags.length === 0) {
            debug('No valid weapon tags found');
            return;
        }

        // 3. Process enchantments
        let appliedEnchants = [];
        let newLore = [];

        // Perform rolls based on maxEnchants
        for (let i = 0; i < structure.maxEnchants; i++) {
            // 33% chance to apply enchant (increased from 20%)
            if (Math.random() < 0.33) {
                debug('Roll', i + 1, 'successful');

                // Filter available enchants based on weapon tags
                const availableEnchants = structure.aenchants.filter(id => {
                    // Get enchant data
                    const enchantData = Object.values(enchants).find(e => e.id === id);
                    // Check if enchant exists and hasn't been applied yet
                    if (!enchantData || appliedEnchants.some(e => e.id === id)) {
                        return false;
                    }
                    // Check if any of the item's tags match the enchantment's valid targets
                    return enchantData.enchantOn.some(tag => itemTags.includes(tag));
                });

                if (availableEnchants.length === 0) {
                    debug('No more available compatible enchants');
                    break;
                }

                const randomEnchantId = availableEnchants[Math.floor(Math.random() * availableEnchants.length)];
                
                // Find corresponding enchant in enchants const
                const enchantData = Object.values(enchants).find(e => e.id === randomEnchantId);
                if (!enchantData) {
                    debug('Enchant not found for ID:', randomEnchantId);
                    continue;
                }

                // Generate random level between 1 and structure's lootLevel
                const level = Math.floor(Math.random() * structure.lootLevel) + 1;
                
                // Add to applied enchants
                appliedEnchants.push({
                    id: randomEnchantId,
                    name: enchantData.name,
                    level: Math.min(level, enchantData.maxLvl) // Ensure we don't exceed max level
                });

                debug('Applied enchant:', enchantData.name, 'Level:', level);
            } else {
                debug('Roll', i + 1, 'failed');
            }
        }

        // Create lore with enchants
        appliedEnchants.forEach(enchant => {
            newLore.push(`${enchant.name} ${intToRoman(enchant.level)}`);
        });

        // Process lore through giveLore function
        newLore = giveLore(itemStack, newLore);
        debug('Processed lore:', newLore);

        // 4. Set new lore
        newItem.setLore(newLore);
        debug('New lore set:', newLore);

        // 5. Give item to player
        try {
            const equipment = player.getComponent("minecraft:equippable");
            if (equipment) {
                equipment.setEquipment(EquipmentSlot.Mainhand, newItem);
                debug('Item successfully given to player');
                
                // Remove the special tag from lore
                player.sendMessage("§aItem successfully enchanted!");
            }
        } catch (equipError) {
            debug('Equipment update failed:', equipError);
            
            // Fallback to inventory approach
            try {
                const inventory = player.getComponent("minecraft:inventory");
                if (inventory && inventory.container) {
                    inventory.container.setItem(player.selectedSlot, newItem);
                    debug('Item given to player (fallback method)');
                    player.sendMessage("§aItem successfully enchanted! (alt method)");
                }
            } catch (invError) {
                debug('Inventory update failed:', invError);
                player.sendMessage("§cFailed to enchant item!");
                throw invError;
            }
        }

    } catch (error) {
        debug('Fatal error:', error);
        player.sendMessage("§cAn error occurred while enchanting the item!");
        console.error('LootEnchant Error:', error);
    }
}

//========================LORE SYSTEM====================

function getLoreSkill(itemType) {
    //get material
    let material;
    for (const key in materials) {
        if (itemType.include(key)) {
            material = materials[key];
        } else if (itemType.include("unique")) {
            material = uniqueItemsStats[itemType];
        } else {
            console.warn("Not an item");
        }
    }
    
    //get skill from loreLibrary and replace placeholders with values from materials
    let skillLoreRaw = ["§9normal"];
    if (itemType.include("unique")) {
        for (const key in loreLibrary.uniqueEquipment) {
            if (itemType.include(key)) {
                skillLoreRaw = loreLibrary.uniqueEquipment[key];
            }
        }
    } else {
        for (const key in loreLibrary.normalEquipment) {
            if (itemType.include(key)) {
                skillLoreRaw = loreLibrary.normalEquipment[key];
            }
        }
    }

    // Replace all placeholders in the lore
    if (material) {
        for (let i = 0; i < skillLoreRaw.length; i++) {
            let line = skillLoreRaw[i];
            placeholdersRPLV.forEach(placeholder => {
                const valueKey = placeholder.replace(/[{}]/g, '').toLowerCase();
                if (material[valueKey] !== undefined) {
                    line = line.replace(placeholder, material[valueKey]);
                }
            });
            skillLoreRaw[i] = line;
        }
    }
    
    return skillLoreRaw;
}

function giveLore(itemStack, newLore) {
    //Clone itemStack and extract type of item
    const newItem = itemStack?.clone();
    const itemType = itemStack?.typeId;
    const separator = ["§8------------------"];
    const rarityIdWeight = (Math.random() * 100);
    //getLoreData
    let loreSkill = getLoreSkill(itemType);
    
    
    const loreRarityData = getRandomRarity();
    
    return [...loreRarityData.name, ...separator, ...loreSkill, ...separator, ...newLore];
}


/*======================
  Effects from enchantments
 ======================*/

