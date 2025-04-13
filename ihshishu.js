/**
 * Enhanced Enchantments System for Minecraft Bedrock
 * Version: 3.0.0
 * Minecraft Compatibility: 1.18.0-beta and above
 * 
 * This system provides a modular, optimized framework for custom enchantments
 * in Minecraft Bedrock Edition using the Scripting API.
 */

import { world, system, ItemStack } from "@minecraft/server";
import { MinecraftEnchantmentTypes } from "@minecraft/server";

// ===================================================================
// Configuration Section
// ===================================================================
const CONFIG = {
  debug: false,                   // Enable debug mode for additional logging
  tickInterval: 5,                // How often to check for enchantment effects (in ticks)
  maxCustomEnchantLevel: 5,       // Maximum level for custom enchantments
  enchantmentTagPrefix: "ench_",  // Prefix for enchantment tags
};

// Separate cooldown manager to improve memory management
const CooldownManager = {
  _cooldowns: new Map(),
  
  /**
   * Check if an enchantment is on cooldown for a player
   * @param {string} playerId - The player's unique ID
   * @param {string} enchantmentId - The enchantment ID
   * @returns {boolean} - Whether the enchantment is on cooldown
   */
  isOnCooldown(playerId, enchantmentId) {
    const key = `${playerId}_${enchantmentId}`;
    return this._cooldowns.has(key) && this._cooldowns.get(key) > system.currentTick;
  },

  /**
   * Set a cooldown for an enchantment for a player
   * @param {string} playerId - The player's unique ID
   * @param {string} enchantmentId - The enchantment ID
   * @param {number} duration - The cooldown duration in ticks
   */
  setCooldown(playerId, enchantmentId, duration) {
    const key = `${playerId}_${enchantmentId}`;
    this._cooldowns.set(key, system.currentTick + duration);
  },
  
  /**
   * Clean up expired cooldowns to prevent memory leaks
   * Should be called periodically
   */
  cleanup() {
    const currentTick = system.currentTick;
    for (const [key, expiration] of this._cooldowns.entries()) {
      if (expiration <= currentTick) {
        this._cooldowns.delete(key);
      }
    }
  }
};

// ===================================================================
// Utility Functions
// ===================================================================
const Utils = {
  /**
   * Log a message to the console if debug mode is enabled
   * @param {string} message - The message to log
   */
  log(message) {
    if (CONFIG.debug) {
      console.warn(`[Enchants] ${message}`);
    }
  },

  /**
   * Check if an item has a specific enchantment
   * @param {ItemStack} item - The item to check
   * @param {string} enchantmentId - The enchantment ID to check for
   * @returns {boolean} - Whether the item has the enchantment
   */
  hasEnchantment(item, enchantmentId) {
    if (!item) return false;
    
    // Check for vanilla enchantments
    try {
      const enchantments = item.getComponent("minecraft:enchantments")?.enchantments;
      if (enchantments?.hasEnchantment(enchantmentId)) {
        return true;
      }
    } catch (e) {
      this.log(`Error checking vanilla enchantment: ${e}`);
    }
    
    // Check for custom enchantments via tag
    return item.hasTag(`${CONFIG.enchantmentTagPrefix}${enchantmentId}`);
  },

  /**
   * Get the level of an enchantment on an item
   * @param {ItemStack} item - The item to check
   * @param {string} enchantmentId - The enchantment ID to check
   * @returns {number} - The enchantment level, or 0 if not present
   */
  getEnchantmentLevel(item, enchantmentId) {
    if (!item) return 0;

    try {
      // Check for vanilla enchantments
      const enchantments = item.getComponent("minecraft:enchantments")?.enchantments;
      if (enchantments?.hasEnchantment(enchantmentId)) {
        return enchantments.getEnchantment(enchantmentId).level;
      }

      // For custom enchantments, parse the level from tag if available
      const customTag = `${CONFIG.enchantmentTagPrefix}${enchantmentId}`;
      if (item.hasTag(customTag)) {
        const levelTag = item.getTags().find(tag => tag.startsWith(`${customTag}_level_`));
        if (levelTag) {
          const level = parseInt(levelTag.split('_').pop());
          return isNaN(level) ? 1 : level;
        }
        return 1; // Default to level 1 if no level tag is found
      }
    } catch (e) {
      this.log(`Error getting enchantment level: ${e}`);
    }
    
    return 0;
  },

  /**
   * Add a custom enchantment to an item
   * @param {ItemStack} item - The item to enchant
   * @param {string} enchantmentId - The enchantment ID to add
   * @param {number} level - The level to set (defaults to 1)
   * @returns {boolean} - Whether the enchantment was successfully added
   */
  addCustomEnchantment(item, enchantmentId, level = 1) {
    if (!item) return false;
    
    try {
      // Validate level
      level = Math.min(Math.max(1, level), CONFIG.maxCustomEnchantLevel);
      
      // Remove any existing level tags for this enchantment
      const customTag = `${CONFIG.enchantmentTagPrefix}${enchantmentId}`;
      item.getTags()
        .filter(tag => tag.startsWith(`${customTag}_level_`))
        .forEach(tag => item.removeTag(tag));
        
      // Add the enchantment tag and level tag
      item.addTag(customTag);
      item.addTag(`${customTag}_level_${level}`);
      
      return true;
    } catch (e) {
      this.log(`Error adding custom enchantment: ${e}`);
      return false;
    }
  },

  /**
   * Get a random number between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} - A random integer
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * Calculate distance between two positions
   * @param {object} pos1 - First position {x, y, z}
   * @param {object} pos2 - Second position {x, y, z}
   * @returns {number} - The distance between positions
   */
  getDistance(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) +
      Math.pow(pos1.y - pos2.y, 2) +
      Math.pow(pos1.z - pos2.z, 2)
    );
  },
  
  /**
   * Get adjacent block positions
   * @param {object} pos - The center position {x, y, z}
   * @returns {Array<object>} - Array of adjacent positions
   */
  getAdjacentPositions(pos) {
    return [
      { x: pos.x + 1, y: pos.y, z: pos.z },
      { x: pos.x - 1, y: pos.y, z: pos.z },
      { x: pos.x, y: pos.y + 1, z: pos.z },
      { x: pos.x, y: pos.y - 1, z: pos.z },
      { x: pos.x, y: pos.y, z: pos.z + 1 },
      { x: pos.x, y: pos.y, z: pos.z - 1 }
    ];
  }
};

