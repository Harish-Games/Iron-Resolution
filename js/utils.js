// ========== GAME CONFIG ==========
const GRID_SIZE = 16;
const UNITS_PER_TEAM = 6;

// ========== RANDOM NAME GENERATOR ==========
const RANDOM_NAMES = {
    player: {
        firstNames: ["Aldric", "Bartholomew", "Cedric", "Darius", "Eldric", "Finnian", "Gawain", "Hadrian", "Ignatius", "Jorah", 
                    "Kaelen", "Lorcan", "Malachi", "Nikolai", "Osric", "Percival", "Quentin", "Roderick", "Sylas", "Thaddeus",
                    "Uther", "Valerius", "Wulfric", "Xander", "Yorick", "Zephyr", "Alistair", "Benedict", "Cassian", "Duncan"],
        lastNames: ["Ironheart", "Stonefist", "Bloodaxe", "Wolfbane", "Stormbringer", "Dragonslayer", "Blackwood", "Goldhand", 
                   "Silvermane", "Trueblade", "Grimward", "Brightshield", "Steelhart", "Oakenshield", "Fireforge", "Shadowbane",
                   "Winterborn", "Dawnbreaker", "Sunderstone", "Frostbeard", "Thunderfist", "Skullcrusher", "Soulrender", "Doomhammer"]
    },
    enemy: {
        firstNames: ["Gruk", "Snagga", "Morg", "Thrak", "Gorth", "Skarg", "Drog", "Zug", "Borg", "Krug",
                    "Snarl", "Gnash", "Rip", "Tear", "Gore", "Maul", "Rend", "Shred", "Skull", "Bone",
                    "Fester", "Rot", "Plague", "Blight", "Gloom", "Doom", "Vex", "Wrath", "Grim", "Dread"],
        lastNames: ["the Cruel", "the Vile", "the Brutal", "the Savage", "the Foul", "the Wretched", "the Despoiler", 
                   "the Destroyer", "the Corruptor", "the Defiler", "the Tormentor", "the Butcher", "the Slayer",
                   "the Marauder", "the Ravager", "the Decimator", "the Annihilator", "the Obliterator", "Blood-Drinker",
                   "Bone-Crusher", "Soul-Eater", "Flesh-Render", "Gut-Splitter", "Skull-Cracker", "Eye-Gouger"]
    },
    titles: ["the Brave", "the Bold", "the Strong", "the Wise", "the Quick", "the Cunning", "the Fierce", 
             "the Resolute", "the Unbroken", "the Steadfast", "the Vigilant", "the Honorable", "the Just",
             "the Merciless", "the Relentless", "the Unyielding", "the Immovable", "the Unstoppable", "the Indomitable"]
};

function generateRandomName(type, className = "", isBoss = false) {
    const nameSet = RANDOM_NAMES[type];
    
    if (isBoss) {
        const bossNames = ["Gorath the World-Ender", "Morgoth the Abyssal", "Xal'atath the Devourer"];
        return bossNames[Math.floor(Math.random() * bossNames.length)];
    }
    
    const firstName = nameSet.firstNames[Math.floor(Math.random() * nameSet.firstNames.length)];
    const lastName = nameSet.lastNames[Math.floor(Math.random() * nameSet.lastNames.length)];
    
    // Choose ONE modifier type, not multiple
    const options = [
        `${firstName} ${lastName}`,  // Just first + last
        `${firstName} ${lastName} ${RANDOM_NAMES.titles[Math.floor(Math.random() * RANDOM_NAMES.titles.length)]}`,  // With title
    ];
    
    if (type === 'enemy') {
        const enemyModifiers = ["the Orc", "the Goblin", "the Troll", "the Brute"];
        options.push(`${firstName} ${enemyModifiers[Math.floor(Math.random() * enemyModifiers.length)]}`);
        options.push(`${firstName} the ${lastName}`);
    }
    
    return options[Math.floor(Math.random() * options.length)];
}

// Seed generator for consistent names per session
let nameSeed = Date.now();
function seededRandom() {
    const x = Math.sin(nameSeed++) * 10000;
    return x - Math.floor(x);
}

