// Iron Resolution TERRAIN.js

function resetBattleCounters() {
    console.log("Resetting battle counters...");
    gameState.units.forEach(unit => {
        unit.attacksUsed = 0;
        if (unit.classType === 'mage') {
            unit.attacksUsed = 0;
            console.log(`Reset ${unit.name} (mage) heals to 0`);
        }
    });
    
    // ALSO reset persistent units if they exist
    if (gameState.persistentUnits) {
        gameState.persistentUnits.forEach(unit => {
            if (unit.classType === 'mage') {
                unit.attacksUsed = 0;
            }
            unit.attacksUsed = 0;
        });
    }
}

// ========== TERRAIN GENERATION ==========
function generateTerrain() {
    console.log(`Generating terrain for Level ${gameState.currentLevel}`);
  
    // ====== LEVEL 2: DARKWOOD APPROACH ======
if (gameState.currentLevel === 2) {
    console.log("Generating Level 2: Darkwood Approach");
    
    // Keep full 16x16 grid but add dense forest borders
    GRID_SIZE = 16; // Keep full size
    gameState.terrain = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // Create forest borders at top and bottom
            if (y < 3 || y > GRID_SIZE - 4) {
                // Top 3 and bottom 3 rows are dense forest
                gameState.terrain[y][x] = 'forest';
            } else {
                // Middle area is a winding path
                const pathCenter = Math.floor(GRID_SIZE/2) + Math.sin(y * 0.5) * 2;
                
                if (Math.abs(x - pathCenter) <= 1) {
                    // Path - mostly normal terrain
                    gameState.terrain[y][x] = 'normal';
                } else if (Math.abs(x - pathCenter) <= 2) {
                    // Forest edges
                    gameState.terrain[y][x] = 'forest';
                } else {
                    // Dense forest on sides
                    gameState.terrain[y][x] = 'forest';
                }
                
                // Add river crossing in the middle
                if (y === 8 || y === 9) {
                    if (x >= pathCenter - 1 && x <= pathCenter + 1) {
                        gameState.terrain[y][x] = 'river';
                    }
                }
            }
        }
    }
    
    return;
}
    
    
// ====== LEVEL 3: FOREST OUTPOST (WITH RIVER BARRIER) ======
if (gameState.currentLevel === 3) {
    console.log("Generating Level 3: Forest Outpost with river barrier");
    
    GRID_SIZE = 16;
    gameState.terrain = [];
    
    // Create river barrier level
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // LEFT SIDE: Mixed terrain like Level 1 (player side)
            if (x < 7) {
                const rand = Math.random();
                if (rand < 0.3) {
                    gameState.terrain[y][x] = 'forest';
                } else if (rand < 0.35) {
                    gameState.terrain[y][x] = 'mountain';
                } else {
                    gameState.terrain[y][x] = 'normal';
                }
            }
            // MIDDLE: Single column river (column 8) with 2 crossing points
            else if (x === 8) {  // Just column 8, not 7-9
                // Create 2 bridge crossings at rows 4-5 and 10-11
                if ((y >= 4 && y <= 5) || (y >= 10 && y <= 11)) {
                    gameState.terrain[y][x] = 'normal';  // Crossing point
                } else {
                    gameState.terrain[y][x] = 'river';   // Impassable river
                }
            }
            // RIGHT SIDE: Mixed terrain (enemies defend here)
            else {
                // Random mix of forest/normal with a few mountains
                const rand = Math.random();
                if (rand < 0.4) {
                    gameState.terrain[y][x] = 'forest';
                } else if (rand < 0.45) {
                    gameState.terrain[y][x] = 'mountain';
                } else {
                    gameState.terrain[y][x] = 'normal';
                }
            }
        }
    }
    
    return;
}
    
    
    // ====== LEVEL 4: MOUNTAIN PASS (16x16 with lots of mountains) ======
