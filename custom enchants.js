import { world, system, EquipmentSlot, EntityComponentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";


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


// Enchants
const enchants = {
    aetherExchange: {
        id: 01,
        name: "§cAether's Exchange",
        type: "Curse",
        maxLvl: 2,
        description: "Convert all mana to double damage at Level 1 and store 80% of mana for up to 10x damage at Level 2",
        cost: 8000,
        enchantOn: "sword",
        rarity: "legendary"
    },
    abyssalBreaker: {
        id: 02,
        name: "§cAbyssal Breaker",
        type: "Curse",
        maxLvl: 5,
        description: "Gain +50% damage per level with a 35% chance per level to trigger a random curse.",
        cost: 7800,
        enchantOn: "sword",
        rarity: "mythic"
    },
    wisdomWrath: {
        id: 03,
        name: "§6Wisdom's Wrath",
        type: "Buff",
        maxLvl: 10,
        description: "Convert knowledge into power: +1 bonus damage per level every 10 levels.",
        cost: 4000,
        enchantOn: "sword",
        rarity: "legendary"
    },
    permafrost: {
        id: 04,
        name: "§9Permafrost",
        type: "Buff",
        maxLvl: 6,
        description: "Encases foes in ice. Each hit slows and has a 7.5% chance to summon powder snow; frozen enemies take massive bonus damage.",
        cost: 1000,
        enchantOn: "sword",
        rarity: "epic"
    },
    finalJudgement: {
        id: 05,
        name: "§5Final Judgement",
        type: "Buff",
        maxLvl: 6,
        description: "Instantly decapitates foes below 15% health or when remaining health is less than 1x to 2.5x the hit damage. Kill chance scales from 1/20 to 5/20 (20/20 on level 6, but chances to obtain head remain 5/20) and guarantees a mob head drop.",
        cost: 4400,
        enchantOn: "sword",
        rarity: "epic"
    },
    swarmSlayer: {
        id: 06,
        name: "§2Swarm Slayer",
        type: "Buff",
        maxLvl: 4,
        description: "Adds +15% damage per level when mobs are nearby and applies Slowness I to surrounding foes.",
        cost: 700,
        enchantOn: "sword",
        rarity: "uncommon"
    },
    sweepingEdge: {
        id: 07,
        name: "§eSweeping Edge",
        type: "Buff",
        maxLvl: 5,
        description: "Enhances sweeping strikes with +20% bonus damage against multiple foes.",
        cost: 400,
        enchantOn: "sword",
        rarity: "rare"
    },
    quickstrike: {
        id: 8,
        name: "§eQuickstrike",
        type: "Buff",
        maxLvl: 05,
        description: "Increase attack speed by 10% per level.",
        cost: 1250,
        enchantOn: "sword",
        rarity: "uncommon"
    },
    lifesteal: {
        id: 09,
        name: "§dLifesteal",
        type: "Buff",
        maxLvl: 4,
        description: "Converts a portion of damage dealt into health. Restores 2.5% of damage per level.",
        cost: 1800,
        enchantOn: "sword",
        rarity: "rare"
    },
    gravityPull: {
        id: 10,
        name: "§bGravity Pull",
        type: "Buff",
        maxLvl: 3,
        description: "Pulls nearby enemies towards the landing area of your projectile, with pull strength increasing per level.",
        cost: 1700,
        enchantOn: "bow",
        rarity: "epic"
    },
    enderSlayer: {
        id: 11,
        name: "§5Ender Slayer",
        type: "Buff",
        maxLvl: 8,
        description: "Empowers your weapon to deal an extra 9% damage per level against mobs from the End dimension.",
        cost: 800,
        enchantOn: "sword",
        rarity: "rare"
    },
    lightWeight: {
        id: 12,
        name: "§eLight Weight",
        type: "Trade Off",
        maxLvl: 5,
        description: "Enhances movement speed by +5% per level while reducing defense by -1% per level. Ideal for agile warriors willing to trade a bit of protection for increased mobility.",
        cost: 300,
        enchantOn: "armor",
        rarity: "uncommon"
    },
    nightVision: {
        id: 13,
        name: "§aNight's Sight",
        type: "Buff",
        maxLvl: 1,
        description: "Grants the wearer Night Vision, allowing clear visibility in the dark. Perfect for exploring caves or nighttime adventures.",
        cost: 1700,
        enchantOn: "helmet",
        rarity: "rare"
    },
    enderHunter: {
        id: 14,
        name: "§5Ender Hunter",
        type: "Buff",
        maxLvl: 3,
        description: "Enhances your bow or crossbow for attacks against Endermen. At Level 1, Endermen take only 60% of your normal damage (-40% penalty), while at Level 3 they take 120% (+20% bonus). Level 2 offers an intermediate effect (-10%)",
        cost: 2500,
        enchantOn: "bow,crossbow",
        rarity: "epic"
    },
    manaBarrier: {
        id: 15,
        name: "§bMana Barrier",
        type: "Trade Off",
        maxLvl: 3,
        description: "Converts 5% mana per level into defense. Grants +0.5 defense per mana used, with +0.5 extra per level. Caps at 500 defense. When hit, drains mana by 70% (L1), 40% (L2), or 10% (L3) of damage",
        cost: 2000,
        enchantOn: "armor",
        rarity: "rare"
    },
    skyPiercer: {
        id: 16,
        name: "§3Sky Piercer",
        type: "Buff",
        maxLvl: 6,
        description: "Grants +10% damage per level while airborne. Unleash greater power from the skies",
        cost: 2500,
        enchantOn: "elytra",
        rarity: "epic"
    },
    stormChain: {
        id: 17,
        name: "§5Storm Chain",
        type: "Buff",
        maxLvl: 7,
        description: "Strikes up to 8 nearby enemies with lightning, chaining from the target. Range and count scale with level (up to 12 blocks). Chained enemies take 30% damage and are stunned for 1s",
        cost: 8200,
        enchantOn: "bow",
        rarity: "legendary"
    },
    curseOfBreaking: {
        id: 18,
        name: "§cCurse of Breaking",
        type: "Curse",
        maxLvl: 3,
        description: "Item breaks 2x/3x/4x faster depending on level. Durability is consumed rapidly.",
        cost: 100,
        enchantOn: "all",
        rarity: "common"
    },
    curseOfSlippery: {
        id: 19,
        name: "§cCurse of Slippery",
        type: "Curse",
        maxLvl: 1,
        description: "Makes items occasionally slip from your hand. The item is randomly dropped while using tools or weapons.",
        cost: 100,
        enchantOn: "tools, weapons",
        rarity: "rare"
    },
    curseOfIncompatibility: {
        id: 20,
        name: "§cCurse of Incompatibility",
        type: "Curse",
        maxLvl: 1,
        description: "Makes all other enchantments incompatible with the item",
        cost: 20000,
        enchantOn: "all",
        rarity: "legendary"
    },
    enlightenment: {
        id: 21,
        name: "§eEnlightenment",
        type: "Buff",
        maxLvl: 10,
        description: "Increases experience gained from any source by 12.5% per level. Stacks with other armor pieces.",
        cost: 3500,
        enchantOn: "armor",
        rarity: "epic"
    },
    curseOfCorrosion: {
        id: 22,
        name: "§cCurse of Corrosion",
        type: "Curse",
        maxLvl: 20,
        description: "Deals damage to the player when in contact with water or during rain. Takes 2 damage per level every 3 seconds when outside in rain or touching water.",
        cost: 700,
        enchantOn: "all",
        rarity: "legendary"
    },
    curseOfOcean: {
        id: 23,
        name: "§cCurse of Ocean",
        type: "Curse",
        maxLvl: 5,
        description: "Makes the player drown instantly upon contact with water, taking 10x damage from drowning. Grants additional debuffs: Blindness, Weakness, Mining Fatigue, Slowness, and Nausea.",
        cost: 0,
        enchantOn: "all",
        rarity: "legendary"
    },
    heatResistance: {
        id: 24,
        name: "§eHeat Resistance",
        type: "Buff",
        maxLvl: 5,
        description: "Provides passive protection against high temperatures, reducing heat damage and preventing overheating.",
        cost: 2200,
        enchantOn: "armor",
        rarity: "rare"
    },
    coldResistance: {
        id: 25,
        name: "§bCold Resistance",
        type: "Buff",
        maxLvl: 5,
        description: "Provides passive protection against cold, reducing the risk of frostbite and mitigating slowing effects from low temperatures.",
        cost: 2200,
        enchantOn: "armor",
        rarity: "rare"
    },
    frost: {
        id: 26,
        name: "§3Frost",
        type: "Buff",
        maxLvl: 7,
        description: "Activates only when ambient temperature is high; temporarily reduces the surrounding temperature and then goes into cooldown.",
        cost: 1800,
        enchantOn: "armor",
        rarity: "epic"
    },
    thermalEquilibrium: {
        id: 27,
        name: "§aThermal Equilibrium",
        type: "Buff",
        maxLvl: 5,
        description: "Combines heat and cold resistance, providing balanced protection against both high temperatures and freezing conditions.",
        cost: 3000,
        enchantOn: "armor",
        rarity: "epic"
    },
    markExplosion: {
        id: 28,
        name: "§6Mark & Burst",
        type: "Buff",
        maxLvl: 1,
        description: "Marks an enemy on the first shot. On the second shot, triggers an explosion causing 500% AoE explosion based on normal damage.",
        cost: 9000,
        enchantOn: "bow,crossbow",
        rarity: "legendary"
    }
};

// Enchanting UI with function calls for each response
world.afterEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent("advanced_enchanter:trigger", {
        onPlayerInteract: e => {
            // Check if a player holds an item in their main hand.
            const itemStack = e.player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
            const itemId = itemStack?.typeId;
            if (!itemId) {
                e.player.sendMessage("§cYou're not holding any item!");
                return;
            }

            // Create the main enchanting UI
            const enchantingMainUI = new ActionFormData()
                .title("Enchanting Menu")
                .body("Select an option:")
                .button("Enchant")
                .button("Enchant with Book")
                .button("Upgrades")
                .button("Library");
            
            // Show the form to the player and handle the response.
            enchantingMainUI.show(e.player).then((r) => {
                if (!r.canceled) {
                    if (r.selection == 0) handleEnchant(e.player, itemId, itemStack);
                    if (r.selection == 1) handleEnchantWithBook(e.player, itemId, itemStack);
                    if (r.selection == 2) haldleUpgrade(player);
                    if (r.selection == 3) handleLibrary(player);
                }
            });
        }
    });
});

