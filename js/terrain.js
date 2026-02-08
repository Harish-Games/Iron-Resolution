// ========== TERRAIN GENERATION ==========
function generateTerrain() {
    console.log(`Generating terrain for Level ${window.gameState.currentLevel}`);
    
    window.gameState.terrain = [];
    
    // Special generation for Level 2 (Forest Pursuit with river)
    if (LEVELS[window.gameState.currentLevel - 1]?.hasRiver) {
        // Create river barrier level
        for (let y = 0; y < GRID_SIZE; y++) {
            window.gameState.terrain[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                // LEFT SIDE: Mixed terrain like Level 1
                if (x < 7) {
                    const rand = Math.random();
                    // Same distribution as Level 1
                    if (rand < 0.3) {
                        window.gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.35) {
                        window.gameState.terrain[y][x] = 'mountain';
                    } else {
                        window.gameState.terrain[y][x] = 'normal';
                    }
                }
                // MIDDLE: Single column river (column 8) with 2 crossing points
                else if (x === 8) {  // Just column 8, not 7-9
                    // Create 2 bridge crossings
                    if ((y >= 4 && y <= 5) || (y >= 10 && y <= 11)) {
                        window.gameState.terrain[y][x] = 'normal';  // Crossing point
                    } else {
                        window.gameState.terrain[y][x] = 'river';   // Impassable river
                    }
                }
                // RIGHT SIDE: Mixed terrain (enemies defend here)
                else {
                    // Random mix of forest/normal with a few mountains
                    const rand = Math.random();
                    if (rand < 0.4) {
                        window.gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.45) {
                        window.gameState.terrain[y][x] = 'mountain';
                    } else {
                        window.gameState.terrain[y][x] = 'normal';
                    }
                }
            }
        }
        console.log("Generated Level 2 terrain with river barrier");
        return;
    }
    
    // ====== LEVEL 3: BOSS LEVEL - ENEMY STRONGHOLD ======
    if (window.gameState.currentLevel === 3) {
        console.log("Generating Level 3: Enemy Stronghold terrain");
        
        for (let y = 0; y < GRID_SIZE; y++) {
            window.gameState.terrain[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                // Calculate which side of the map
                const isLeftSide = x < GRID_SIZE / 2;
                const isRightSide = x >= GRID_SIZE / 2;
                
                // RANDOM BASE CHANCE
                let rand = Math.random();
                
                if (isLeftSide) {
                    // LEFT SIDE: Player approach - mix of normal/forest
                    if (rand < 0.3) {
                        window.gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.35) {
                        window.gameState.terrain[y][x] = 'mountain';
                    } else if (rand < 0.38) {
                        window.gameState.terrain[y][x] = 'swamp';
                    } else {
                        window.gameState.terrain[y][x] = 'normal';
                    }
                } 
                else { // RIGHT SIDE: Enemy territory
                    // Enemy villages and mountains concentrated here
                    if (rand < 0.20) {
                        window.gameState.terrain[y][x] = 'village-enemy';
                    } else if (rand < 0.55) {
                        window.gameState.terrain[y][x] = 'mountain';
                    } else if (rand < 0.40) {
                        window.gameState.terrain[y][x] = 'forest';
                    } else if (rand < 0.65) {
                        window.gameState.terrain[y][x] = 'water';
                    } else {
                        window.gameState.terrain[y][x] = 'normal';
                    }
                }
            }
        }
        
        console.log("Generated Level 3: Enemy Stronghold terrain");
        return;
    }
    
    // Create all normal terrain first
    for (let y = 0; y < GRID_SIZE; y++) {
        window.gameState.terrain[y] = [];
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
            
            if (window.gameState.currentLevel === 1) {
                // Level 1: No water, more forest on right for enemy cover
                const rand = Math.random();
                
                if (rand < forestChance) {
                    window.gameState.terrain[y][x] = 'forest';
                } else if (rand < forestChance + 0.10) {
                    window.gameState.terrain[y][x] = 'mountain';
                } else {
                    window.gameState.terrain[y][x] = 'normal';
                }
            } else {
                // Other levels with water
                const rand = Math.random();
                if (rand < forestChance) {
                    window.gameState.terrain[y][x] = 'forest';
                } else if (rand < forestChance + 0.06) {
                    window.gameState.terrain[y][x] = 'mountain';
                } else if (rand < forestChance + 0.10) {
                    window.gameState.terrain[y][x] = 'water';
                } else if (rand < forestChance + 0.12) {
                    window.gameState.terrain[y][x] = 'river';
                } else if (rand < forestChance + 0.20) {
                    window.gameState.terrain[y][x] = 'village-player';
                } else {
                    window.gameState.terrain[y][x] = 'normal';
                }
            }
        }
    }
    
    // ====== RANDOM VILLAGE GENERATION ======
    if (window.gameState.currentLevel === 1) {
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
            window.gameState.terrain[y][x] = 'village-player';
        });
        
        console.log(`Created village with ${villageTiles.size} tiles at:`, Array.from(villageTiles));
    }
}