// ========== WEAPONS & ARMOR SYSTEM (Phase 1) ==========
const WEAPONS = {
    sword: { name: "Iron Sword", damage: 3, accuracy: 5, type: "melee" },
    greatsword: { name: "Greatsword", damage: 5, accuracy: -5, type: "melee" },
    axe: { name: "Battle Axe", damage: 4, armorPen: 2, type: "melee" },
    mace: { name: "War Mace", damage: 3, stunChance: 10, type: "melee" },
    bow: { name: "Short Bow", damage: 2, range: 1, type: "ranged" },
    longbow: { name: "Longbow", damage: 3, range: 2, accuracy: 5, type: "ranged" }
};

const ARMOR = {
    leather: { name: "Leather Armor", defense: 2, dodge: 5 },
    chainmail: { name: "Chainmail", defense: 4, dodge: -5 },
    plate: { name: "Plate Armor", defense: 6, dodge: -10, movement: -1 }
};

// ========== NUMBER OF AI UNITS PER LEVEL change for testing ========== 
const LEVELS = [
    { name: "Training Grounds", difficulty: "Easy", enemyBonus: 0, extraEnemies: 0, boss: false },
    { name: "Forest Outpost", difficulty: "Medium", enemyBonus: 2, extraEnemies: 1, boss: false, hasRiver: true },
    { name: "Mountain Fortress", difficulty: "Hard", enemyBonus: 4, extraEnemies: 5, boss: true }
];

// ========== INJURIES & MORALE SYSTEM (Phase 2) ==========
const INJURIES = {
    minor_wound: { name: "Minor Wound", effect: { hp: -5 }, duration: 1 },
    broken_arm: { name: "Broken Arm", effect: { attack: -3 }, duration: 3 },
    leg_injury: { name: "Leg Injury", effect: { movement: -1 }, duration: 2 },
    concussion: { name: "Concussion", effect: { accuracy: -10 }, duration: 2 }
};

// ========== TERRAIN SYSTEM - SINGLE SOURCE OF TRUTH ==========
const TERRAIN_EFFECTS = {
    normal: {
        name: "Open Terrain",
        icon: 'images/grass.png',
        accuracyAgainst: 0,
        damageReduction: 0,
        offensiveAccuracy: 0,
        movementPenalty: 0
    },
    forest: {
        name: "Forest",
        icon: 'images/forest.png',
        accuracyAgainst: -25,
        damageReduction: 15,
        offensiveAccuracy: -25,
        movementPenalty: 0
    },
    mountain: {
        name: "Mountain",
        icon: 'images/mountain.png',
        accuracyAgainst: -15,
        damageReduction: 10,
        offensiveAccuracy: 15,
        movementPenalty: -1
    },
    swamp: {
        name: "Swamp",
        icon: 'images/swamp.png',
        accuracyAgainst: -10,
        damageReduction: -15, // Negative means damage INCREASE
        offensiveAccuracy: -40,
        movementPenalty: { knight: -1, mage: -1, archer: -2, berserker: -2 }
    },
    'village-player': {
        name: "Your Village",
        icon: 'images/village-player.png',
        accuracyAgainst: -20,
        damageReduction: 15,
        offensiveAccuracy: -15,
        movementPenalty: 0
    },
    'village-enemy': {
        name: "Enemy Camp",
        icon: 'images/village-enemy.png',
        accuracyAgainst: -15,
        damageReduction: 10,
        offensiveAccuracy: 0,
        movementPenalty: 0
    },
    water: {
        name: "Water",
        icon: 'images/water.png',
        accuracyAgainst: 0,
        damageReduction: 0,
        offensiveAccuracy: 0,
        movementPenalty: 999 // Impassable
    },
    river: {
        name: "River",
        icon: 'images/river.png',
        accuracyAgainst: 0,
        damageReduction: 0,
        offensiveAccuracy: 0,
        movementPenalty: 999 // Also impassable
    }
};

// ========== HELPER FUNCTIONS ==========
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTile(x, y) {
    return document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
}

function getUnitAt(x, y) {
    return window.gameState?.units?.find(u => u.x === x && u.y === y) || null;
}

function isInRange(x, y, unit, range) {
    const distance = Math.abs(x - unit.x) + Math.abs(y - unit.y);
    return distance <= range;
}