function handleEnchant(player, itemId, itemStack) {
    const knownTypes = [
        // Book
        "book",

        // Armor
        "helmet", "chestplate", "leggings", "boots",

        // Tools
        "pickaxe", "axe", "shovel", "hoe", "shears",

        // Weapons
        "sai", "nunchaku", "dagger", "rapier", "kama", "katana", "gladius", "sword",
        "cutlass", "machete", "scimitar", "broadsword", "longsword", "staff",
        "morningstar", "mace", "khopesh", "cleaver", "lance", "claymore", "hammer",
        "battleaxe", "greatsword", "trident", "bow", "crossbow"
    ];

    const matchedType = knownTypes.find(type => itemId.includes(type));

    if (!matchedType) {
        player.sendMessage("§cThis item cannot be enchanted.");
        return;
    }

    player.sendMessage(`§aDetected item type: ${matchedType}`);
    sharedEnchantLogic(player, matchedType, itemStack);
}

// Function to handle the "Enchant with Book" option.
function handleEnchantWithBook(player, itemId, itemStack) {
    // Check if the player holds a book in their off hand.
    const bookStack = player.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Offhand);
    const bookId = bookStack?.typeId;
    if (!bookId || bookId !== "minecraft:book") {
        player.sendMessage("§eYou must hold a book in your offhand!");
        return;
    }
    
    // Retrieve lore from both the item and the book.
    let itemLore = itemStack.getLore() || [];
    let bookLore = bookStack.getLore() || [];
    
    // Parse the item and book lore into enchantments and general lore.
    let { enchants: itemEnchants, otherLore: itemOtherLore } = parseEnchantments(itemLore);
    let { enchants: bookEnchants } = parseEnchantments(bookLore);
    
    // Merge enchantments from the book into the item.
    // For overlapping enchantments, keep the highest level.
    for (let enchant in bookEnchants) {
        if (itemEnchants.hasOwnProperty(enchant)) {
            itemEnchants[enchant] = Math.max(itemEnchants[enchant], bookEnchants[enchant]);
        } else {
            itemEnchants[enchant] = bookEnchants[enchant];
        }
    }
    
    // Check if the book has the "Abyssal Breaker" enchantment using its display name from the enchants object.
    if (bookEnchants.hasOwnProperty(enchants.abyssalBreaker.name)) {
        // Assume the randomCurse function exists and returns an object:
        // { name: <curse name>, level: <numeric level> }
        let curse = randomCurse();
        itemEnchants[curse.name] = curse.level;
    }
    
    // Rebuild the lore for the item.
    // Start with any non-enchantment lore and then append each enchantment with its level in Roman numeral format.
    let newLore = itemOtherLore.slice();
    for (let enchantName in itemEnchants) {
        let romanLevel = intToRoman(itemEnchants[enchantName]);
        newLore.push(enchantName + " " + romanLevel);
    }
    
    // Update the item with the new lore.
    itemStack.setLore(newLore);
    player.sendMessage("Item enchanted successfully.");
    
    // Replace the enchanted book with a normal book.
    // Clear the book's lore and set its type to a normal book.
    bookStack.setLore([]);
    bookStack.setType("minecraft:book");
    let hands = player.getComponent("minecraft:equippable");
    hands.setEquipment(EquipmentSlot.Mainhand, itemStack);
    hands.setEquipment(EquipmentSlot.Offhand, bookStack);
    
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