if (gameState.currentLevel === 4) {
    console.log("Generating Level 4: Mountain Pass");
    
    GRID_SIZE = 16; // Standard 16x16 grid
    gameState.terrain = [];
    
    // Create very mountainous terrain with narrow passes
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // Create winding mountain passes
            const passCenter = Math.floor(GRID_SIZE/2) + Math.sin(y * 0.8) * 2;
            
            // Distance from the pass center
            const distFromPass = Math.abs(x - passCenter);
            
            if (distFromPass <= 1) {
                // Narrow pass - walkable path
                gameState.terrain[y][x] = 'normal';
            } else if (distFromPass <= 2) {
                // Rocky edges - some mountains, some rough terrain
                if (Math.random() < 0.6) {
                    gameState.terrain[y][x] = 'mountain';
                } else {
                    gameState.terrain[y][x] = 'normal';
                }
            } else {
                // Mostly impassable mountains
                if (Math.random() < 0.85) {
                    gameState.terrain[y][x] = 'mountain';
                } else {
                    // Small chance of forest or normal in mountain areas
                    if (Math.random() < 0.3) {
                        gameState.terrain[y][x] = 'forest';
                    } else {
                        gameState.terrain[y][x] = 'normal';
                    }
                }
            }
            
            // Add strategic choke points
            if (y === 5 || y === 10) {
                if (distFromPass > 1) {
                    gameState.terrain[y][x] = 'mountain';
                }
            }
            
            // Add some water features (mountain streams)
            if (y === 8 && (x === passCenter - 1 || x === passCenter + 1)) {
                if (Math.random() < 0.5) {
                    gameState.terrain[y][x] = 'river';
                }
            }
        }
    }
    
    console.log("Generated Level 4: Mountain Pass terrain");
    return;
}
    
    // ====== LEVEL 5: BOSS LEVEL - ENEMY STRONGHOLD ======
    if (gameState.currentLevel === 5) {
        console.log("Generating Level 5: Enemy Stronghold terrain");
        
        for (let y = 0; y < GRID_SIZE; y++) {
            gameState.terrain[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                // Calculate which side of the map
                const isLeftSide = x < GRID_SIZE / 2;
                const isRightSide = x >= GRID_SIZE / 2;
                
                // RANDOM BASE CHANCE
                let rand = Math.random();
                
                if (isLeftSide) {
                    // LEFT SIDE: Player approach - mix of normal/forest
                    if (rand < 0.3) {
                        gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.35) {
                        gameState.terrain[y][x] = 'mountain';
                    } else if (rand < 0.38) {
                        gameState.terrain[y][x] = 'swamp';
                    } else {
                        gameState.terrain[y][x] = 'normal';
                    }
                } 
                else { // RIGHT SIDE: Enemy territory
                    // Enemy villages and mountains concentrated here
                    if (rand < 0.20) {
                        gameState.terrain[y][x] = 'village-enemy';
                    } else if (rand < 0.55) {
                        gameState.terrain[y][x] = 'mountain';
                    } else if (rand < 0.40) {
                        gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.65) {
                        gameState.terrain[y][x] = 'water';
                    } else {
                        gameState.terrain[y][x] = 'normal';
                    }
                }
            }
        }
        
        console.log("Generated Level 5: Enemy Stronghold terrain");
 
if (typeof renderAll === 'function') {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            console.log("Rendering Level 5 terrain");
            renderAll();
            
            // Also update UI if available
            if (typeof updateUnitRoster === 'function') updateUnitRoster();
            if (typeof updateEnemiesCounter === 'function') updateEnemiesCounter();
        }, 100);
    }
    
    return;
}   

    // Create all normal terrain first
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // Calculate distance from left edge (0) and right edge (15)
            const distanceFromLeft = x;
            const distanceFromRight = GRID_SIZE - 1 - x;
            
            // Base chance for forest
            let forestChance = 0.20; // 20% base
            
            // INCREASE forest chance on RIGHT side (where enemies come from)
            if (x > GRID_SIZE / 2) { // Right half of map
                // More forest as we go further right
                const rightBias = (x - GRID_SIZE / 2) / (GRID_SIZE / 2); // 0 to 1
                forestChance += 0.4 * rightBias; // Up to 40% chance on far right
            }
            
            // DECREASE forest chance near village (left side)
            if (x < GRID_SIZE / 3) { // Left third of map
                forestChance *= 0.1; // 70% less forest near village
            }
            
            if (gameState.currentLevel === 1) {
                // Level 1: No water, more forest on right for enemy cover
                const rand = Math.random();
                
                if (rand < forestChance) {
                    gameState.terrain[y][x] = 'forest';
                } else if (rand < forestChance + 0.10) {
                    gameState.terrain[y][x] = 'mountain';
                } else {
                    gameState.terrain[y][x] = 'normal';
                }
            } else {
                // Other levels with water
                const rand = Math.random();
                if (rand < forestChance) {
                    gameState.terrain[y][x] = 'forest';
                } else if (rand < forestChance + 0.06) {
                    gameState.terrain[y][x] = 'mountain';
                } else if (rand < forestChance + 0.10) {
                    gameState.terrain[y][x] = 'water';
                } else if (rand < forestChance + 0.12) {
                    gameState.terrain[y][x] = 'river';
                } else if (rand < forestChance + 0.20) {
                    gameState.terrain[y][x] = 'village-player';
                } else {
                    gameState.terrain[y][x] = 'normal';
                }
            }
        }
    }
    
    // ====== RANDOM VILLAGE GENERATION ======
    if (gameState.currentLevel === 1) {
        // Random village size (between 8 and 14 tiles)
        const villageSize = 8 + Math.floor(Math.random() * 7);
        
        // Random village center on the left side
        // Left side = first 7 columns (0-6) and not too close to edges
        const villageCenterX = 2 + Math.floor(Math.random() * 4); // Columns 2-5
        const villageCenterY = 4 + Math.floor(Math.random() * 8); // Rows 4-11
        
        console.log(`Creating random village: ${villageSize} tiles at center (${villageCenterX}, ${villageCenterY})`);
        
        // Create village cluster using random walk algorithm
        const villageTiles = new Set();
        villageTiles.add(`${villageCenterX},${villageCenterY}`);
        
        // Add random adjacent tiles
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],  // Up, right, down, left
            [1, 1], [1, -1], [-1, 1], [-1, -1]  // Diagonals
        ];
        
        let attempts = 0;
        while (villageTiles.size < villageSize && attempts < 100) {
            attempts++;
            
            // Pick a random existing village tile to expand from
            const existingTiles = Array.from(villageTiles);
            const randomTile = existingTiles[Math.floor(Math.random() * existingTiles.length)];
            const [baseX, baseY] = randomTile.split(',').map(Number);
            
            // Try to add a random adjacent tile
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            const newX = baseX + randomDir[0];
            const newY = baseY + randomDir[1];
            
            // Check bounds - keep village on left side (x <= 6) and not too close to edges
            if (newX >= 0 && newX <= 6 && newY >= 2 && newY < GRID_SIZE - 2) {
                villageTiles.add(`${newX},${newY}`);
            }
        }
        
        // Place village tiles
        villageTiles.forEach(tile => {
            const [x, y] = tile.split(',').map(Number);
            gameState.terrain[y][x] = 'village-player';
        });
        
        console.log(`Created village with ${villageTiles.size} tiles at:`, Array.from(villageTiles));
    }
}
        