function findShortestPath(startX, startY, targetX, targetY, maxMoves) {
    const queue = [{x: startX, y: startY, path: [], moves: 0}];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    
    const directions = [
        {dx: 1, dy: 0},  // right
        {dx: -1, dy: 0}, // left
        {dx: 0, dy: 1},  // down
        {dx: 0, dy: -1}  // up
    ];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // Found target!
        if (current.x === targetX && current.y === targetY) {
            return [...current.path, {x: current.x, y: current.y}];
        }
        
        // Try all directions
        for (const dir of directions) {
            const newX = current.x + dir.dx;
            const newY = current.y + dir.dy;
            
            // Check bounds
            if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
                continue;
            }
            
            // Check if visited
            const key = `${newX},${newY}`;
            if (visited.has(key)) {
                continue;
            }
            
            // Check if passable
            const isTarget = (newX === targetX && newY === targetY);
            if (window.gameState?.terrain[newY][newX] === 'water') {
                continue;
            }
            
            if (!isTarget && getUnitAt(newX, newY)) {
                continue;
            }
            
            // Check movement range
            const newMoves = current.moves + 1;
            if (newMoves <= maxMoves) {
                visited.add(key);
                queue.push({
                    x: newX,
                    y: newY,
                    path: [...current.path, {x: current.x, y: current.y}],
                    moves: newMoves
                });
            }
        }
    }
    
    return null;
}

function hasPathWithinRange(startX, startY, targetX, targetY, maxMoves) {
    // Simple BFS to find any path that avoids water
    const queue = [{x: startX, y: startY, moves: 0}];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    
    const directions = [
        {dx: 1, dy: 0},  // right
        {dx: -1, dy: 0}, // left
        {dx: 0, dy: 1},  // down
        {dx: 0, dy: -1}  // up
    ];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // Found target!
        if (current.x === targetX && current.y === targetY) {
            return true;
        }
        
        // Try all directions
        for (const dir of directions) {
            const newX = current.x + dir.dx;
            const newY = current.y + dir.dy;
            
            // Check bounds
            if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
                continue;
            }
            
            // Check if visited
            const key = `${newX},${newY}`;
            if (visited.has(key)) {
                continue;
            }
            
            // Check if passable (not water/river, not occupied unless it's target)
            const isTarget = (newX === targetX && newY === targetY);
            if (window.gameState?.terrain[newY][newX] === 'water' || window.gameState?.terrain[newY][newX] === 'river') {
                continue;
            }
            
            if (!isTarget && getUnitAt(newX, newY)) {
                continue;
            }
            
            // Check movement range
            const newMoves = current.moves + 1;
            if (newMoves <= maxMoves) {
                visited.add(key);
                queue.push({x: newX, y: newY, moves: newMoves});
            }
        }
    }
    
    // No path found within movement range
    return false;
}

function isInMovementRange(x, y, unit) {
    const movesLeft = unit.movement - unit.movesUsed;
    
    // Quick checks
    if (x === unit.x && y === unit.y) return false;
    if (window.gameState?.terrain[y][x] === 'water') return false;
    if (getUnitAt(x, y)) return false;
    if (movesLeft <= 0) return false;
    
    // Use BFS to find if there's ANY path within movement range
    return hasPathWithinRange(unit.x, unit.y, x, y, movesLeft);
}

// Helper: Find nearest player to a position
function getNearestPlayer(x, y) {
    const players = window.gameState?.units?.filter(u => u.type === 'player' && u.hp > 0 && !u.fleeing) || [];
    if (players.length === 0) return null;
    
    let nearestPlayer = null;
    let minDistance = Infinity;
    
    for (const player of players) {
        const distance = Math.abs(x - player.x) + Math.abs(y - player.y);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPlayer = player;
        }
    }
    
    return nearestPlayer;
}

// XP helper functions
function getCumulativeXpForLevel(level) {
    // XP needed to reach each level from level 1
    const xpTable = {
        1: 0,
        2: 100,
        3: 250,    // 100 + 150
        4: 475,    // 100 + 150 + 225
        5: 812,    // etc.
        6: 1317,
        7: 2074,
        8: 3209,
        9: 4911
    };
    return xpTable[level] || 0;
}

function getTotalXpNeededForNextLevel(currentLevel) {
    return getCumulativeXpForLevel(currentLevel + 1);
}

function getCurrentTotalXp(unit) {
    // Current total XP = cumulative XP for current level + current XP progress
    return getCumulativeXpForLevel(unit.level) + unit.xp;
}
