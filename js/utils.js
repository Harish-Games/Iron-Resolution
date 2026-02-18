// Iron Resolution UTILS.js

       // ========== GAME CONFIG ==========
        let GRID_SIZE = 16;
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
    { name: "Darkwood Approach", difficulty: "Medium", enemyBonus: 0, extraEnemies: -2, boss: false },
    { name: "Forest Outpost", difficulty: "Medium", enemyBonus: 2, extraEnemies: 1, boss: false, hasRiver: true },
    { name: "Mountain Pass", difficulty: "Medium", enemyBonus: 3, extraEnemies: -1, boss: false },
    { name: "Mountain Fortress", difficulty: "Hard", enemyBonus: 4, extraEnemies: 4, boss: true },
	{ name: "Gremlin Swarm", difficulty: "easy", enemyBonus: 0, extraEnemies: -5, boss: false }, // 6 base + 9 extra = 15 gremlins should be 9
	{ name: "The Misty Lowlands", difficulty: "Medium", enemyBonus: 2, extraEnemies: -4, boss: false },  // should be 2
    { name: "The Swamp of Sorrows", difficulty: "Hard", enemyBonus: 3, extraEnemies: 6, boss: false }
];
        
     // ========== ENEMY UNIT COMPOSITION BY LEVEL ==========
