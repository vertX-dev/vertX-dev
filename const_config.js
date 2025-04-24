/*======================
 * Enchantment Definitions
 *======================*/
/* 
 * Master enchantment object containing all custom enchants
 * Structure for each enchant:
 * - id: Unique identifier
 * - group: Compatibility group number
 * - name: Display name with formatting
 * - type: Enchant category (Buff/Curse/Trade Off)
 * - maxLvl: Maximum achievable level
 * - description: Detailed effect description
 * - cost: Point cost for application
 * - enchantOn: Valid item types
 * - rarity: Enchantment rarity tier
 */

export const enchants = {  
    aetherExchange: {  
        id: 10,  
        group: "1000",  
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
        group: "999",  
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
        group: "998",  
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
        group: "899",  
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
        group: "997",  
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
        group: "996",  
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
        group: "899",  
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
        group: "995",  
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
        group: "994",  
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
        group: "799",  
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
        group: "500",  
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
        group: "300",  
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
        group: "301",  
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
        group: "799",  
        name: "§5Ender Hunter",  
        type: "Buff",  
        maxLvl: 3,  
        description: "Enhances your bow or crossbow for attacks against Endermen. At Level 1, Endermen take only 60% of your normal damage (-40% penalty), while at Level 3 they take 120% (+20% bonus). Level 2 offers an intermediate effect (-10%)",  
        cost: 2500,  
        enchantOn: ["ranged", "trident"],  
        rarity: "epic",
        breakLevel: true         
    },  
    manaBarrier: {  
        id: 24,  
        group: "302",  
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
        group: "399",  
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
        group: "799",  
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
        group: "666",  
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
        group: "667",  
        name: "§cCurse of Slippery",  
        type: "Curse",  
        maxLvl: 1,  
        description: "Makes items occasionally slip from your hand. The item is randomly dropped while using tools or weapons.",  
        cost: -7000,  
        enchantOn: ["weapons", "ranged", "tool"],  
        rarity: "rare"  
    },  
    // curseOfIncompatibility has been removed  
    enlightenment: {  
        id: 30,  
        group: "307",  
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
        group: "900",  
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
        group: "901",  
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
        group: "333",  
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
        group: "333",  
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
        group: "334",  
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
        group: "333",  
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
        group: "799",  
        name: "§6Mark & Burst",  
        type: "Buff",  
        maxLvl: 1,  
        description: "Marks an enemy on the first shot. On the second shot, triggers an explosion causing 500% AoE explosion based on normal damage.",  
        cost: 9000,  
        enchantOn: ["ranged"],  
        rarity: "legendary"  
    }  
};






//ITEM TAGS
export const weaponTagMapping = {
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





// Structures
export const structures = {
  village: {
    id: "village",
    lootLevel: 3,
    maxEnchants: 2,
    aenchants: [27, 28, 15, 16, 17, 21]
  },

  mineshaft: {
    id: "mineshaft",
    lootLevel: 3,
    maxEnchants: 7,
    aenchants: [27, 28, 17, 19, 22, 35, 24]
  },

  ocean_ruin: {
    id: "ocean_ruin",
    lootLevel: 4,
    maxEnchants: 3,
    aenchants: [31, 13, 33, 34, 21]
  },

  shipwreck: {
    id: "shipwreck",
    lootLevel: 4,
    maxEnchants: 3,
    aenchants: [31, 28, 13, 33]
  },

  pillager_outpost: {
    id: "pillager_outpost",
    lootLevel: 4,
    maxEnchants: 4,
    aenchants: [27, 15, 26, 36, 24]
  },

  ruined_portal: {
    id: "ruined_portal",
    lootLevel: 10,
    maxEnchants: 6,
    aenchants: [30, 19, 20, 23, 21]
  },

  igloo: {
    id: "igloo",
    lootLevel: 4,
    maxEnchants: 2,
    aenchants: [27, 22, 33, 34, 35]
  },

  witch_hut: {
    id: "witch_hut",
    lootLevel: 8,
    maxEnchants: 2,
    aenchants: [11, 12, 24]
  },

  desert_pyramid: {
    id: "desert_pyramid",
    lootLevel: 6,
    maxEnchants: 5,
    aenchants: [27, 32, 35, 21]
  },

  jungle_pyramid: {
    id: "jungle_pyramid",
    lootLevel: 8,
    maxEnchants: 5,
    aenchants: [27, 12, 15, 18]
  },

  stronghold: {
    id: "stronghold",
    lootLevel: 13,
    maxEnchants: 7,
    aenchants: [27, 30, 20, 23, 25, 36, 21]
  },

  woodland_mansion: {
    id: "woodland_mansion",
    lootLevel: 5,
    maxEnchants: 8,
    aenchants: [27, 12, 18, 22, 26, 36]
  },

  nether_fortress: {
    id: "nether_fortress",
    lootLevel: 12,
    maxEnchants: 10,
    aenchants: [30, 32, 35, 24]
  },

  bastion_remnant: {
    id: "bastion_remnant",
    lootLevel: 12,
    maxEnchants: 12,
    aenchants: [30, 19, 32, 24]
  },

  end_city: {
    id: "end_city",
    lootLevel: 20,
    maxEnchants: 15,
    aenchants: [10, 11, 30, 12, 19, 20, 23, 26, 29, 36, 21]
  }
};





//=========================LORE====================
export const loreLibrary = {
    uniqueEquipment: {
        
    },
    normalEquipment: {
        
    }
};

export const rarityLibrary = {
    common: {
        weight: 50,
        id: 0,
        name: "§7Common"
    },
    uncommon: {
        weight: 30,
        id: 1,
        name: "§aUncommon"
    },
    rare: {
        weight: 15,
        id: 2,
        name: "§9Rare"
    },
    epic: {
        weight: 5,
        id: 3,
        name: "§5Epic"
    },
    legendary: {
        weight: 1,
        id: 4,
        name: "§6Legendary"
    },
    mythic: {
        weight: 0.5,
        id: 5,
        name: "§dMythic"
    }
};


//stats of items
export const materials = {
    
};

export const uniqueItemsStats {
    
};




//PLACEHOLDERS FOR REPLACING LORE
export const placeholdersRPLV = [
   "{DAMAGE}",
   "{MANA_CONSUME}",
   "{STAMINA_CONSUME}",
   "{HEALTH_BONUS}",
   "{DEFENSE_BONUS}",
   "{SPEED_BONUS}",
   "{ATTACK_SPEED}",
   "{CRITICAL_CHANCE}",
   "{CRITICAL_DAMAGE}",
   "{DURABILITY}",
   "{RANGE}",
   "{KNOCKBACK}"
];


