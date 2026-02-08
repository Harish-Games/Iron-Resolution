// ========== COMBAT FUNCTIONS ==========
async function performAttack(attacker, defender) {
    if (!attacker.canAttack) {
        if (window.logMessage) {
            window.logMessage(`${attacker.name} cannot attack anymore this turn.`, 'system');
        }
        return;
    }
    
    // Visual feedback - ONLY animate attacker
    const attackerTile = getTile(attacker.x, attacker.y);
    if (attackerTile) {
        const attackerUnit = attackerTile.querySelector('.unit');
        if (attackerUnit) {
            attackerUnit.classList.add('unit-attacking');
            setTimeout(() => attackerUnit.classList.remove('unit-attacking'), 300);
        }
    }
    
    // Sound
    if (attacker.range > 1) {
        if (window.soundSystem) window.soundSystem.playRanged();
    } else {
        if (window.soundSystem) window.soundSystem.playAttack();
    }
    
    await delay(100);
    
    // Hit calculation
    const hitChance = attacker.getAttackChance(defender);
    const roll = Math.random() * 100;
    const isCritical = Math.random() < 0.1;
    
    if (roll > hitChance) {
        if (window.showCombatResult) window.showCombatResult(defender.x, defender.y, 0, 'miss');
        if (window.logMessage) {
            window.logMessage(`${attacker.name} misses ${defender.name} (${defender.hp}/${defender.maxHp})! (${Math.floor(	tChance)}% chance)`, attacker.type);
        }
        if (window.soundSystem) window.soundSystem.playMiss();
        attacker.attacksUsed++;
        attacker.useAction();
        
        // Check if this was the archer's only action
        if (attacker.remainingActions <= 0) {
            console.log(`🎯 ${attacker.name} (archer) used all actions on missed shot`);
        }
        if (roll <= hitChance) {
        
        // Track attacker stats
        attacker.hitsLanded++;
        attacker.damageDealt += damage;
        
        // Track defender stats  
        defender.damageTaken += damage;
        
        if (window.renderAll) await window.renderAll([]);
        return;
    }
    
    // Calculate damage
    let damage = attacker.attack;
    if (isCritical) damage = Math.floor(damage * 1.5);
    
    // Armor penetration
    if (attacker.equipment.weapon?.armorPen) {
        damage += Math.min(attacker.equipment.weapon.armorPen, defender.defense || 0);
    }
    
    // Apply defense
    if (defender.defense) {
        damage = Math.max(1, damage - Math.floor(defender.defense * 0.5));
    }
    
    // Terrain modifiers - SINGLE SOURCE
    const terrain = window.gameState?.terrain[defender.y][defender.x];
    const terrainEffect = TERRAIN_EFFECTS[terrain] || TERRAIN_EFFECTS.normal;
    
    // Apply damage reduction/increase
    if (terrainEffect.damageReduction !== 0) {
        if (terrainEffect.damageReduction > 0) {
            // Damage reduction (forest, mountain, village)
            damage = Math.floor(damage * (1 - terrainEffect.damageReduction/100));
        } else {
            // Damage increase (swamp)
            damage = Math.floor(damage * (1 + Math.abs(terrainEffect.damageReduction)/100));
        }
    }
    
    // Ranged penalty
    if (attacker.range > 1) {
        const distance = Math.abs(attacker.x - defender.x) + Math.abs(attacker.y - defender.y);
        damage = Math.max(1, Math.floor(damage * (1 - (distance * 0.1))));
    }
    
    // Random variation
    damage = Math.max(1, damage + Math.floor(Math.random() * 4) - 2);
    
    // Update battle stats
    if (attacker.type === 'player') {
        window.gameState.battleStats.damageDealt += damage;
    } else {
        window.gameState.battleStats.damageTaken += damage;
    }
    
    // Apply damage
    const oldHp = defender.hp;                  // ← Save old HP here
    defender.hp -= damage;
    defender.hp = Math.max(0, defender.hp);     // ← Prevent negative HP

    // PHASE 2: Update morale
    const moraleLoss = defender.updateMorale(damage);

    // Visual effects & log message (now safe for both normal and crit)
    if (isCritical) {
        if (window.showCombatResult) window.showCombatResult(defender.x, defender.y, damage, 'damage', true);
        if (window.logMessage) {
            window.logMessage(`CRITICAL! ${attacker.name} smashes ${defender.name} (${oldHp}→${defender.hp}/${defender.maxHp}) for ${damage} damage!`, attacker.type);
        }
    } else {
        if (window.showCombatResult) window.showCombatResult(defender.x, defender.y, damage, 'damage', false);
        if (window.logMessage) {
            window.logMessage(`${attacker.name} hits ${defender.name} (${oldHp}→${defender.hp}/${defender.maxHp}) for ${damage} damage!`, attacker.type);
        }
    }

    if (window.soundSystem) window.soundSystem.playHit();
    
    // PHASE 2: Chance for injury
    if (damage > 8 && Math.random() < 0.3) {
        const injuries = Object.keys(INJURIES);
        const randomInjury = injuries[Math.floor(Math.random() * injuries.length)];
        defender.addInjury(randomInjury);
    }
    
    // Update game state
    attacker.attacksUsed++;
    attacker.useAction();
    
    // Update the selected unit display
    if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
    
    // XP
    if (attacker.type === 'player') {
        const hitXp = 15 + (defender.level * 4);
        attacker.addXp(hitXp);
        
        if (window.gameState.selectedUnit && window.gameState.selectedUnit.id === attacker.id) {
            if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
        }
    }
    
    // Check for death
    if (defender.hp <= 0) {
        console.log(`<img src="ui/skull.png" style="width: 16px; height: 16px; vertical-align: middle;"> ${defender.name} DIED! HP: ${defender.hp}`, defender);
        
        if (window.logMessage) {
            window.logMessage(`<img src="ui/skull.png" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;"> ${defender.name} is defeated!`, 'system');
        }
        
        // Update battle stats
        if (attacker.type === 'player') {
            const killXp = 40 + (defender.level * 8);
            attacker.addXp(killXp);
            
            if (window.gameState.selectedUnit && window.gameState.selectedUnit.id === attacker.id) {
                if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
            }
        } else {
            window.gameState.battleStats.enemyKills++;
        }
        
        if (defender.hp <= 0) {
        attacker.kills++;
        
        // Update morale for allies
        const allies = window.gameState.units.filter(u => u.type === defender.type && u.id !== defender.id);
        allies.forEach(ally => ally.updateMorale(0, true));
        window.gameState.units = window.gameState.units.filter(u => u.id !== defender.id);
    }
    
    if (window.cleanupUnits) window.cleanupUnits();
    if (window.checkVictory) window.checkVictory();
    if (window.renderAll) await window.renderAll([]);
}

async function performHeal(healer, target) {
    if (!healer.canHeal) {
        if (window.logMessage) {
            window.logMessage(`${healer.name} cannot heal.`, 'system');
        }
        return;
    }

    const dist = Math.abs(healer.x - target.x) + Math.abs(healer.y - target.y);
    if (dist > healer.range || dist === 0) {
        console.log(`Heal blocked: ${healer.name} too far from ${target.name} (dist: ${dist}, range: ${healer.range})`);
        return;
    }

    // SAFETY: Ensure healPower exists (default to 10 for mages)
    const healPower = healer.healPower || 10;

    const baseHeal = healPower + healer.level * 2;
    const variation = Math.floor(Math.random() * 6) - 2;
    let healAmount = Math.max(1, baseHeal + variation);

    const oldHp = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + healAmount);
    healAmount = target.hp - oldHp; // Actual amount healed (in case of overheal)

    // PHASE 2: Healing improves morale
    target.morale = Math.min(100, target.morale + 10);

    if (window.showCombatResult) window.showCombatResult(target.x, target.y, healAmount, 'heal');
    if (window.logMessage) {
        window.logMessage(`${healer.name} heals ${target.name} for ${healAmount} HP!`, 'heal');
    }

    if (window.soundSystem) window.soundSystem.playHeal();

    // === ADD XP FOR HEALING HERE ===
    if (healer.type === 'player') {
        const healXp = 7 + Math.floor(healAmount * 0.5);
        healer.addXp(healXp);
        if (window.logMessage) {
            window.logMessage(`${healer.name} gains ${healXp} XP for healing!`, 'system');
        }
    }

    healer.useAction();
    
    // Update the selected unit display
    if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
    
    if (window.renderAll) await window.renderAll([]);
}

async function moveUnit(unit, newX, newY) {
    // Prevent moving into water OR river
    if (window.gameState.terrain[newY][newX] === 'water' || window.gameState.terrain[newY][newX] === 'river') {
        if (window.logMessage) window.logMessage("Cannot move into water!", 'system');
        return;
    }
    
    const movesLeft = unit.movement - unit.movesUsed;
    
    // First check if there's ANY path at all
    if (!hasPathWithinRange(unit.x, unit.y, newX, newY, movesLeft)) {
        if (window.logMessage) window.logMessage("No path available within movement range!", 'system');
        return;
    }
    
    // Find the actual shortest path
    const path = findShortestPath(unit.x, unit.y, newX, newY, movesLeft);
    if (!path || path.length - 1 > movesLeft) {
        if (window.logMessage) window.logMessage("Can't move there! Path too long or blocked.", 'system');
        return;
    }
    
    // Move along the path
    if (window.moveAlongPath) await window.moveAlongPath(unit, path);
    
    // Update the selected unit display
    if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
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
        if (window.logMessage) window.logMessage("Not enough movement left!", 'system');
        return;
    }
    
    if (unit.remainingActions <= 0) {
        if (window.logMessage) window.logMessage("No actions left!", 'system');
        return;
    }
    
    // Move along the path for animation (but don't log each step)
    for (let i = 1; i < path.length; i++) {
        const step = path[i];
        
        // Check if this step is valid
        if (window.gameState.terrain[step.y][step.x] === 'water' || window.gameState.terrain[step.y][step.x] === 'river') {
            if (window.logMessage) window.logMessage("Cannot move through water!", 'system');
            return;
        }
        
        // Check if tile is occupied (except for the destination - we check that separately)
        const isDestination = (i === path.length - 1);
        if (!isDestination && getUnitAt(step.x, step.y)) {
            if (window.logMessage) window.logMessage("Path is blocked!", 'system');
            return;
        }
        
        // Update unit position for this step
        unit.x = step.x;
        unit.y = step.y;
        unit.movesUsed++;
        
        // ====== FIX: DEDUCT 1 AP PER TILE! ======
        unit.useAction();
        
        // Update the display after each step
        if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
        
        // Visual update for animation
        if (window.renderAll) await window.renderAll([unit.id]);
        await delay(50); // Small pause for animation
    }
    
    // Now check destination separately
    if (getUnitAt(destination.x, destination.y) && 
        !(getUnitAt(destination.x, destination.y).id === unit.id)) {
        if (window.logMessage) window.logMessage("Destination is occupied!", 'system');
        // Move back to start? Or just leave at last valid position
        return;
    }
    
    // Log only the destination movement (once at the end)
    if (window.logMessage) {
        window.logMessage(`${unit.name} moves from (${startX}, ${startY}) to (${destination.x}, ${destination.y}).`, 
                          unit.type === 'player' ? 'player' : 'enemy');
    }
    
    // Final visual update
    if (window.renderAll) await window.renderAll([unit.id]);
}