const ENEMY_COMPOSITION = {
    1: [ // Level 1 - Training Grounds
        { type: 'knight', min: 2, chance: 50, name: 'Orc Knight' },
        { type: 'archer', min: 1, chance: 30, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 0, name: 'Goblin Mage' },
        { type: 'berserker', min: 1, chance: 20, name: 'Troll Berserker' },
        { type: 'gremlin', min: 0, chance: 0, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    2: [ // Level 2 - Darkwood Approach
        { type: 'knight', min: 1, chance: 40, name: 'Orc Knight' },
        { type: 'archer', min: 2, chance: 60, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 0, name: 'Goblin Mage' },
        { type: 'berserker', min: 0, chance: 0, name: 'Troll Berserker' },
        { type: 'gremlin', min: 0, chance: 0, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    3: [ // Level 3 - Forest Outpost
        { type: 'knight', min: 1, chance: 30, name: 'Orc Knight' },
        { type: 'archer', min: 1, chance: 35, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 15, name: 'Goblin Mage' },
        { type: 'berserker', min: 1, chance: 20, name: 'Troll Berserker' },
        { type: 'gremlin', min: 0, chance: 0, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    4: [ // Level 4 - Mountain Pass
        { type: 'knight', min: 1, chance: 35, name: 'Orc Knight' },
        { type: 'archer', min: 1, chance: 30, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 15, name: 'Goblin Mage' },
        { type: 'berserker', min: 1, chance: 20, name: 'Troll Berserker' },
        { type: 'gremlin', min: 0, chance: 0, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    5: [ // Level 5 - Mountain Fortress (Boss Level)
        { type: 'knight', min: 2, chance: 35, name: 'Orc Knight' },
        { type: 'archer', min: 1, chance: 25, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 15, name: 'Goblin Mage' },
        { type: 'berserker', min: 1, chance: 25, name: 'Troll Berserker' },
        { type: 'gremlin', min: 0, chance: 0, name: 'Gremlin' },
        { type: 'boss', min: 1, chance: 5, name: 'Boss', isBoss: true }
    ],
    6: [ // Level 6 - Gremlin Swarm
        { type: 'knight', min: 0, chance: 0, name: 'Orc Knight' },
        { type: 'archer', min: 2, chance: 15, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 0, name: 'Goblin Mage' },
        { type: 'berserker', min: 0, chance: 0, name: 'Troll Berserker' },
        { type: 'gremlin', min: 10, chance: 85, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    7: [ // Level 7 - The Misty Lowlands
        { type: 'knight', min: 1, chance: 20, name: 'Orc Knight' },
        { type: 'archer', min: 1, chance: 20, name: 'Goblin Archer' },
        { type: 'mage', min: 0, chance: 0, name: 'Goblin Mage' },
        { type: 'berserker', min: 1, chance: 20, name: 'Troll Berserker' },
        { type: 'gremlin', min: 2, chance: 40, name: 'Gremlin' },
        { type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
    ],
    8: [ // Level 8 - The Swamp of Sorrows
		{ type: 'gremlin', min: 3, chance: 35, name: 'Gremlin' },
		{ type: 'archer', min: 2, chance: 30, name: 'Goblin Archer' },
		{ type: 'mage', min: 1, chance: 15, name: 'Goblin Mage' },
		{ type: 'knight', min: 1, chance: 10, name: 'Orc Knight' },
		{ type: 'berserker', min: 1, chance: 10, name: 'Troll Berserker' },
		{ type: 'boss', min: 0, chance: 0, name: 'Boss', isBoss: true }
	]
};
        
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
            },
            'mountain-pass': {
				name: "Mountain Pass",
				icon: 'images/mountain-pass.webp',
				accuracyAgainst: 0,
				damageReduction: 0,
				offensiveAccuracy: 0,
				movementPenalty: 999 // Impassable like water
},
            
        };
 
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        function getTile(x, y) {
            return document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
        }
        
        function getUnitAt(x, y) {
            return gameState.units.find(u => u.x === x && u.y === y);
        }
        
   function isInMovementRange(x, y, unit) {
    const movesLeft = unit.movement - unit.movesUsed;
    
    // Quick checks
    if (x === unit.x && y === unit.y) return false;
    if (gameState.terrain[y][x] === 'water') return false;
    if (gameState.terrain[y][x] === 'river') return false;
    if (gameState.terrain[y][x] === 'mountain-pass') return false;
    if (getUnitAt(x, y)) return false;
    if (movesLeft <= 0) return false;
    
    // Use BFS to find if there's ANY path within movement range
    return hasPathWithinRange(unit.x, unit.y, x, y, movesLeft);
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
            if (gameState.terrain[newY][newX] === 'water' || 
                gameState.terrain[newY][newX] === 'river' || 
                gameState.terrain[newY][newX] === 'mountain-pass') {
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
        
        function isInRange(x, y, unit, range) {
            const distance = Math.abs(x - unit.x) + Math.abs(y - unit.y);
            return distance <= range;
        }
        
       function updateSelectedUnitStats() {
    // Update the selected unit display when stats change
    if (gameState.selectedUnit) {
        updateSelectedUnitDisplay();
    }
}
        
     function updatePhaseIndicator() {
    const indicator = document.getElementById('phaseIndicator');
    const turnValue = document.getElementById('turnPhase');
    
    if (!indicator || !turnValue) return;
    
    // Clear existing classes
    indicator.className = 'stat-box turn-stat';
    turnValue.className = 'stat-value turn-value';
    
    // Set based on current player
    if (gameState.currentPlayer === 'player') {
        indicator.classList.add('player-turn');
        turnValue.textContent = 'Player';
    } else {
        indicator.classList.add('enemy-turn');
        turnValue.textContent = 'Enemy';
    }
}
        
        function updateUI() {
           const unit = gameState.selectedUnit;
    
    attackBtn.disabled = !unit || !unit.canAttack;
    healBtn.disabled = !unit || !unit.canHeal;
    cancelBtn.disabled = !gameState.selectedUnit;
            
        }
        
        function updateUnitStats() {
    // Update the selected unit display when stats change
    if (gameState.selectedUnit) {
        updateSelectedUnitDisplay();
    }
}
        
        function updateEnemiesCounter() {
    const activeEnemies = gameState.units.filter(u =>
        u.type === 'enemy' && u.hp > 0 && !u.fleeing
    );
    if (enemiesLeftEl) {
        enemiesLeftEl.textContent = activeEnemies.length;
    }
}
  
   function updateUnitRoster() {
    const rosterList = document.getElementById('unitRosterList');
    if (!rosterList) return;
    
    // Get all player units and calculate total XP
    const playerUnits = gameState.units
        .filter(u => u.type === 'player')
        .map(unit => {
            // Calculate total cumulative XP
            const totalXp = getCumulativeXpForLevel(unit.level) + unit.xp;
            return {
                unit: unit,
                totalXp: totalXp
            };
        });
    
    // Sort by total XP (highest first = MVP at top)
    playerUnits.sort((a, b) => b.totalXp - a.totalXp);
    
    // Clear existing roster
    rosterList.innerHTML = '';
    
    // Add each unit to roster (now sorted)
    playerUnits.forEach(({ unit, totalXp }) => {
        const unitElement = createRosterUnitElement(unit, totalXp);
        rosterList.appendChild(unitElement);
    });
}

function createRosterUnitElement(unit, totalXp = 0) {
    const div = document.createElement('div');
    div.className = 'roster-unit';
    div.dataset.unitId = unit.id;
    
    // Add click handler to select this unit
    div.addEventListener('click', () => {
        const clickedUnit = gameState.units.find(u => u.id === unit.id);
        if (clickedUnit) {
            selectUnit(clickedUnit);
        }
    });
    
    // Determine status
    let status = '';
    let statusClass = '';
    if (unit.hp <= 0) {
        status = 'DEAD';
        statusClass = 'dead';
    } else if (unit.hp < unit.maxHp * 0.3) {
        status = 'CRITICAL';
        statusClass = 'critical';
    } else if (unit.hp < unit.maxHp * 0.6) {
        status = 'INJURED';
        statusClass = 'injured';
    } else if (unit.fleeing) {
        status = 'FLEEING';
        statusClass = 'fleeing';
    }
    
    // Get class icon
    const classIcon = getClassIconForRoster(unit.classType);
    
    // Build HTML - NOW WITH HITS/KILLS
    // Build HTML - SHOW HEALS FOR MAGES, HITS FOR OTHERS
let combatStats = '';
if (unit.classType === 'mage') {
    combatStats = `
        <span class="roster-heals-badge">${unit.healsPerformed}H</span>
        <span class="roster-kills-badge">${unit.kills}K</span>
    `;
} else {
    combatStats = `
        <span class="roster-hits-badge">${unit.hitsLanded}H</span>
        <span class="roster-kills-badge">${unit.kills}K</span>
    `;
}

div.innerHTML = `
    <div class="roster-unit-icon">${classIcon}</div>
    <div class="roster-unit-info">
        <div class="roster-unit-name">${unit.name}</div>
        <div class="roster-unit-stats">
            <span class="roster-unit-level">L${unit.level}</span>
            ${combatStats}
            <span class="roster-unit-xp">${totalXp}</span>
            <span class="roster-unit-hp">${unit.hp}/${unit.maxHp}</span>
        </div>
    </div>
    ${status ? `<div class="roster-unit-status ${statusClass}">${status}</div>` : ''}
`;
    
    // Highlight if this is the selected unit
    if (gameState.selectedUnit && gameState.selectedUnit.id === unit.id) {
        div.classList.add('selected');
    }
    
    // Add MVP star for highest XP unit
    if (isMvpUnit(unit.id)) {
        div.classList.add('mvp');
    }
    
    return div;
}

// Keep the original getClassIconForRoster function
function getClassIconForRoster(classType) {
    // Simple text icons for now
    switch(classType) {
        case 'knight': return 'K';
        case 'archer': return 'A';
        case 'mage': return 'M';
        case 'berserker': return 'B';
        default: return '?';
    }
}

// Helper: Check if unit has highest XP
function isMvpUnit(unitId) {
    const playerUnits = gameState.units.filter(u => u.type === 'player');
    if (playerUnits.length === 0) return false;
    
    // Find unit with highest total XP
    let maxXp = -1;
    let mvpUnitId = null;
    
    playerUnits.forEach(unit => {
        const totalXp = getCumulativeXpForLevel(unit.level) + unit.xp;
        if (totalXp > maxXp) {
            maxXp = totalXp;
            mvpUnitId = unit.id;
        }
    });
    
    return unitId === mvpUnitId;
}



// Helper: Get cumulative XP for a level
function getCumulativeXpForLevel(level) {
    const xpTable = {
        1: 0,
        2: 100,
        3: 250,
        4: 475,
        5: 812,
        6: 1317,
        7: 2074,
        8: 3209,
        9: 4911
    };
    return xpTable[level] || 0;
}
  
// Make sure these are available globally
window.ENEMY_COMPOSITION = ENEMY_COMPOSITION;
window.LEVELS = LEVELS;
window.TERRAIN_EFFECTS = TERRAIN_EFFECTS;
