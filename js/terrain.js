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
        
        GRID_SIZE = 16;
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
                            gameState.terrain[y][x] = 'water';
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
 
// ====== LEVEL 6: GREMLIN SWARM ======
if (gameState.currentLevel === 6) {
    console.log("Generating Level 6: Gremlin Swarm");
    
    GRID_SIZE = 16;
    gameState.terrain = [];
    
    // Define the maze layout (W = mountain-pass wall, ' ' = normal path)
    const maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
        [1,1,1,1,0,0,1,1,1,1,0,0,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Convert the maze array to terrain
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // 1 = mountain-pass (wall), 0 = normal (path)
            gameState.terrain[y][x] = maze[y][x] === 1 ? 'mountain-pass' : 'normal';
        }
    }
    
    console.log("Level 6: Fixed maze layout loaded");
    return;
}

  // ====== LEVEL 7: THE MISTY LOWLANDS ======
if (gameState.currentLevel === 7) {
    console.log("Generating Level 7: The Misty Lowlands");
    
    GRID_SIZE = 16;
    gameState.terrain = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
        gameState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            // Create a path through the valley
            // Mountains cluster on left (where you came from)
            // Water pools form in low areas
            // Forest fills the middle ground
            
            const distanceFromLeft = x;
            const distanceFromRight = GRID_SIZE - 1 - x;
            
            // Base probabilities
            let mountainChance = 0.30;
            let forestChance = 0.25;
            let waterChance = 0.15;
            let normalChance = 0.30;
            
            // Adjust based on position
            if (x < 5) { // Left side - more mountains (where you came from)
                mountainChance += 0.2;
                forestChance -= 0.1;
                normalChance -= 0.1;
            } else if (x > 10) { // Right side - more forest (where you're going)
                forestChance += 0.15;
                mountainChance -= 0.1;
                normalChance -= 0.05;
            }
            
            // Middle area - water pools form in valleys between mountains
            if (x >= 5 && x <= 10 && y >= 5 && y <= 10) {
                if (Math.random() < 0.3) {
                    waterChance += 0.2;
                    normalChance -= 0.2;
                }
            }
            
            const rand = Math.random();
            let cumulative = 0;
            
            cumulative += mountainChance;
            if (rand < cumulative) {
                gameState.terrain[y][x] = 'mountain';
                continue;
            }
            
            cumulative += forestChance;
            if (rand < cumulative) {
                gameState.terrain[y][x] = 'forest';
                continue;
            }
            
            cumulative += waterChance;
            if (rand < cumulative) {
                gameState.terrain[y][x] = 'water';
                continue;
            }
            
            gameState.terrain[y][x] = 'normal';
        }
    }
    
    console.log("Generated Level 7: Misty Lowlands terrain");
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
	console.log("Current difficulty multiplier:", gameState.difficultyMultiplier);
    
    // Clear existing units
    gameState.units = [];
    
    // ====== CREATE PLAYER UNITS ======
    const playerClasses = ['Knight', 'Archer', 'Berserker', 'Mage'];
    
    if (gameState.persistentUnits.length > 0) {
        // Use persistent units from previous levels
        gameState.persistentUnits.forEach(unit => {
            unit.attacksUsed = 0;
            if (unit.classType === 'mage') {
                unit.attacksUsed = 0;
            }
            gameState.units.push(unit);
        });
        
        // Position player units
        for (let i = 0; i < gameState.units.length; i++) {
            const unit = gameState.units[i];
            unit.x = 2 + (i % 3);
            unit.y = 5 + Math.floor(i / 3) * 3;
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.acted = false;
            unit.fleeing = false;
        }
    } else {
        // Create new player units for first level
        for (let i = 0; i < UNITS_PER_TEAM; i++) {
            const className = playerClasses[i % playerClasses.length];
            
            // Random spawn positions for player units
            let spawnX, spawnY;
            let attempts = 0;
            let validPosition = false;
            
            while (!validPosition && attempts < 50) {
                spawnX = Math.floor(Math.random() * 8);
                spawnY = 3 + Math.floor(Math.random() * 10);
                
                validPosition = !getUnitAt(spawnX, spawnY) && 
                               gameState.terrain[spawnY][spawnX] !== 'water' &&
                               gameState.terrain[spawnY][spawnX] !== 'river' &&
                               gameState.terrain[spawnY][spawnX] !== 'mountain-pass';
                attempts++;
            }
            
            if (!validPosition) {
                spawnX = 2 + (i % 3);
                spawnY = 5 + Math.floor(i / 2) * 3;
            }
            
            const unit = new Unit('player', className, spawnX, spawnY);
            gameState.units.push(unit);
        }
    }
    
    // ====== CREATE ENEMY UNITS USING COMPOSITION TABLE ======
    const level = LEVELS[gameState.currentLevel - 1];
    const baseEnemyCount = UNITS_PER_TEAM + level.extraEnemies;
    let finalEnemyCount = Math.round(baseEnemyCount * gameState.difficultyMultiplier);
    if (finalEnemyCount < 1) finalEnemyCount = 1;
    
    console.log(`Difficulty: ${gameState.difficulty} (${gameState.difficultyMultiplier}x), Base enemies: ${baseEnemyCount}, Final: ${finalEnemyCount}`);
    
    // Get composition for current level
    const composition = ENEMY_COMPOSITION[gameState.currentLevel] || ENEMY_COMPOSITION[1];
    
    // First, calculate minimum guaranteed units
    let guaranteedUnits = [];
    composition.forEach(config => {
        for (let i = 0; i < config.min; i++) {
            guaranteedUnits.push({
                type: config.type,
                name: config.name,
                isBoss: config.isBoss || false
            });
        }
    });
    
    // Calculate how many additional units we need
    const additionalNeeded = Math.max(0, finalEnemyCount - guaranteedUnits.length);
    let additionalUnits = [];
    
    // Generate additional units based on percentage chances
    for (let i = 0; i < additionalNeeded; i++) {
        const pool = [];
        composition.forEach(config => {
            if (config.chance > 0) {
                const weight = Math.max(1, Math.round(config.chance / 10));
                for (let w = 0; w < weight; w++) {
                    pool.push({
                        type: config.type,
                        name: config.name,
                        isBoss: config.isBoss || false
                    });
                }
            }
        });
        
        if (pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            additionalUnits.push(pool[randomIndex]);
        }
    }
    
    // Combine guaranteed and additional units
    const enemyTypes = [...guaranteedUnits, ...additionalUnits];
    
    // Shuffle the array for random placement order
    for (let i = enemyTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [enemyTypes[i], enemyTypes[j]] = [enemyTypes[j], enemyTypes[i]];
    }
    
    console.log(`Creating ${enemyTypes.length} enemies for Level ${gameState.currentLevel}:`, enemyTypes);
    
    // Create all the enemies
    for (let i = 0; i < enemyTypes.length; i++) {
        const enemyInfo = enemyTypes[i];
        const baseName = enemyInfo.name;
        
        // Start enemy units on the right side
        let spawnX, spawnY;
        let attempts = 0;
        let validPosition = false;
        
        while (!validPosition && attempts < 50) {
            spawnX = 8 + Math.floor(Math.random() * 8);
            spawnY = 3 + Math.floor(Math.random() * 10);
            
            validPosition = !getUnitAt(spawnX, spawnY) && 
                           gameState.terrain[spawnY] && 
                           gameState.terrain[spawnY][spawnX] !== 'water' &&
                           gameState.terrain[spawnY][spawnX] !== 'river' &&
                           gameState.terrain[spawnY][spawnX] !== 'mountain-pass';
            attempts++;
        }
        
        if (!validPosition) {
            spawnX = 12 + (i % 3);
            spawnY = 3 + Math.floor(i / 2) * 4;
        }
        
        const unit = new Unit('enemy', baseName, spawnX, spawnY);
        unit.classType = enemyInfo.type;
        
        // Scale enemies based on level
        unit.maxHp += level.enemyBonus;
        unit.hp = unit.maxHp;
        if (unit.attack > 0) {
            unit.attack += Math.floor(level.enemyBonus / 2);
        }
        
        // Boss gets extra buffs
        if (enemyInfo.isBoss) {
            unit.maxHp *= 1.5;
            unit.hp = unit.maxHp;
            unit.attack *= 1.5;
            unit.name = generateRandomName('enemy', baseName, true);
            unit.morale = 150;
            unit.isBoss = true;
            unit.movement += 1;
            unit.maxActions += 1;
            unit.remainingActions = unit.maxActions;
        }
        
        gameState.units.push(unit);
    }
    
    resetBattleCounters();    
    return;
}