async function moveTowardTarget(unit, targetX, targetY, aggressive = true) {
    const movesLeft = unit.movement - unit.movesUsed;
    if (movesLeft <= 0 || unit.remainingActions <= 0) return;
    
    console.log(`${unit.name} moving toward (${targetX}, ${targetY}) with ${movesLeft} moves left`);
    
    if (unit.type === 'enemy') {
        if (window.logMessage) window.logMessage(`${unit.name} advances toward the enemy.`, 'enemy');
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
            window.gameState.terrain[tryY][tryX] !== 'water' &&
            window.gameState.terrain[tryY][tryX] !== 'river') {
            
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
                    window.gameState.terrain[tryY][tryX] !== 'water' &&
                    window.gameState.terrain[tryY][tryX] !== 'river') {
                    
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
                tryX = currentX + dir.dx;
                tryY = currentY + dir.dy;
                
                if (tryX >= 0 && tryX < GRID_SIZE && 
                    tryY >= 0 && tryY < GRID_SIZE &&
                    !getUnitAt(tryX, tryY) && 
                    window.gameState.terrain[tryY][tryX] !== 'water' &&
                    window.gameState.terrain[tryY][tryX] !== 'river') {
                    
                    currentX = tryX;
                    currentY = tryY;
                    moved = true;
                    break;
                }
            }
        }
        
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
                    window.gameState.terrain[tryY][tryX] !== 'water' &&
                    window.gameState.terrain[tryY][tryX] !== 'river') {
                    
                    currentX = tryX;
                    currentY = tryY;
                    moved = true;
                    break;
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
        if (window.gameState.selectedUnit && window.gameState.selectedUnit.id === unit.id) {
            if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
        }
        
        // ====== DEDUCT AP PER STEP ======
        unit.useAction();
        
        // Visual update
        if (window.renderAll) await window.renderAll([unit.id]);
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

// Helper: Move away from target (for mages retreating)
async function moveAwayFromTarget(unit, targetX, targetY) {
    const movesLeft = unit.movement - unit.movesUsed;
    if (movesLeft <= 0 || unit.remainingActions <= 0) return;
    
    console.log(`${unit.name} moving AWAY from (${targetX}, ${targetY})`);
    
    if (unit.type === 'enemy') {
        if (window.logMessage) window.logMessage(`${unit.name} retreats from danger.`, 'enemy');
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
        window.gameState.terrain[tryY][tryX] !== 'water' && 
        window.gameState.terrain[tryY][tryX] !== 'river') {      
        if (window.moveUnit) await window.moveUnit(unit, tryX, tryY);
    } else {
        // Can't move in ideal direction, try perpendicular
        if (dx !== 0) {
            // Try moving vertically instead
            const altX = unit.x;
            const altY = unit.y + (unit.y < targetY ? -1 : 1);
            
            if (altY >= 0 && altY < GRID_SIZE &&
                !getUnitAt(altX, altY) && 
                window.gameState.terrain[altY][altX] !== 'water' &&
                window.gameState.terrain[altY][altX] !== 'river') {
                
                if (window.moveUnit) await window.moveUnit(unit, altX, altY);
            }
        } else if (dy !== 0) {
            // Try moving horizontally instead
            const altX = unit.x + (unit.x < targetX ? -1 : 1);
            const altY = unit.y;
            
            if (altX >= 0 && altX < GRID_SIZE &&
                !getUnitAt(altX, altY) && 
                window.gameState.terrain[altY][altX] !== 'water' &&
                window.gameState.terrain[altY][altX] !== 'river') {
        
                if (window.moveUnit) await window.moveUnit(unit, altX, altY);
            }
        }
    }
}

// Make functions globally available
window.performAttack = performAttack;
window.performHeal = performHeal;
window.moveUnit = moveUnit;
window.moveAlongPath = moveAlongPath;
window.moveTowardTarget = moveTowardTarget;
window.moveAwayFromTarget = moveAwayFromTarget;