// ========== CREATE UNITS ==========
function createUnits() {
    const playerClasses = ['Knight', 'Archer', 'Berserker', 'Mage'];
    const enemyClasses = ['Orc Knight', 'Goblin Archer', 'Troll Berserker', 'Goblin Mage'];
    
    window.gameState.units = [];
    
    // Create player units - either from persistent or new
    if (window.gameState.persistentUnits.length > 0) {
        window.gameState.units = [...window.gameState.persistentUnits];
        
        // Position and reset player units
        for (let i = 0; i < window.gameState.units.length; i++) {
            const unit = window.gameState.units[i];
            // Start player units in the village area (left side)
            unit.x = 2 + (i % 3);
            unit.y = 5 + Math.floor(i / 3) * 3;
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.acted = false;
            unit.fleeing = false;
            
            // Apply upgrades
            unit.maxHp += window.gameState.playerUpgrades.health * 5;
            unit.hp = unit.maxHp;
            unit.attack += window.gameState.playerUpgrades.damage * 2;
            unit.morale += window.gameState.playerUpgrades.morale * 10;
            
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
                if (window.gameState.currentLevel === 2) {
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
                               window.gameState.terrain[spawnY][spawnX] !== 'water' &&
                               window.gameState.terrain[spawnY][spawnX] !== 'river' &&
                               spawnX >= 0 && spawnX < GRID_SIZE &&
                               spawnY >= 0 && spawnY < GRID_SIZE;
                
                attempts++;
            }
            
            // If we couldn't find a valid random position, use fallback positions
            if (!validPosition) {
                // Fallback to original positions
                if (window.gameState.currentLevel === 2) {
                    spawnX = 2 + (i % 3);
                    spawnY = 4 + Math.floor(i / 2) * 3;
                } else {
                    spawnX = 2 + (i % 3);
                    spawnY = 5 + Math.floor(i / 2) * 3;
                }
            }
            
            const unit = new Unit('player', className, spawnX, spawnY);
            
            // Additional validation (just in case)
            if (getUnitAt(unit.x, unit.y) || window.gameState.terrain[unit.y][unit.x] === 'water' || window.gameState.terrain[unit.y][unit.x] === 'river') {
                // Find nearest valid position
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        const checkX = unit.x + dx;
                        const checkY = unit.y + dy;
                        if (checkX >= 0 && checkX < GRID_SIZE && checkY >= 0 && checkY < GRID_SIZE &&
                            !getUnitAt(checkX, checkY) && 
                            window.gameState.terrain[checkY][checkX] !== 'water' &&
                            window.gameState.terrain[checkY][checkX] !== 'river') {
                            unit.x = checkX;
                            unit.y = checkY;
                            break;
                        }
                    }
                }
            }
            
            window.gameState.units.push(unit);
        }
    }
    
    // Create enemy units based on current level
    const level = LEVELS[window.gameState.currentLevel - 1];
    const enemyCount = UNITS_PER_TEAM + level.extraEnemies;
    window.gameState.isBossLevel = level.boss;

    // LEVEL 2: SPECIAL ENEMY COMPOSITION - 3 ARCHERS
    if (window.gameState.currentLevel === 2) {
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
        for (let i = 0; i < enemyCount; i++) {
            const baseName = level2EnemyTypes[i];
            
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
                if (window.gameState.currentLevel === 2) {
                    // Level 2: Spawn on RIGHT side of river (columns 9-15)
                    spawnX = 9 + Math.floor(Math.random() * 7);  // Columns 9-15
                } else {
                    // Level 1 & 3: Spawn on right side of map
                    spawnX = 8 + Math.floor(Math.random() * 8);  // Columns 8-15 (right side)
                }
                
                spawnY = 3 + Math.floor(Math.random() * 10); // Rows 3-12
                
                // Check if position is valid
                validPosition = !getUnitAt(spawnX, spawnY) && 
                               window.gameState.terrain[spawnY][spawnX] !== 'water' &&
                               window.gameState.terrain[spawnY][spawnX] !== 'river' &&
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
            if (getUnitAt(unit.x, unit.y) || window.gameState.terrain[unit.y][unit.x] === 'water' || window.gameState.terrain[unit.y][unit.x] === 'river') {
                // Find nearest valid position
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        const checkX = unit.x + dx;
                        const checkY = unit.y + dy;
                        if (checkX >= 0 && checkX < GRID_SIZE && checkY >= 0 && checkY < GRID_SIZE &&
                            !getUnitAt(checkX, checkY) && 
                            window.gameState.terrain[checkY][checkX] !== 'water' &&
                            window.gameState.terrain[checkY][checkX] !== 'river') {
                            unit.x = checkX;
                            unit.y = checkY;
                            break;
                        }
                    }
                }
            }
            
            window.gameState.units.push(unit);
        }
    } else if (window.gameState.currentLevel === 3) {
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
                   unit.y >= window.gameState.terrain.length || 
                   unit.x >= window.gameState.terrain[0].length ||
                   window.gameState.terrain[unit.y][unit.x] === 'water') {
                // Keep enemies on the right side
                unit.x = 10 + Math.floor(Math.random() * 6);
                unit.y = 3 + Math.floor(Math.random() * 10);
                attempts++;
                if (attempts > 20) break;
            }
            
            window.gameState.units.push(unit);
        }
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
            while (getUnitAt(unit.x, unit.y) || window.gameState.terrain[unit.y][unit.x] === 'water') {
                // Keep enemies on the right side
                unit.x = 10 + Math.floor(Math.random() * 6);
                unit.y = 3 + Math.floor(Math.random() * 10);
                attempts++;
                if (attempts > 20) break;
            }
            
            window.gameState.units.push(unit);
        }
    }
}

function createGrid() {
    if (!gridEl) return;
    
    gridEl.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            const terrain = window.gameState.terrain[y][x];
            if (terrain !== 'normal') {
                tile.classList.add(terrain);
            }
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.addEventListener('click', () => {
                if (window.tileClick) window.tileClick(x, y);
            });
            gridEl.appendChild(tile);
        }
    }
}

// Make functions globally available
window.generateTerrain = generateTerrain;
window.createUnits = createUnits;
window.createGrid = createGrid;
