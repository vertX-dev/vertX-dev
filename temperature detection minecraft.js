import { world, system } from "@minecraft/server";

// Utility functions for scoreboard operations
function setscoreb(player, objective, value) {
    try {
        player.runCommand(`scoreboard players set @s ${objective} ${value}`);
    } catch (error) {
        console.warn(`Error setting scoreboard ${objective}:`, error);
    }
}

function upscoreb(player, objective, value) {
    try {
        player.runCommand(`scoreboard players add @s ${objective} ${value}`);
    } catch (error) {
        console.warn(`Error updating scoreboard ${objective}:`, error);
    }
}

function getScoreboardValue(objective, target) {
    try {
        const scoreboardObj = world.scoreboard.getObjective(objective);
        if (!scoreboardObj) {
            console.warn(`Scoreboard objective "${objective}" does not exist`);
            return 0;
        }
        
        return scoreboardObj.getScore(target.scoreboardIdentity);
    } catch (error) {
        console.error(`Error getting scoreboard value for ${objective}:`, error);
        return 0;
    }
}

// --- Simplified random number generator ---
function createSeededRandom(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let currentSeed = seed;
    
    return function() {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m;
    };
}

// --- Simplex noise implementation ---
const grad2 = [
   1, 1,  -1, 1,   1, -1,  -1, -1,
   1, 0,  -1, 0,   1,  0,  -1,  0,
   0, 1,   0, -1,  0,  1,   0, -1
];

function buildPermutationTable(random) {
    if (typeof random !== 'function') {
        throw new Error('Random function required');
    }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 0; i < 256; i++) {
        const j = Math.floor(random() * (256 - i)) + i;
        [perm[i], perm[j]] = [perm[j], perm[i]];
        perm[i + 256] = perm[i];
    }
    return perm;
}

function createNoise2D(random = Math.random) {
    if (typeof random !== 'function') {
        throw new Error('Invalid random function');
    }
    
    const perm = buildPermutationTable(random);
    const permGrad2 = new Float64Array(512 * 2);
    
    for (let i = 0; i < 512; i++) {
        const idx = (perm[i] % 12) * 2;
        permGrad2[i*2] = grad2[idx];
        permGrad2[i*2+1] = grad2[idx+1];
    }
    
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    
    return function noise2D(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new Error('Coordinates must be numbers');
        }
        
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t, Y0 = j - t;
        const x0 = x - X0, y0 = y - Y0;
        
        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2*G2;
        const y2 = y0 - 1 + 2*G2;
        
        let n0 = 0, n1 = 0, n2 = 0;
        
        let t0 = 0.5 - x0*x0 - y0*y0;
        if (t0 >= 0) {
            const gi0 = ((i & 255) + perm[j & 255]) & 511;
            t0 *= t0;
            n0 = t0 * t0 * (permGrad2[gi0*2] * x0 + permGrad2[gi0*2+1] * y0);
        }
        
        let t1 = 0.5 - x1*x1 - y1*y1;
        if (t1 >= 0) {
            const gi1 = (((i + i1) & 255) + perm[(j + j1) & 255]) & 511;
            t1 *= t1;
            n1 = t1 * t1 * (permGrad2[gi1*2] * x1 + permGrad2[gi1*2+1] * y1);
        }
        
        let t2 = 0.5 - x2*x2 - y2*y2;
        if (t2 >= 0) {
            const gi2 = (((i + 1) & 255) + perm[(j + 1) & 255]) & 511;
            t2 *= t2;
            n2 = t2 * t2 * (permGrad2[gi2*2] * x2 + permGrad2[gi2*2+1] * y2);
        }
        
        return 70 * (n0 + n1 + n2);
    };
}

// Store world seed and initialize it from any player that has the seed tags
let worldSeed;

// Load seed on script start

function getTemperatureAt(x, z, seed) {
    if (typeof x !== 'number' || typeof z !== 'number' || typeof seed !== 'number') {
        throw new Error('Invalid parameters: x, z, and seed must be numbers');
    }
    
    try {
        // For negative seeds, keep the negativity in the calculation
        const rng = createSeededRandom(seed); // Remove seed adjustment, use raw seed value
        const noise2D = createNoise2D(rng);
        
        let sum = 0, amp = 1, freq = 1/512, max = 0;
        
        for (let o = 0; o < 4; o++) {
            sum += noise2D(x * freq, z * freq) * amp;
            max += amp;
            amp *= 0.5;
            freq *= 2;
        }
        
        return Math.max(0, Math.min(1, (sum / max + 1) / 2));
    } catch (error) {
        console.error('Error generating temperature:', error);
        return 0;
    }
}