/**
 * Handles the enchantment upgrade system
 * @param {object} player - The player object
 * @returns {void}
 */
function handleUpgrade(player) {
    // Add the getScoreboardValue function for reference
    function getScoreboardValue(scoreboard, player) {
        const scoreboardObj = world.scoreboard.getObjective(scoreboard);
        const scoreboardValue = scoreboardObj.getScore(player);
        return scoreboardValue;
    }
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
        .button("Enchant Cost: -${enchantCostLevel * 3}% (Level ${enchantCostLevel}/25)")
        .button("Curses Bonus: +${cursesBonusLevel * 4}% (Level ${cursesBonusLevel}/25)")
        .button("Max Enchant Level: ${maxEnchantLevel + 1}/25")
        .button("Max Enchants Per Item: ${maxEnchantsLevel + 1}/10")
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

/**
 * Function to calculate the enchantment cost discount based on player's upgrades
 * @param {object} player - The player object
 * @param {number} baseCost - The base enchantment cost
 * @param {number} curseCount - Number of curses on the item
 * @returns {number} - The final cost after discounts
 */
function calculateEnchantmentCost(player, baseCost, curseCount = 0) {
    // Get player's upgrade levels
    const enchantCostLevel = getScoreboardValue("enchant_cost_level", player) || 0;
    const cursesBonusLevel = getScoreboardValue("curses_bonus_level", player) || 0;
    
    // Calculate discounts
    const baseDiscount = enchantCostLevel * 0.03; // 3% per level
    const curseDiscount = curseCount * cursesBonusLevel * 0.04; // 4% per level per curse
    
    // Apply discounts (ensuring it doesn't go below 1)
    const finalCost = Math.max(1, Math.floor(baseCost * (1 - baseDiscount - curseDiscount)));
    
    return finalCost;
}

/**
 * Function to check if player can apply an enchantment based on upgrades
 * @param {object} player - The player object
 * @param {object} item - The item being enchanted
 * @param {number} enchantLevel - The enchantment level being applied
 * @returns {boolean} - Whether the enchantment can be applied
 */
function canApplyEnchantment(player, item, enchantLevel) {
    // Add the getScoreboardValue function for reference
    function getScoreboardValue(scoreboard, player) {
        const scoreboardObj = world.scoreboard.getObjective(scoreboard);
        const scoreboardValue = scoreboardObj.getScore(player);
        return scoreboardValue;
    }
    const maxEnchantLevel = getScoreboardValue("max_enchant_level", player) || 0;
    const maxEnchantsLevel = getScoreboardValue("max_enchants_level", player) || 0;
    
    // Get current enchantments on item
    const currentEnchants = item.getComponent("minecraft:enchantments").enchantments;
    const enchantCount = Object.keys(currentEnchants).length;
    
    // Check if requested enchant level is within player's limit
    if (enchantLevel > maxEnchantLevel + 1) {
        player.sendMessage("§cYour Max Enchant Level upgrade isn't high enough!");
        return false;
    }
    
    // Check if adding another enchantment exceeds player's limit
    if (enchantCount >= maxEnchantsLevel + 1) {
        player.sendMessage("§cYou've reached your maximum number of enchantments per item!");
        return false;
    }
    
    return true;
}

// Setup necessary scoreboard objectives
function setupScoreboards() {
    const scoreboards = [
        "enchant_cost_level",
        "curses_bonus_level",
        "max_enchant_level",
        "max_enchants_level",
        "enchant_points"
    ];
    
    for (const scoreboard of scoreboards) {
        try {
            world.getDimension("overworld").runCommand(`scoreboard objectives add ${scoreboard} dummy`);
        } catch (error) {
            // Objective already exists
        }
    }
}

// Initialize the system
setupScoreboards();

function sharedEnchantLogic(player, matchedType) {
    
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