// ===================================================================
// Enchantment Registry
// ===================================================================
const EnchantmentRegistry = {
  _enchantments: {},

  /**
   * Register a new enchantment
   * @param {Enchantment} enchantment - The enchantment object
   * @returns {boolean} - Whether registration was successful
   */
  register(enchantment) {
    if (!enchantment.id) {
      Utils.log("Failed to register enchantment: missing ID");
      return false;
    }

    this._enchantments[enchantment.id] = enchantment;
    Utils.log(`Registered enchantment: ${enchantment.id}`);
    return true;
  },

  /**
   * Get an enchantment by ID
   * @param {string} id - The enchantment ID
   * @returns {Enchantment|undefined} - The enchantment object or undefined
   */
  get(id) {
    return this._enchantments[id];
  },

  /**
   * Get all registered enchantments
   * @returns {Object<string, Enchantment>} - All registered enchantments
   */
  getAll() {
    return this._enchantments;
  },
  
  /**
   * Check if an enchantment is registered
   * @param {string} id - The enchantment ID
   * @returns {boolean} - Whether the enchantment is registered
   */
  has(id) {
    return id in this._enchantments;
  }
};

// ===================================================================
// Enchantment Base Class
// ===================================================================
class Enchantment {
  /**
   * Create a new enchantment
   * @param {Object} options - Enchantment configuration
   * @param {string} options.id - Unique identifier for the enchantment
   * @param {string} options.name - Display name of the enchantment
   * @param {string} options.description - Description of what the enchantment does
   * @param {number} options.maxLevel - Maximum level this enchantment can reach
   * @param {number} options.weight - Rarity weight for loot generation (higher = more common)
   * @param {boolean} options.isCustom - Whether this is a custom or vanilla enchantment
   * @param {number} options.cooldown - Cooldown duration in ticks between activations
   * @param {string[]} options.incompatibleWith - IDs of enchantments this cannot be combined with
   * @param {string[]} options.applicableItems - Item type patterns this can be applied to
   */
  constructor(options = {}) {
    this.id = options.id || "";
    this.name = options.name || "Unknown Enchantment";
    this.description = options.description || "";
    this.maxLevel = options.maxLevel || 3;
    this.weight = options.weight || 5; // Rarity weight for loot generation
    this.isCustom = options.isCustom !== undefined ? options.isCustom : true;
    this.cooldown = options.cooldown || 0; // Cooldown in ticks
    this.incompatibleWith = options.incompatibleWith || [];
    this.applicableItems = options.applicableItems || [];
  }