// Command handling
world.beforeEvents.chatSend.subscribe((ev) => {
    const message = ev.message.trim();
    const sender = ev.sender;

    if (!message.startsWith(".setseed") && !message.startsWith(".temp")) {
        return;
    }

    try {
        ev.cancel = true;

        if (message.startsWith(".setseed")) {
            handleSetSeed(sender, message);
        }
    } catch (error) {
        console.error('Error in command handling:', error);
        sender.sendMessage("§cAn error occurred while processing the command");
    }
});

// Modified handleSetSeed function to handle large numbers
function handleSetSeed(player, message) {
    const args = message.split(/\s+/);
    if (args.length !== 2) {
        player.sendMessage("§cUsage: .setseed <number>");
        return;
    }

    if (getScoreboardValue("owner", player) === 0) {
        player.sendMessage("");
        return;
    }

    try {
        // Parse as BigInt first to handle large numbers
        const bigSeed = BigInt(args[1]);
        // Convert to Number for actual use, but preserve the original string
        const seed = Number(bigSeed);
        const originalSeedStr = args[1];

        system.runTimeout(() => {
            try {
                // Use the original string value for the tag to preserve exact number
                const seedTag = `worldSeed_${originalSeedStr}`;
                const signTag = `seedSign_${seed < 0 ? 'neg' : 'pos'}`;

                // Remove old tags
                const oldTags = player.getTags();
                for (const tag of oldTags) {
                    if (tag.startsWith("worldSeed_") || tag.startsWith("seedSign_")) {
                        player.runCommand(`tag @s remove "${tag}"`);
                    }
                }

                // Add new tags
                player.runCommand(`tag @s add "${seedTag}"`);
                player.runCommand(`tag @s add "${signTag}"`);
                
                // Store the seed value
                worldSeed = seed;
                world.sendMessage(`§aWorld seed set to: ${originalSeedStr}`);
            } catch (error) {
                console.error('Error in tag operations:', error);
                world.sendMessage("§cError setting seed tags.");
            }
        }, 1);
    } catch (error) {
        console.error('Error in handleSetSeed:', error);
        player.sendMessage("§cError: Invalid seed number");
    }
}

// Modified loadSeedFromPlayers function to handle large numbers
function loadSeedFromPlayers() {
    try {
        const players = world.getAllPlayers();
        for (const player of players) {
            const tags = player.getTags();
            let seedStr = null;
            let isNegative = false;
            
            for (const tag of tags) {
                if (tag.startsWith("worldSeed_")) {
                    seedStr = tag.replace("worldSeed_", "");
                } else if (tag === "seedSign_neg") {
                    isNegative = true;
                }
            }
            
            if (seedStr !== null) {
                try {
                    // Convert to Number for use in the system
                    let seed = Number(seedStr);
                    if (isNegative) seed = -seed;
                    worldSeed = seed;
                    console.log(`Loaded world seed: ${isNegative ? '-' : ''}${seedStr}`);
                    return true;
                } catch (error) {
                    console.error('Error converting seed:', error);
                }
            }
        }
        return false;
    } catch (error) {
        console.error('Error loading seed from players:', error);
        return false;
    }
}