// ========== CREATE UNITS ==========
function createUnits() {

	console.log("🚨 DEBUG: createUnits() STARTED");
    console.log("Current level:", gameState.currentLevel);
    console.log("gameState:", gameState);
		
     // ====== TRAVEL LEVEL 2: DARKWOOD APPROACH ======
    if (gameState.currentLevel === 2) {
    console.log("Creating units for Level 2: Darkwood Approach");
    
    gameState.units = [];
    
    // Player units start at bottom (above the forest border)
	const playerCount = gameState.persistentUnits.length || 6;    
	for (let i = 0; i < playerCount; i++) {
        let unit;
        if (gameState.persistentUnits[i]) {
            unit = gameState.persistentUnits[i];
            // Position in bottom area (rows 11-13, above the bottom forest border)
            unit.x = 6 + (i % 3);
            unit.y = 12 - Math.floor(i / 3);
        } else {			
            const playerClasses = ['Knight', 'Archer', 'Berserker', 'Mage', 'Knight', 'Archer'];
            const className = playerClasses[i % playerClasses.length];
            unit = new Unit('player', className, 6 + (i % 3), 12 - Math.floor(i / 3));
        }
        gameState.units.push(unit);
    }

resetBattleCounters();
    
    // Enemies at top (below the top forest border)
    const travelEnemies = ['Goblin Archer', 'Goblin Archer', 'Orc Knight', 'Goblin Archer', 'Orc Knight'];
    for (let i = 0; i < travelEnemies.length; i++) {
        const unit = new Unit('enemy', travelEnemies[i], 6 + (i % 3), 3 + Math.floor(i / 3));
        
        // Make scouts a bit weaker
        unit.maxHp = Math.floor(unit.maxHp * 0.8);
        unit.hp = unit.maxHp;
        
        gameState.units.push(unit);
    }


resetBattleCounters();    
    return;
}
    
   // ====== LEVEL 4: MOUNTAIN PASS ======
if (gameState.currentLevel === 4) {
    console.log("Creating units for Level 4: Mountain Pass");
    
    gameState.units = [];
    
    // Player units start on left side (entrance to mountain pass)
	const playerCount = gameState.persistentUnits.length || 6;
    for (let i = 0; i < playerCount; i++) {
        let unit;
        if (gameState.persistentUnits[i]) {
            unit = gameState.persistentUnits[i];
            // Start at left side, near the mountain pass entrance
            unit.x = 3 + (i % 3);
            unit.y = 10 + Math.floor(i / 3) * 2;
        } else {
            const playerClasses = ['Knight', 'Archer', 'Berserker', 'Mage', 'Knight', 'Archer'];
            const className = playerClasses[i % playerClasses.length];
            unit = new Unit('player', className, 3 + (i % 3), 10 + Math.floor(i / 3) * 2);
        }
        
        // Ensure units don't spawn in mountains
        if (gameState.terrain[unit.y][unit.x] === 'mountain' || 
            gameState.terrain[unit.y][unit.x] === 'river') {
            // Move to nearest valid position
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newX = unit.x + dx;
                    const newY = unit.y + dy;
                    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE &&
                        gameState.terrain[newY][newX] !== 'mountain' &&
                        gameState.terrain[newY][newX] !== 'river' &&
                        !getUnitAt(newX, newY)) {
                        unit.x = newX;
                        unit.y = newY;
                        break;
                    }
                }
            }
        }
        
        gameState.units.push(unit);
    }