  /**
   * Check if this enchantment can be applied to an item
   * @param {ItemStack} item - The item to check
   * @returns {boolean} - Whether the enchantment can be applied
   */
  canApplyTo(item) {
    if (!item) return false;
    
    // If no restrictions, can apply to anything
    if (this.applicableItems.length === 0) return true;
    
    // Check if the item matches any of the applicable types
    const itemId = item.typeId;
    return this.applicableItems.some(type => itemId.includes(type));
  }

  /**
   * Handle when a player attacks an entity with an item having this enchantment
   * @param {object} event - The attack event
   * @param {number} level - The enchantment level
   * @returns {void}
   */
  onAttack(event, level) {
    // Override in derived classes
  }

  /**
   * Handle when a player is attacked while wearing armor with this enchantment
   * @param {object} event - The hurt event
   * @param {number} level - The enchantment level
   * @returns {void}
   */
  onDefend(event, level) {
    // Override in derived classes
  }

  /**
   * Handle passive effects that occur while an item with this enchantment is equipped
   * @param {object} player - The player entity
   * @param {ItemStack} item - The enchanted item
   * @param {number} level - The enchantment level
   * @returns {void}
   */
  onTick(player, item, level) {
    // Override in derived classes
  }

  /**
   * Handle when a player uses an item with this enchantment
   * @param {object} event - The item use event
   * @param {number} level - The enchantment level
   * @returns {void}
   */
  onUse(event, level) {
    // Override in derived classes
  }

  /**
   * Handle when a block is broken with a tool having this enchantment
   * @param {object} event - The block break event
   * @param {number} level - The enchantment level
   * @returns {void}
   */
  onBreakBlock(event, level) {
    // Override in derived classes
  }
}

// ===================================================================
// Custom Enchantment Implementations
// ===================================================================

/**
 * Frost Aspect Enchantment
 * Slows enemies and deals frost damage on hit
 */
class FrostAspect extends Enchantment {
  constructor() {
    super({
      id: "frost_aspect",
      name: "Frost Aspect",
      description: "Slows enemies and deals frost damage",
      maxLevel: 3,
      cooldown: 20, // 1 second
      applicableItems: ["sword", "axe"],
      incompatibleWith: ["minecraft:fire_aspect"]
    });
  }

  onAttack(event, level) {
    const player = event.source;
    const target = event.entity;
    
    if (!player || !target || CooldownManager.isOnCooldown(player.id, this.id)) return;

    try {
      // Apply slowness effect
      target.addEffect("slowness", 20 * level, { amplifier: level - 1 });
      
      // Apply damage based on level (0.5 hearts per level)
      target.applyDamage(level, { cause: "freezing" });
      
      // Particle and sound effects
      const location = target.location;
      player.dimension.spawnParticle("minecraft:snowflake_particle", location, { amount: 15 * level });
      player.playSound("random.glass", { pitch: 1.2, volume: 0.5 });
      
      // Set cooldown to prevent spam
      CooldownManager.setCooldown(player.id, this.id, this.cooldown);
    } catch (e) {
      Utils.log(`Error in FrostAspect.onAttack: ${e}`);
    }
  }
}

/**
 * Life Steal Enchantment
 * Absorbs health from enemies on hit
 */
class LifeSteal extends Enchantment {
  constructor() {
    super({
      id: "life_steal",
      name: "Life Steal",
      description: "Absorbs health from enemies on hit",
      maxLevel: 3,
      cooldown: 60, // 3 seconds
      applicableItems: ["sword"]
    });
  }

  onAttack(event, level) {
    const player = event.source;
    const damage = event.damage;
    
    if (!player || CooldownManager.isOnCooldown(player.id, this.id)) return;
    
    try {
      // Calculate healing (percentage of damage dealt)
      const healAmount = Math.min((damage * 0.1 * level), 4); // Cap at 2 hearts
      
      if (healAmount > 0) {
        // Heal the player
        const healthComponent = player.getComponent("health");
        if (!healthComponent) return;
        
        const currentHealth = healthComponent.current;
        const maxHealth = healthComponent.value;
        
        if (currentHealth < maxHealth) {
          healthComponent.setCurrent(Math.min(currentHealth + healAmount, maxHealth));
          
          // Visual feedback
          const location = player.location;
          player.dimension.spawnParticle("minecraft:heart_particle", location, { amount: level * 2 });
          player.playSound("random.drink", { pitch: 1.5, volume: 0.5 });
        }
        
        // Set cooldown
        CooldownManager.setCooldown(player.id, this.id, this.cooldown);
      }
    } catch (e) {
      Utils.log(`Error in LifeSteal.onAttack: ${e}`);
    }
  }
}

