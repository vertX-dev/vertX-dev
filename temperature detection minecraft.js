import { world } from "@minecraft/server";

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

// Fixed temperature sampler with custom RNG
function getTemperatureAt(x, z, seed) {
    if (typeof x !== 'number' || typeof z !== 'number' || typeof seed !== 'number') {
        throw new Error('Invalid parameters: x, z, and seed must be numbers');
    }
    
    try {
        // Use our custom seeded random number generator
        const rng = createSeededRandom(seed);
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
let worldSeed;

world.beforeEvents.chatSend.subscribe(ev => {
    try {
        const msg = ev.message.trim();
        
        if (msg.startsWith(".setseed")) {
            ev.cancel = true;
            const args = msg.split(/\s+/);
            if (args.length !== 2) {
                world.sendMessage("§cUsage: .setseed <number>");
                return;
            }
            
            const seed = Number(args[1]);
            if (isNaN(seed)) {
                world.sendMessage("§cError: Seed must be a valid number");
                return;
            }
            
            worldSeed = seed;
            world.sendMessage(`§aWorld seed set to: ${seed}`);
            
        } else if (msg.startsWith(".temp")) {
            ev.cancel = true;
            if (worldSeed === undefined) {
                world.sendMessage("§cPlease set a seed first using .setseed");
                return;
            }
            
            const args = msg.split(/\s+/);
            if (args.length !== 3) {
                world.sendMessage("§cUsage: .temp <x> <z>");
                return;
            }
            
            const x = Number(args[1]);
            const z = Number(args[2]);
            
            if (isNaN(x) || isNaN(z)) {
                world.sendMessage("§cError: Coordinates must be valid numbers");
                return;
            }
            
            try {
                const temp = getTemperatureAt(x, z, worldSeed);
                const tempCategory = 
                    temp < 0.2 ? "Very Cold" :
                    temp < 0.4 ? "Cold" :
                    temp < 0.6 ? "Moderate" :
                    temp < 0.8 ? "Warm" : "Hot";
                    
                world.sendMessage(`§bTemperature at (${x}, ${z}): §f${temp.toFixed(3)} §7(${tempCategory})`);
            } catch (error) {
                console.error('Temperature generation error:', error);
                world.sendMessage("§cError generating temperature. Check console for details.");
            }
        }
    } catch (error) {
        console.error('Error in command handling:', error);
        world.sendMessage("§cAn error occurred while processing the command");
    }
});