resetBattleCounters();    
    // Enemy units defend the mountain pass (fewer but tougher)
    const mountainEnemies = ['Orc Knight', 'Goblin Archer', 'Troll Berserker', 'Orc Knight', 'Goblin Archer', 'Goblin Shaman'];
    for (let i = 0; i < mountainEnemies.length; i++) {
        // Position enemies on right side, in defensive positions
        const baseName = mountainEnemies[i];
        
        // FORCE correct classType
        let forcedClassType = '';
        if (baseName.includes('Knight')) forcedClassType = 'knight';
        else if (baseName.includes('Archer')) forcedClassType = 'archer';
        else if (baseName.includes('Berserker')) forcedClassType = 'berserker';
        else if (baseName.includes('Shaman') || baseName.includes('Mage')) forcedClassType = 'mage';
        
        const unit = new Unit('enemy', baseName, 12 + (i % 3), 4 + Math.floor(i / 2) * 3);
        
        // OVERRIDE classType
        if (forcedClassType) {
            unit.classType = forcedClassType;
        }
        
        // Mountain enemies are tougher (adapted to high altitude)
        unit.maxHp = Math.floor(unit.maxHp * 1.3);
        unit.hp = unit.maxHp;
        if (unit.attack > 0) {
            unit.attack += 3;
        }
        unit.morale += 20; // Defending their home terrain
        
        // Ensure enemies don't spawn in impassable terrain
        if (gameState.terrain[unit.y][unit.x] === 'mountain' || 
            gameState.terrain[unit.y][unit.x] === 'river') {
            // Move to nearest valid position
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newX = unit.x + dx;
                    const newY = unit.y + dy;
                    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE &&
                        gameState.terrain[newY][newX] !== 'mountain' &&
                        gameState.terrain[newY][newX] !== 'river' &&
                        !getUnitAt(newX, newY)) {
                        unit.x = newX;
                        unit.y = newY;
                        break;
                    }
                }
            }
        }
        
        gameState.units.push(unit);
    }
    
    resetBattleCounters();
    
    return;
}
    
    
    const playerClasses = ['Knight', 'Archer', 'Berserker', 'Mage'];
    const enemyClasses = ['Orc Knight', 'Goblin Archer', 'Troll Berserker', 'Goblin Mage'];
    
    gameState.units = [];
    
    // Create player units - either from persistent or new
    if (gameState.persistentUnits.length > 0) {
		
		 // RESET persistent units BEFORE copying
    gameState.persistentUnits.forEach(unit => {
        unit.attacksUsed = 0;
        if (unit.classType === 'mage') {
            unit.attacksUsed = 0;
            console.log(`Reset persistent mage ${unit.name} heals to 0`);
        }
    });
		
        gameState.units = [...gameState.persistentUnits];
        
        // Position and reset player units
        for (let i = 0; i < gameState.units.length; i++) {
            const unit = gameState.units[i];
            // Start player units in the village area (left side)
            unit.x = 2 + (i % 3);
            unit.y = 5 + Math.floor(i / 3) * 3;
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.acted = false;
            unit.fleeing = false;
            
            if (unit.classType === 'mage') {
            unit.attacksUsed = 0;  // ← RESET HEALS TOO!
        }
            
            // Apply upgrades
            unit.maxHp += gameState.playerUpgrades.health * 5;
            unit.hp = unit.maxHp;
            unit.attack += gameState.playerUpgrades.damage * 2;
            unit.morale += gameState.playerUpgrades.morale * 10;
            
            // Keep within bounds
            unit.x = Math.max(0, Math.min(GRID_SIZE - 1, unit.x));
            unit.y = Math.max(0, Math.min(GRID_SIZE - 1, unit.y));
        }
    } else {
    // Create new player units for first level
    for (let i = 0; i < UNITS_PER_TEAM; i++) {
        const className = playerClasses[i % playerClasses.length];
        
        // RANDOM SPAWN POSITIONS FOR PLAYER UNITS
        let spawnX, spawnY;
        let attempts = 0;
        let validPosition = false;
        
        // Keep trying until we find a valid position
        while (!validPosition && attempts < 50) {
            if (gameState.currentLevel === 2) {
                // Level 2: Spawn on LEFT side of river (columns 0-7)
                spawnX = Math.floor(Math.random() * 8);  // Columns 0-7
                spawnY = 3 + Math.floor(Math.random() * 10); // Rows 3-12
            } else {
                // Level 1 & 3: Spawn on left side of map
                spawnX = Math.floor(Math.random() * 8);  // Columns 0-7 (left side)
                spawnY = 3 + Math.floor(Math.random() * 10); // Rows 3-12
            }
            
            // Check if position is valid
            validPosition = !getUnitAt(spawnX, spawnY) && 
                           gameState.terrain[spawnY][spawnX] !== 'water' &&
                           gameState.terrain[spawnY][spawnX] !== 'river' &&
                           spawnX >= 0 && spawnX < GRID_SIZE &&
                           spawnY >= 0 && spawnY < GRID_SIZE;
            attempts++;
        }
        
        // If we couldn't find a valid random position, use fallback positions
        if (!validPosition) {
            // Fallback to original positions
            if (gameState.currentLevel === 2) {
                spawnX = 2 + (i % 3);
                spawnY = 4 + Math.floor(i / 2) * 3;
            } else {
                spawnX = 2 + (i % 3);
                spawnY = 5 + Math.floor(i / 2) * 3;
            }
        }
        
        const unit = new Unit('player', className, spawnX, spawnY);
        
        // Additional validation (just in case)
        if (getUnitAt(unit.x, unit.y) || gameState.terrain[unit.y][unit.x] === 'water' || gameState.terrain[unit.y][unit.x] === 'river') {
            // Find nearest valid position
            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                    const checkX = unit.x + dx;
                    const checkY = unit.y + dy;
                    if (checkX >= 0 && checkX < GRID_SIZE && checkY >= 0 && checkY < GRID_SIZE &&
                        !getUnitAt(checkX, checkY) && 
                        gameState.terrain[checkY][checkX] !== 'water' &&
                        gameState.terrain[checkY][checkX] !== 'river') {
                        unit.x = checkX;
                        unit.y = checkY;
                        break;
                    }
                }
            }
        }
        
        gameState.units.push(unit);
    }
}

resetBattleCounters();
    
    // Create enemy units based on current level