/**
 * Thorns Aura Enchantment
 * Damages nearby enemies when player is hit
 */
class ThornsAura extends Enchantment {
  constructor() {
    super({
      id: "thorns_aura",
      name: "Thorns Aura",
      description: "Damages nearby enemies when you're hit",
      maxLevel: 3,
      cooldown: 200, // 10 seconds
      applicableItems: ["chestplate"]
    });
  }

  onDefend(event, level) {
    const player = event.hurtEntity;
    
    if (!player || CooldownManager.isOnCooldown(player.id, this.id)) return;
    
    try {
      // Get entities within a radius based on enchantment level
      const radius = 2 + level;
      const location = player.location;
      const entities = player.dimension.getEntities({
        location: location,
        maxDistance: radius,
        excludeTypes: ["item", "xp_orb", "player"]
      });
      
      if (entities.length > 0) {
        // Damage nearby entities
        const damage = level;
        
        entities.forEach(entity => {
          entity.applyDamage(damage, { cause: "thorns" });
        });
        
        // Visual effects
        player.dimension.spawnParticle("minecraft:crit_particle", location, { 
          amount: 30,
          speed: 0.1,
          minVolume: [radius * -1, 0, radius * -1],
          maxVolume: [radius, 2, radius]
        });
        
        player.playSound("random.thorns", { pitch: 1.0, volume: 0.8 });
        
        // Set cooldown
        CooldownManager.setCooldown(player.id, this.id, this.cooldown);
      }
    } catch (e) {
      Utils.log(`Error in ThornsAura.onDefend: ${e}`);
    }
  }
}

/**
 * Lumberjack Enchantment
 * Breaks entire trees at once when breaking a log
 */
class Lumberjack extends Enchantment {
  constructor() {
    super({
      id: "lumberjack",
      name: "Lumberjack",
      description: "Breaks entire trees at once",
      maxLevel: 3,
      cooldown: 10, // 0.5 second cooldown
      applicableItems: ["axe"]
    });
  }