async function moveUnit(unit, newX, newY) {
    // Prevent moving into water OR river OR mountain-pass
    if (gameState.terrain[newY][newX] === 'water' || 
        gameState.terrain[newY][newX] === 'river' || 
        gameState.terrain[newY][newX] === 'mountain-pass') {
        logMessage("Cannot move there!", 'system');
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
        
        // Deduct AP per tile
        unit.useAction();
        
        // Update the display after each step
        updateSelectedUnitStats();
        
        // Visual update for animation
        await renderAll([unit.id]);
        await delay(50);
    }
    
    // Now check destination separately
    if (getUnitAt(destination.x, destination.y) && 
        !(getUnitAt(destination.x, destination.y).id === unit.id)) {
        logMessage("Destination is occupied!", 'system');
        return;
    }
    
    // Log only the destination movement (once at the end)
    logMessage(`${unit.name} moves from (${startX}, ${startY}) to (${destination.x}, ${destination.y}).`, 
               unit.type === 'player' ? 'player' : 'enemy');       
    
    // Final visual update
    await renderAll([unit.id]);
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
   
// Move unit toward target using full movement with obstacle avoidance
async function moveTowardTarget(unit, targetX, targetY, aggressive = true, canMoveThroughUnits = false) {
    const movesLeft = unit.movement - unit.movesUsed;
    if (movesLeft <= 0 || unit.remainingActions <= 0) return;
    
    console.log(`${unit.name} moving toward (${targetX}, ${targetY}) with ${movesLeft} moves left`);
    
    if (unit.type === 'enemy') {
        logMessage(`${unit.name} advances toward the enemy.`, 'enemy');
    }
    
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
        
                // Calculate preferred direction toward target
        let preferredDX = 0, preferredDY = 0;
        if (currentX < targetX) preferredDX = 1;
        else if (currentX > targetX) preferredDX = -1;

        if (currentY < targetY) preferredDY = 1;
        else if (currentY > targetY) preferredDY = -1;

        // Create prioritized directions list
        const directionPriority = [];
        
        // Add horizontal direction toward target (ALWAYS first)
        if (preferredDX !== 0) {
            directionPriority.push({dx: preferredDX, dy: 0});
        }
        
        // Add vertical direction toward target (ALWAYS second)
        if (preferredDY !== 0) {
            directionPriority.push({dx: 0, dy: preferredDY});
        }
        
        // Add remaining directions in RANDOM order (for unpredictability)
        const otherDirections = [
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 0, dy: 1},
            {dx: 0, dy: -1}
        ].filter(dir => {
            // Remove directions we already added
            return !directionPriority.some(d => d.dx === dir.dx && d.dy === dir.dy);
        });
        
        // Shuffle the remaining directions randomly
        for (let i = otherDirections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherDirections[i], otherDirections[j]] = [otherDirections[j], otherDirections[i]];
        }
        
        // Add shuffled other directions
        directionPriority.push(...otherDirections);
        
        // Try directions in priority order
        let moved = false;
        for (const dir of directionPriority) {
            const tryX = currentX + dir.dx;
            const tryY = currentY + dir.dy;
            
            if (tryX >= 0 && tryX < GRID_SIZE && 
                tryY >= 0 && tryY < GRID_SIZE &&
                (canMoveThroughUnits || !getUnitAt(tryX, tryY)) && 
                gameState.terrain[tryY][tryX] !== 'water' &&
                gameState.terrain[tryY][tryX] !== 'river' &&
                gameState.terrain[tryY][tryX] !== 'mountain-pass') { 
                
                currentX = tryX;
                currentY = tryY;
                moved = true;
                break;
            }
        }
        
        if (!moved) {
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
        
        // Deduct AP per step
        unit.useAction();
        
        // Visual update
        await renderAll([unit.id]);
        await delay(50);
        
        // Check if we're now in attack range
        if (unit.attack > 0) {
            const distance = Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
            if (distance <= unit.range) {
                console.log(`${unit.name} reached attack range!`);
                break;
            }
        }
    }
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
    if (unit.x < targetX) dx = -1;
    else if (unit.x > targetX) dx = 1;
    
    if (unit.y < targetY) dy = -1;
    else if (unit.y > targetY) dy = 1;
    
    // Try to move in opposite direction
    const tryX = unit.x + dx;
    const tryY = unit.y + dy;
    
    if (tryX >= 0 && tryX < GRID_SIZE && 
        tryY >= 0 && tryY < GRID_SIZE &&
        !getUnitAt(tryX, tryY) && 
        gameState.terrain[tryY][tryX] !== 'water' &&
        gameState.terrain[tryY][tryX] !== 'river' &&
        gameState.terrain[tryY][tryX] !== 'mountain-pass') { 
        
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
      
// Make terrain functions available globally
window.generateTerrain = generateTerrain;
window.createUnits = createUnits;
window.moveUnit = moveUnit;
window.moveAlongPath = moveAlongPath;
window.moveTowardTarget = moveTowardTarget;
window.hasPathWithinRange = hasPathWithinRange;
window.getNearestPlayer = getNearestPlayer;
window.moveAwayFromTarget = moveAwayFromTarget;