const level = LEVELS[gameState.currentLevel - 1];
const enemyCount = UNITS_PER_TEAM + level.extraEnemies;
gameState.isBossLevel = level.boss;

// LEVEL 2: SPECIAL ENEMY COMPOSITION - 3 ARCHERS
if (gameState.currentLevel === 2) {
    console.log("Level 2: Creating special enemy composition with 3 archers");
    
    // Create specific enemy types for Level 2 - 6 base enemies with 3 archers
    const level2EnemyTypes = [
        'Orc Knight',
        'Goblin Archer',
        'Goblin Archer',
        'Goblin Archer',
        'Troll Berserker',
        'Goblin Shaman'
    ];
    
    // Add extra enemies if needed (Level 2 has extraEnemies: 1)
    for (let i = 0; i < level.extraEnemies; i++) {
        // Add the extra enemy - you can choose what type
        level2EnemyTypes.push('Orc Knight'); // Add another knight as the extra
    }
    
    // Now create all the enemies with random positions
    const enemyCount = UNITS_PER_TEAM + level.extraEnemies; // Should be 1
    for (let i = 0; i < enemyCount; i++) {    const baseName = level2EnemyTypes[i];
    
    // FORCE correct classType regardless of name
    let forcedClassType = '';
    if (baseName.includes('Knight')) forcedClassType = 'knight';
    else if (baseName.includes('Archer')) forcedClassType = 'archer';
    else if (baseName.includes('Berserker')) forcedClassType = 'berserker';
    else if (baseName.includes('Shaman') || baseName.includes('Mage')) forcedClassType = 'mage';
    
    // RANDOM SPAWN POSITION FOR ENEMIES
    let spawnX, spawnY;
    let attempts = 0;
    let validPosition = false;
    
    // Keep trying until we find a valid position
    while (!validPosition && attempts < 50) {
        if (gameState.currentLevel === 2) {
            // Level 2: Spawn on RIGHT side of river (columns 9-15)
            spawnX = 9 + Math.floor(Math.random() * 7);  // Columns 9-15
        } else {
            // Level 1 & 3: Spawn on right side of map
            spawnX = 8 + Math.floor(Math.random() * 8);  // Columns 8-15 (right side)
        }
        
        spawnY = 3 + Math.floor(Math.random() * 10); // Rows 3-12
        
        // Check if position is valid
        validPosition = !getUnitAt(spawnX, spawnY) && 
                       gameState.terrain[spawnY][spawnX] !== 'water' &&
                       gameState.terrain[spawnY][spawnX] !== 'river' &&
                       spawnX >= 0 && spawnX < GRID_SIZE &&
                       spawnY >= 0 && spawnY < GRID_SIZE;
        
        attempts++;
    }
    
    // If we couldn't find a valid random position, use fallback positions
    if (!validPosition) {
        spawnX = 12 + (i % 3);
        spawnY = 3 + Math.floor(i / 2) * 4;
    }
    
    const unit = new Unit('enemy', baseName, spawnX, spawnY);
    
    // OVERRIDE classType to ensure correct icon and AI behavior
    if (forcedClassType) {
        unit.classType = forcedClassType;
    }
    
    // Scale enemies based on level
    unit.maxHp += level.enemyBonus;
    unit.hp = unit.maxHp;
    if (unit.attack > 0) {
        unit.attack += Math.floor(level.enemyBonus / 2);
    }
    
    // Additional validation (just in case)
    if (getUnitAt(unit.x, unit.y) || gameState.terrain[unit.y][unit.x] === 'water' || gameState.terrain[unit.y][unit.x] === 'river') {
        // Find nearest valid position
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                const checkX = unit.x + dx;
                const checkY = unit.y + dy;
                if (checkX >= 0 && checkX < GRID_SIZE && checkY >= 0 && checkY < GRID_SIZE &&
                    !getUnitAt(checkX, checkY) && 
                    gameState.terrain[checkY][checkX] !== 'water' &&
                    gameState.terrain[checkY][checkX] !== 'river') {
                    unit.x = checkX;
                    unit.y = checkY;
                    break;
                }
            }
        }
    }
    
    gameState.units.push(unit);
}