  onBreakBlock(event, level) {
    const player = event.player;
    const block = event.block;
    
    if (!player || !block || CooldownManager.isOnCooldown(player.id, this.id)) return;
    
    // Check if the broken block is a log
    if (!block.typeId.includes("log")) return;
    
    try {
      // Define search parameters
      const maxBlocks = 10 * level; // Max blocks to break based on level
      const maxDistance = 15; // Maximum distance to search from original block
      
      // Set of already checked positions to avoid rechecking
      const checkedPositions = new Set();
      // Queue of positions to check, starting with neighbors of the broken block
      const queue = Utils.getAdjacentPositions(block.location);
      
      let brokenCount = 0;
      
      // Process queue until empty or we've broken max blocks
      while (queue.length > 0 && brokenCount < maxBlocks) {
        const pos = queue.shift();
        
        // Skip if we've already checked this position
        const posKey = `${pos.x},${pos.y},${pos.z}`;
        if (checkedPositions.has(posKey)) continue;
        checkedPositions.add(posKey);
        
        // Skip if too far from original position
        if (Utils.getDistance(block.location, pos) > maxDistance) continue;
        
        // Try to get block at position
        try {
          const nextBlock = player.dimension.getBlock(pos);
          
          // If it's a log block, break it and add its neighbors to the queue
          if (nextBlock && nextBlock.typeId.includes("log")) {
            // Break block with proper tool usage simulation
            nextBlock.dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air 0 destroy`);
            brokenCount++;
            
            // Add adjacent positions to the queue
            Utils.getAdjacentPositions(pos).forEach(adjPos => queue.push(adjPos));
          }
        } catch (e) {
          // Skip problematic blocks
          Utils.log(`Error processing block at ${posKey}: ${e.message}`);
        }
      }
      
      // Apply effects if blocks were broken
      if (brokenCount > 0) {
        // Apply tool damage proportional to the number of blocks broken
        const inventory = player.getComponent("inventory");
        if (inventory) {
          const item = inventory.container.getItem(player.selectedSlot);
          if (item) {
            const durability = item.getComponent("durability");
            if (durability) {
              durability.damage(Math.min(brokenCount, durability.maxDurability - durability.damage));
              inventory.container.setItem(player.selectedSlot, item);
            }
          }
        }
        
        // Set short cooldown to prevent multiple triggers
        CooldownManager.setCooldown(player.id, this.id, this.cooldown);
      }
    } catch (e) {
      Utils.log(`Error in Lumberjack.onBreakBlock: ${e}`);
    }
  }
}

// ===================================================================
// Event Handlers
// ===================================================================

/**
 * Set up all event handlers for enchantment processing
 */
function setupEventHandlers() {
  // Handle attacks with enchanted weapons
  world.afterEvents.entityHurt.subscribe(event => {
    const source = event.damageSource.damagingEntity;
    
    // Skip if not a player attack
    if (!source || source.typeId !== "minecraft:player") return;
    
    try {
      // Get the player's held item
      const inventory = source.getComponent("inventory");
      if (!inventory) return;
      
      const heldItem = inventory.container.getItem(source.selectedSlot);
      if (!heldItem) return;
      
      // Check for enchantments and trigger their effects
      Object.values(EnchantmentRegistry.getAll()).forEach(enchantment => {
        // Skip enchantments that don't apply to attacks
        if (typeof enchantment.onAttack !== "function") return;
        
        // Check if the item has this enchantment
        const level = Utils.getEnchantmentLevel(heldItem, enchantment.id);
        if (level > 0) {
          enchantment.onAttack(event, level);
        }
      });
    } catch (e) {
      Utils.log(`Error in entityHurt handler: ${e}`);
    }
  });
  
  // Handle defense with enchanted armor
  world.afterEvents.entityHurt.subscribe(event => {
    const target = event.hurtEntity;
    
    // Skip if not a player being hurt
    if (!target || target.typeId !== "minecraft:player") return;
    
    try {
      // Process armor enchantments
      const armorSlots = target.getComponent("minecraft:equippable")?.getEquipmentSlots() || [];
      
      for (const slot of armorSlots) {
        const armorItem = target.getComponent("minecraft:equippable")?.getEquipment(slot);
        if (!armorItem) continue;
        
        // Check for enchantments and trigger their effects
        Object.values(EnchantmentRegistry.getAll()).forEach(enchantment => {
          // Skip enchantments that don't apply to defense
          if (typeof enchantment.onDefend !== "function") return;
          
          // Check if the armor has this enchantment
          const level = Utils.getEnchantmentLevel(armorItem, enchantment.id);
          if (level > 0) {
            enchantment.onDefend(event, level);
          }
        });
      }
    } catch (e) {
      Utils.log(`Error in entityHurt defense handler: ${e}`);
    }
  });
  
  // Handle block breaking with enchanted tools
  world.afterEvents.blockBreak.subscribe(event => {
    const player = event.player;
    if (!player) return;
    
    try {
      // Get the player's held item
      const inventory = player.getComponent("inventory");
      if (!inventory) return;
      
      const heldItem = inventory.container.getItem(player.selectedSlot);
      if (!heldItem) return;
      
      // Check for enchantments and trigger their effects
      Object.values(EnchantmentRegistry.getAll()).forEach(enchantment => {
        // Skip enchantments that don't apply to block breaking
        if (typeof enchantment.onBreakBlock !== "function") return;
        
        // Check if the tool has this enchantment
        const level = Utils.getEnchantmentLevel(heldItem, enchantment.id);
        if (level > 0) {
          enchantment.onBreakBlock(event, level);
        }
      });
    } catch (e) {
      Utils.log(`Error in blockBreak handler: ${e}`);
    }
  });
  
  // Handle item use
  world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    const item = event.itemStack;
    
    if (!player || !item) return;
    
    try {
      // Check for enchantments and trigger their effects
      Object.values(EnchantmentRegistry.getAll()).forEach(enchantment => {
        // Skip enchantments that don't apply to item use
        if (typeof enchantment.onUse !== "function") return;
        
        // Check if the item has this enchantment
        const level = Utils.getEnchantmentLevel(item, enchantment.id);
        if (level > 0) {
          enchantment.onUse(event, level);
        }
      });
    } catch (e) {
      Utils.log(`Error in itemUse handler: ${e}`);
    }
  });
}

/**
 * Set up tick handler for passive enchantment effects
 */
function setupTickHandler() {
  // Setup a tick event to handle passive enchantment effects
  system.runInterval(() => {
    try {
      // Periodic cleanup of expired cooldowns
      CooldownManager.cleanup();
      
      // Process each online player
      for (const player of world.getAllPlayers()) {
        // Check all equipped items
        const inventory = player.getComponent("inventory");
        if (!inventory) continue;
        
        // Process main hand item
        const mainHandItem = inventory.container.getItem(player.selectedSlot);
        if (mainHandItem) {
          processItemEnchantments(player, mainHandItem);
        }
        
        // Process armor items
        const armorSlots = player.getComponent("minecraft:equippable")?.getEquipmentSlots() || [];
        for (const slot of armorSlots) {
          const armorItem = player.getComponent("minecraft:equippable")?.getEquipment(slot);
          if (armorItem) {
            processItemEnchantments(player, armorItem);
          }
        }
      }
    } catch (e) {
      Utils.log(`Error in tick handler: ${e}`);
    }
  }, CONFIG.tickInterval);
  
  // Helper function to process enchantments on an item
  function processItemEnchantments(player, item) {
    Object.values(EnchantmentRegistry.getAll()).forEach(enchantment => {
      // Skip enchantments that don't have tick effects
      if (typeof enchantment.onTick !== "function") return;
      
      // Check if the item has this enchantment
      const level = Utils.getEnchantmentLevel(item, enchantment.id);
      if (level > 0) {
        enchantment.onTick(player, item, level);
      }
    });
  }
}

// ===================================================================
// Public API
// ===================================================================
export const EnchantmentManager = {
  /**
   * Initialize the enchantment system
   * @param {Object} options - Optional configuration settings
   * @param {boolean} options.debug - Enable debug mode
   * @param {number} options.tickInterval - Tick interval for passive effects
   * @param {number} options.maxCustomEnchantLevel - Maximum level for custom enchantments
   */
  initialize(options = {}) {
    // Apply custom configuration if provided
    if (options.debug !== undefined) CONFIG.debug = options.debug;
    if (options.tickInterval !== undefined) CONFIG.tickInterval = options.tickInterval;
    if (options.maxCustomEnchantLevel !== undefined) CONFIG.maxCustomEnchantLevel = options.maxCustomEnchantLevel;
    
    // Register built-in enchantments
    this.registerEnchantment(new FrostAspect());
    this.registerEnchantment(new LifeSteal());
    this.registerEnchantment(new ThornsAura());
    this.registerEnchantment(new Lumberjack());
    
    // Setup event handlers
    setupEventHandlers();
    setupTickHandler();
    
    Utils.log("Enchantment system initialized");
  },

  /**
   * Register a new custom enchantment
   * @param {Enchantment} enchantment - The enchantment to register
   * @returns {boolean} - Whether registration was successful
   */
  registerEnchantment(enchantment) {
    return EnchantmentRegistry.register(enchantment);
  },

  /**
   * Add a custom enchantment to an item
   * @param {ItemStack} item - The item to enchant
   * @param {string} enchantmentId - The enchantment ID
   * @param {number} level - The enchantment level
   * @returns {boolean} - Whether the enchantment was added successfully
   */
  addEnchantment(item, enchantmentId, level = 1) {
    if (!EnchantmentRegistry.has(enchantmentId)) {
      Utils.log(`Enchantment not found: ${enchantmentId}`);
      return false;
    }
    
    return Utils.addCustomEnchantment(item, enchantmentId, level);
  },

  /**
   * Check if an item has a specific enchantment
   * @param {ItemStack} item - The item to check
   * @param {string} enchantmentId - The enchantment ID
   * @returns {boolean} - Whether the item has the enchantment
   */
  hasEnchantment(item, enchantmentId) {
    return Utils.hasEnchantment(item, enchantmentId);
  },

  /**
   * Get the level of an enchantment on an item
   * @param {ItemStack} item - The item to check
   * @param {string} enchantmentId - The enchantment ID
   * @returns {number} - The enchantment level (0 if not present)
   */
  getEnchantmentLevel(item, enchantmentId) {
    return Utils.getEnchantmentLevel(item, enchantmentId);
  },

  /**
   * Get all registered enchantments
   * @returns {Object<string, Enchantment>} - All registered enchantments
   */
  getAllEnchantments() {
    return EnchantmentRegistry.getAll();
  },

  /**
   * Create a new enchantment
   * @param {object} options - The enchantment options
   * @returns {Enchantment} - The created enchantment
   */
  createEnchantment(options) {
    return new Enchantment(options);
  },

  /**
   * Set the debug mode
   * @param {boolean} enabled - Whether debug mode should be enabled
   */
  setDebugMode(enabled) {
    CONFIG.debug = enabled;
  }
};

// Initialize the enchantment system
EnchantmentManager.initialize();