// Weather tracking
world.afterEvents.weatherChange.subscribe((weatherData) => {
    try {
        let weatherType = 0; // Default: clear
        if (weatherData.newWeather == "Rain") {
            weatherType = 1;
        }
        if (weatherData.newWeather == "Thunder") {
            weatherType = 2;
        }
        
        const players = world.getAllPlayers();
        for (const player of players) {
            try {
                player.runCommand(`scoreboard players set @s weather ${weatherType}`);
            } catch (error) {
                console.error('Error setting weather score for player:', error);
            }
        }
    } catch (error) {
        console.error('Error in weather change event:', error);
    }
});
// Improved weather and season system with monthly seasons
system.runInterval(() => {
    let players = world.getAllPlayers();
    for (let player of players) {
        // Update time and season
        const time = world.getTimeOfDay();
        const days = world.getDay();
        
        // Monthly system (12 values instead of 4)
        // Each month is 30 days, for a 360 day year
        const monthIndex = Math.floor((days % 360) / 30);
        
        setscoreb(player, "timeofday", time);
        setscoreb(player, "month", monthIndex);
        loadSeedFromPlayers();

        if (worldSeed !== undefined) {
            const pos = player.location;
            const baseTemp = getTemperatureAt(Math.floor(pos.x), Math.floor(pos.z), worldSeed);
            const month = getScoreboardValue("month", player);
            const weather = getScoreboardValue("weather", player);
            
            // Convert base temperature to Celsius (-20 to 35)
            const baseCelsius = (baseTemp * 55) - 20;

            // Monthly temperature profiles (12 values) for reference points
            // Cold biome temperatures (more extreme winters, moderate summers)
            const coldBiomeMonthly = [
                -25,  // January: Extremely cold
                -22,  // February: Very cold
                -15,  // March: Cold
                -5,   // April: Cool
                5,    // May: Mild
                10,   // June: Warm
                12,   // July: Warmest
                10,   // August: Warm
                5,    // September: Mild
                -5,   // October: Cool
                -15,  // November: Cold
                -20   // December: Very cold
            ];
            
            // Moderate biome temperatures (balanced seasons)
            const moderateBiomeMonthly = [
                -15,  // January: Cold
                -12,  // February: Cold
                -5,   // March: Cool
                5,    // April: Mild
                12,   // May: Warm
                18,   // June: Hot
                20,   // July: Hottest
                18,   // August: Hot
                12,   // September: Warm
                5,    // October: Mild
                -5,   // November: Cool
                -12   // December: Cold
            ];
            
            // Hot biome temperatures (mild winters, extreme summers)
            const hotBiomeMonthly = [
                5,    // January: Mild
                8,    // February: Mild
                12,   // March: Warm
                18,   // April: Warm
                25,   // May: Hot
                30,   // June: Very hot
                35,   // July: Extremely hot
                32,   // August: Very hot
                25,   // September: Hot
                18,   // October: Warm
                12,   // November: Warm
                8     // December: Mild
            ];
            
            // Create a smooth interpolation between the three temperature profiles
            // based on the base temperature of the biome
            
            // Calculate interpolation factors
            let coldFactor = 0;
            let moderateFactor = 0;
            let hotFactor = 0;
            
            if (baseCelsius <= -10) {
                // Pure cold biome
                coldFactor = 1;
            } else if (baseCelsius < 0) {
                // Transition from cold to moderate
                coldFactor = (-baseCelsius) / 10;
                moderateFactor = 1 - coldFactor;
            } else if (baseCelsius <= 10) {
                // Transition from moderate to hot
                moderateFactor = (10 - baseCelsius) / 10;
                hotFactor = 1 - moderateFactor;
            } else {
                // Pure hot biome
                hotFactor = 1;
            }
            
            // Smoothly interpolate between the different monthly temperature profiles
            // using the calculated factors
            const seasonMod = Math.round(
                (coldBiomeMonthly[month] * coldFactor) +
                (moderateBiomeMonthly[month] * moderateFactor) +
                (hotBiomeMonthly[month] * hotFactor)
            );

            // Weather modifiers
            const weatherMod = [2, -5, -10][weather] ?? 0;

            // Time of day modifier
            // Full day cycle is 24000 ticks
            const timeOfDay = time % 24000;
            let timeMod = 0;

            if (timeOfDay < 6000) { // Morning (0-6000)
                timeMod = -5 + (timeOfDay / 6000) * 10; // -5 to +5
            } else if (timeOfDay < 12000) { // Day (6000-12000)
                timeMod = 5; // Peak temperature
            } else if (timeOfDay < 18000) { // Evening (12000-18000)
                timeMod = 5 - ((timeOfDay - 12000) / 6000) * 10; // +5 to -5
            } else { // Night (18000-24000)
                timeMod = -5; // Coldest
            }

            // Calculate final temperature with all modifiers
            // Use seasonMod directly instead of biomeMod since we're now selecting the appropriate
            // temperature curve based on biome type
            const finalTemp = Math.round(baseCelsius + seasonMod + weatherMod + timeMod);

            setscoreb(player, "temp", finalTemp);

            const tempCategory = 
                finalTemp < -25 ? "Freezing" :
                finalTemp < -15 ? "Very Cold" :
                finalTemp < 5 ? "Cold" :
                finalTemp < 15 ? "Moderate" :
                finalTemp < 25 ? "Warm" :
                finalTemp < 35 ? "Hot" : "Very Hot";

            player.onScreenDisplay.setActionBar(
                `§bTemp: §f${finalTemp}°C §7(${tempCategory})`
            );
        }
    }
}, 20);