resetBattleCounters();

} else if (gameState.currentLevel === 3) {
    // LEVEL 3: HARD LEVEL WITH BOSS AND EXTRA ENEMIES
    console.log("Level 3: Boss level with extra enemies");
    
    // Create enemy types for Level 3 - 6 base enemies
    const level3EnemyTypes = [
        'Orc Knight',
        'Goblin Archer', 
        'Troll Berserker',
        'Goblin Shaman',
        'Orc Knight',
        'Goblin Archer'
    ];
    
    // Add extra enemies if needed (Level 3 has extraEnemies: 2)
    for (let i = 0; i < level.extraEnemies; i++) {
        // Add more challenging enemies for Level 3
        const extraTypes = ['Troll Berserker', 'Orc Knight', 'Goblin Archer'];
        level3EnemyTypes.push(extraTypes[i % extraTypes.length]);
    }
    
    // Now create all the enemies
    for (let i = 0; i < level3EnemyTypes.length; i++) {
        const baseName = level3EnemyTypes[i];
        
        // FORCE correct classType regardless of name
        let forcedClassType = '';
        if (baseName.includes('Knight')) forcedClassType = 'knight';
        else if (baseName.includes('Archer')) forcedClassType = 'archer';
        else if (baseName.includes('Berserker')) forcedClassType = 'berserker';
        else if (baseName.includes('Shaman') || baseName.includes('Mage')) forcedClassType = 'mage';
        
        // Start enemy units on the right side (away from village)
        const unit = new Unit('enemy', baseName, 12 + (i % 3), 3 + Math.floor(i / 2) * 4);
        
        // OVERRIDE classType to ensure correct icon and AI behavior
        if (forcedClassType) {
            unit.classType = forcedClassType;
        }
        
        // Scale enemies based on level
        unit.maxHp += level.enemyBonus;
        unit.hp = unit.maxHp;
        if (unit.attack > 0) {
            unit.attack += Math.floor(level.enemyBonus / 2);
        }
        
        // Boss gets extra buffs (first enemy is boss in Level 3)
        if (level.boss && i === 0) {
            unit.maxHp *= 1.5;
            unit.hp = unit.maxHp;
            unit.attack *= 1.5;
            unit.name = generateRandomName('enemy', baseName, true);
            unit.morale = 150;
            unit.isBoss = true;
            unit.movement += 1;  // Boss gets +1 movement
            unit.maxActions += 1; // Boss gets +1 action per turn
            unit.remainingActions = unit.maxActions; // Set current actions
        }
        
        let attempts = 0;
while (getUnitAt(unit.x, unit.y) || 
       unit.y >= gameState.terrain.length || 
       unit.x >= gameState.terrain[0].length ||
       gameState.terrain[unit.y][unit.x] === 'water') {
		   // Keep enemies on the right side
            unit.x = 10 + Math.floor(Math.random() * 6);
            unit.y = 3 + Math.floor(Math.random() * 10);
            attempts++;
            if (attempts > 20) break;
        }
        
        gameState.units.push(unit);
    }
resetBattleCounters();

} else {
    // ORIGINAL CODE FOR LEVEL 1 AND ANY OTHER LEVELS
    for (let i = 0; i < enemyCount; i++) {
        const baseName = enemyClasses[i % enemyClasses.length];
        
        // FORCE correct classType regardless of name
        let forcedClassType = '';
        if (baseName.includes('Knight')) forcedClassType = 'knight';
        else if (baseName.includes('Archer')) forcedClassType = 'archer';
        else if (baseName.includes('Berserker')) forcedClassType = 'berserker';
        else if (baseName.includes('Shaman') || baseName.includes('Mage')) forcedClassType = 'mage';
        
        // Start enemy units on the right side (away from village)
        const unit = new Unit('enemy', baseName, 12 + (i % 3), 3 + Math.floor(i / 2) * 4);
        
        // OVERRIDE classType to ensure correct icon and AI behavior
        if (forcedClassType) {
            unit.classType = forcedClassType;
        }
        
        // Scale enemies based on level
        unit.maxHp += level.enemyBonus;
        unit.hp = unit.maxHp;
        if (unit.attack > 0) {
            unit.attack += Math.floor(level.enemyBonus / 2);
        }
        
        // Boss gets extra buffs (only for boss levels)
        if (level.boss && i === 0) {
            unit.maxHp *= 1.5;
            unit.hp = unit.maxHp;
            unit.attack *= 1.5;
            unit.name = generateRandomName('enemy', baseName, true);
            unit.morale = 150;
            unit.isBoss = true;
            unit.movement += 1;  // Boss gets +1 movement
            unit.maxActions += 1; // Boss gets +1 action per turn
            unit.remainingActions = unit.maxActions; // Set current actions
        }
        
        let attempts = 0;
        while (getUnitAt(unit.x, unit.y) || gameState.terrain[unit.y][unit.x] === 'water') {
            // Keep enemies on the right side
            unit.x = 10 + Math.floor(Math.random() * 6);
            unit.y = 3 + Math.floor(Math.random() * 10);
            attempts++;
            if (attempts > 20) break;
        }
        
        gameState.units.push(unit);
    }
}
}

 console.log("🚨 DEBUG: createUnits() ENDING");
    console.log("Total units created:", gameState.units.length);
    console.log("Units array:", gameState.units);
    
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
            if (gameState.terrain[newY][newX] === 'water') {
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

// Helper: Find nearest player to a position
function getNearestPlayer(x, y) {
    const players = gameState.units.filter(u => u.type === 'player' && u.hp > 0 && !u.fleeing);
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

// Helper: Move away from target (for mages retreating)
async function moveAwayFromTarget(unit, targetX, targetY) {
    const movesLeft = unit.movement - unit.movesUsed;
    if (movesLeft <= 0 || unit.remainingActions <= 0) return;
    
    console.log(`${unit.name} moving AWAY from (${targetX}, ${targetY})`);
    
    if (unit.type === 'enemy') {
        logMessage(`${unit.name} retreats from danger.`, 'enemy');
    }
    
    // Calculate direction away from target
    let dx = 0, dy = 0;
    if (unit.x < targetX) dx = -1; // Move left if target is to the right
    else if (unit.x > targetX) dx = 1; // Move right if target is to the left
    
    if (unit.y < targetY) dy = -1; // Move up if target is below
    else if (unit.y > targetY) dy = 1; // Move down if target is above
    
    // Try to move in opposite direction
    const tryX = unit.x + dx;
    const tryY = unit.y + dy;
    
    if (tryX >= 0 && tryX < GRID_SIZE && 
        tryY >= 0 && tryY < GRID_SIZE &&
        !getUnitAt(tryX, tryY) && 
	gameState.terrain[tryY][tryX] !== 'water' && 
	gameState.terrain[tryY][tryX] !== 'river') {      
        await moveUnit(unit, tryX, tryY);
    } else {
        // Can't move in ideal direction, try perpendicular
        if (dx !== 0) {
            // Try moving vertically instead
            const altX = unit.x;
            const altY = unit.y + (unit.y < targetY ? -1 : 1);
            
            if (altY >= 0 && altY < GRID_SIZE &&
    !getUnitAt(altX, altY) && 
    gameState.terrain[altY][altX] !== 'water' &&
    gameState.terrain[altY][altX] !== 'river') {
                
                await moveUnit(unit, altX, altY);
            }
        } else if (dy !== 0) {
            // Try moving horizontally instead
            const altX = unit.x + (unit.x < targetX ? -1 : 1);
            const altY = unit.y;
            
            if (altX >= 0 && altX < GRID_SIZE &&
                !getUnitAt(altX, altY) && 
                gameState.terrain[altY][altX] !== 'water' &&
				gameState.terrain[altY][altX] !== 'river') {
		
                await moveUnit(unit, altX, altY);
            }
        }
    }
}

async function moveAlongPath(unit, path) {
    // Skip first tile (current position)
    if (path.length <= 1) return;
    
    // Store starting position for the final log
    const startX = unit.x;
    const startY = unit.y;
    
    // Get destination (last tile in path)
    const destination = path[path.length - 1];
    
    // Calculate total distance moved
    const distanceMoved = path.length - 1;
    
    // Check if unit has enough movement and actions
    if (distanceMoved > (unit.movement - unit.movesUsed)) {
        logMessage("Not enough movement left!", 'system');
        return;
    }
    
    if (unit.remainingActions <= 0) {
        logMessage("No actions left!", 'system');
        return;
    }
    
    // Move along the path for animation (but don't log each step)
    for (let i = 1; i < path.length; i++) {
        const step = path[i];
        
        // Check if this step is valid
                if (gameState.terrain[step.y][step.x] === 'water' || gameState.terrain[step.y][step.x] === 'river') {
            logMessage("Cannot move through water!", 'system');
            return;
        }
        
        // Check if tile is occupied (except for the destination - we check that separately)
        const isDestination = (i === path.length - 1);
        if (!isDestination && getUnitAt(step.x, step.y)) {
            logMessage("Path is blocked!", 'system');
            return;
        }
        
        // Update unit position for this step
        unit.x = step.x;
        unit.y = step.y;
        unit.movesUsed++;
        
        // ====== FIX: DEDUCT 1 AP PER TILE! ======
        unit.useAction();
        
        // Update the display after each step
        updateSelectedUnitStats();
        
        // Visual update for animation
        await renderAll([unit.id]);
        await delay(50); // Small pause for animation
    }
    
    // Now check destination separately
    if (getUnitAt(destination.x, destination.y) && 
        !(getUnitAt(destination.x, destination.y).id === unit.id)) {
        logMessage("Destination is occupied!", 'system');
        // Move back to start? Or just leave at last valid position
        return;
    }
    
    // Log only the destination movement (once at the end)
logMessage(`${unit.name} moves from (${startX}, ${startY}) to (${destination.x}, ${destination.y}).`, 
               unit.type === 'player' ? 'player' : 'enemy');       
    
    // Final visual update
    await renderAll([unit.id]);
}

// NEW IMPROVED HELPER FUNCTION: Move unit toward target using full movement with obstacle avoidance
	async function moveTowardTarget(unit, targetX, targetY, aggressive = true) {
    const movesLeft = unit.movement - unit.movesUsed;
    if (movesLeft <= 0 || unit.remainingActions <= 0) return;
    
    console.log(`${unit.name} moving toward (${targetX}, ${targetY}) with ${movesLeft} moves left`);
    
    if (unit.type === 'enemy') {
        logMessage(`${unit.name} advances toward the enemy.`, 'enemy');
    }
    
    // For berserkers, they're aggressive - try to get as close as possible
    let currentX = unit.x;
    let currentY = unit.y;
    let stepsMoved = 0;
    
    // Try to move step by step toward target
    while (stepsMoved < movesLeft && unit.remainingActions > 0) {
        // Calculate direction
        let dx = 0, dy = 0;
        if (currentX < targetX) dx = 1;
        else if (currentX > targetX) dx = -1;
        
        if (currentY < targetY) dy = 1;
        else if (currentY > targetY) dy = -1;
        
        // Try primary direction first
        let tryX = currentX;
        let tryY = currentY;
        
        if (dx !== 0) {
            tryX = currentX + dx;
        } else if (dy !== 0) {
            tryY = currentY + dy;
        }
        
        // Check if primary move is valid
        let moved = false;
        if (tryX >= 0 && tryX < GRID_SIZE && 
            tryY >= 0 && tryY < GRID_SIZE &&
            !getUnitAt(tryX, tryY) && 
            gameState.terrain[tryY][tryX] !== 'water' &&
			gameState.terrain[tryY][tryX] !== 'river') {
            
            // Valid move - take it
            currentX = tryX;
            currentY = tryY;
            moved = true;
        } else {
            // Try alternative direction
            if (dy !== 0) {
                tryX = currentX;
                tryY = currentY + dy;
                
                if (tryX >= 0 && tryX < GRID_SIZE && 
                    tryY >= 0 && tryY < GRID_SIZE &&
                    !getUnitAt(tryX, tryY) && 
            gameState.terrain[tryY][tryX] !== 'water' &&
            gameState.terrain[tryY][tryX] !== 'river') {
                    
                    currentX = tryX;
                    currentY = tryY;
                    moved = true;
                }
            }
            
            // Calculate preferred direction toward target
let preferredDX = 0, preferredDY = 0;
if (currentX < targetX) preferredDX = 1;
else if (currentX > targetX) preferredDX = -1;

if (currentY < targetY) preferredDY = 1;
else if (currentY > targetY) preferredDY = -1;

// Create direction priorities
const directions = [];
// 1. First try preferred X direction (if any)
if (preferredDX !== 0) {
    directions.push({dx: preferredDX, dy: 0});
}
// 2. Then try preferred Y direction (if any)
if (preferredDY !== 0) {
    directions.push({dx: 0, dy: preferredDY});
}
// 3. Try other directions (avoid reversing immediately)
const allDirs = [
    {dx: 1, dy: 0},   // right
    {dx: -1, dy: 0},  // left
    {dx: 0, dy: 1},   // down
    {dx: 0, dy: -1}   // up
];

// Add remaining directions, avoiding the reverse of last move
for (const dir of allDirs) {
    if (!directions.some(d => d.dx === dir.dx && d.dy === dir.dy)) {
        // Avoid reversing direction unless absolutely necessary
        if (!(dir.dx === -unit.lastMoveDirection.dx && 
              dir.dy === -unit.lastMoveDirection.dy)) {
            directions.push(dir);
        }
    }
}

// Try directions in order
for (const dir of directions) {
    // ... existing movement code
}

// Remember this move direction
// Remember this move direction (calculate from position change)
if (currentX !== unit.x || currentY !== unit.y) {
    unit.lastMoveDirection = { 
        dx: currentX - unit.x, 
        dy: currentY - unit.y 
    };
}            
            // If still not moved, try other directions (berserkers are aggressive!)
            if (!moved) {
                const directions = [
                    {dx: 1, dy: 0},   // right
                    {dx: -1, dy: 0},  // left
                    {dx: 0, dy: 1},   // down
                    {dx: 0, dy: -1}   // up
                ];
                
                // Shuffle directions for variety
                for (const dir of directions.sort(() => Math.random() - 0.5)) {
                    tryX = currentX + dir.dx;
                    tryY = currentY + dir.dy;
                    
                    if (tryX >= 0 && tryX < GRID_SIZE && 
                        tryY >= 0 && tryY < GRID_SIZE &&
                        !getUnitAt(tryX, tryY) && 
            gameState.terrain[tryY][tryX] !== 'water' &&
            gameState.terrain[tryY][tryX] !== 'river') {
                        
                        currentX = tryX;
                        currentY = tryY;
                        moved = true;
                        break;
                    }
                }
            }
        }
        
        if (!moved) {
            // Can't move in any direction
            console.log(`${unit.name} is stuck!`);
            break;
        }
        
        stepsMoved++;
        
        // Actually move the unit
        unit.x = currentX;
        unit.y = currentY;
        unit.movesUsed++;
        
         // Update the display if this unit is selected
        if (gameState.selectedUnit && gameState.selectedUnit.id === unit.id) {
            updateSelectedUnitStats();
        }
        
        // ====== DEDUCT AP PER STEP ======
		unit.useAction();
        
        // Visual update
        await renderAll([unit.id]);
        await delay(50);
        
        // Check if we're now in attack range (for ALL attack units)
if (unit.attack > 0) { // If unit can attack
    const distance = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
    if (distance <= unit.range) {
        console.log(`${unit.name} reached attack range!`);
        break; // Stop moving, we're in range
    }
}
    }
}
        
                
        async function moveUnit(unit, newX, newY) {
        // Prevent moving into water OR river
    if (gameState.terrain[newY][newX] === 'water' || gameState.terrain[newY][newX] === 'river') {
        logMessage("Cannot move into water!", 'system');
        return;
    }
    
    const movesLeft = unit.movement - unit.movesUsed;
    
    // First check if there's ANY path at all
    if (!hasPathWithinRange(unit.x, unit.y, newX, newY, movesLeft)) {
        logMessage("No path available within movement range!", 'system');
        return;
    }
    
    // Find the actual shortest path
    const path = findShortestPath(unit.x, unit.y, newX, newY, movesLeft);
    if (!path || path.length - 1 > movesLeft) {
        logMessage("Can't move there! Path too long or blocked.", 'system');
        return;
    }
    
    // Move along the path
    await moveAlongPath(unit, path);
    
    // Update the selected unit display
    updateSelectedUnitStats();
}

// Make terrain functions available globally
window.generateTerrain = generateTerrain;
window.createUnits = createUnits;
window.moveUnit = moveUnit;
window.moveAlongPath = moveAlongPath;
window.hasPathWithinRange = hasPathWithinRange;
