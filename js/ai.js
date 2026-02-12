// Iron Resolution AI.js

        // ========== IMPROVED AI ==========
        async function aiTurn() {
     await renderAll([])
    
    // Sort by priority: mages first, then archers, then berserkers, then knights
    const enemyUnits = gameState.units
        .filter(u => u.type === 'enemy' && u.remainingActions > 0 && !u.fleeing)
        .sort((a, b) => {
            // 1. SHAMANS (MAGES) GET HIGHEST PRIORITY - HEAL FIRST
            if (a.classType === 'mage' && b.classType !== 'mage') return -1;
            if (b.classType === 'mage' && a.classType !== 'mage') return 1;
            
            // 2. ARCHERS - Ranged attackers next
            if (a.classType === 'archer' && b.classType !== 'archer') return -1;
            if (b.classType === 'archer' && a.classType !== 'archer') return 1;
            
            // 3. BERSERKERS - Melee damage dealers
            if (a.classType === 'berserker' && b.classType !== 'berserker') return -1;
            if (b.classType === 'berserker' && a.classType !== 'berserker') return 1;
            
            // 4. Default: knights/warriors last
            return 0;
        });
    
    for (const unit of enemyUnits) {
        if (unit.remainingActions <= 0 || unit.fleeing) continue;
                
      // Handle fleeing units
if (unit.fleeing) {
    const removed = unit.performFlee();
    if (removed) {
        // Check victory immediately after removal
        const remainingEnemies = gameState.units.filter(u => u.type === 'enemy' && !u.fleeing);
        if (remainingEnemies.length === 0) {
            logMessage("All enemies defeated! Victory!", 'system');
            completeLevel();
            return; // Exit AI turn immediately
        }
    }
    continue;
}
         // Set active unit for glow effect
        gameState.aiActiveUnit = unit;
        await renderAll([])
        
        // Berserkers get special log message
              
        await performAIActions(unit);
        await delay(500);
        
        gameState.aiActiveUnit = null;
        await renderAll([])
    }
    
    cleanupUnits();  // Clean after AI
    
 // Check victory after AI turn
    checkVictory();
    
    // Only end turn if game is still going
const enemies = gameState.units.filter(u => u.type === 'enemy' && !u.fleeing);
const players = gameState.units.filter(u => u.type === 'player' && !u.fleeing);

if (enemies.length > 0 && players.length > 0) {
    setTimeout(endTurn, 1000);
} else if (enemies.length === 0) {
    // Victory!
    completeLevel();
}
}

async function performAIActions(unit) {
    // ====== SAFETY CHECKS ======
    if (!unit || unit.hp <= 0) {
        console.log('⚠️ AI: Unit invalid or dead, skipping');
        unit.remainingActions = 0;
        return;
    }
    
    if (unit.fleeing) {
        console.log(`⚠️ ${unit.name} is fleeing, skipping AI actions`);
        unit.remainingActions = 0;
        return;
    }
    
    if (unit.remainingActions <= 0) {
        console.log(`⚠️ ${unit.name} has no actions left`);
        return;
    }
    
    // === DEFINE PLAYERS ===
    const players = gameState.units.filter(u => u.type === 'player' && u.hp > 0 && !u.fleeing);
    if (players.length === 0) {
        unit.remainingActions = 0;
        return;
    }
    
        // ====== SHAMAN/MAGE BEHAVIOR - STAY WITH THE PACK ======
if (unit.classType === 'mage') {
    console.log(`🔮 ${unit.name} - Support Mage`);
    
    const MIN_SAFE_DISTANCE = 4; // Stay at least 4 tiles from players
    const PACK_DISTANCE = 3; // Stay within 3 tiles of allies
    
    // Find all relevant units
    const players = gameState.units.filter(u => u.type === 'player' && u.hp > 0 && !u.fleeing);
    const allies = gameState.units.filter(u => 
        u.type === 'enemy' && 
        u.id !== unit.id && 
        u.hp > 0 && 
        !u.fleeing
    );
    
    // Find nearest player
    const nearestPlayer = players.length > 0 ? players.reduce((closest, player) => {
        const dist = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
        return dist < closest.dist ? {unit: player, dist} : closest;
    }, {unit: players[0], dist: Infinity}).unit : null;
    
    // Find nearest ally (potential bodyguard)
    const nearestAlly = allies.length > 0 ? allies.reduce((closest, ally) => {
        const dist = Math.abs(unit.x - ally.x) + Math.abs(unit.y - ally.y);
        return dist < closest.dist ? {unit: ally, dist} : closest;
    }, {unit: allies[0], dist: Infinity}).unit : null;
    
    // ====== 1. PRIORITY: HEAL INJURED ALLIES ======
    if (unit.canHeal && unit.remainingActions > 0) {
        // Find injured allies (below 70% HP)
        const injuredAllies = allies.filter(ally => 
            ally.hp < ally.maxHp * 0.7 && 
            ally.hp > 0
        );
        
        if (injuredAllies.length > 0) {
            // Sort by: 1) Most injured, 2) Most important (knights/berserkers first), 3) Closest
            injuredAllies.sort((a, b) => {
                // Injury percentage (higher = more injured)
                const aInjury = (a.maxHp - a.hp) / a.maxHp;
                const bInjury = (b.maxHp - b.hp) / b.maxHp;
                
                // Priority by class (knights/berserkers first)
                const aPriority = a.classType === 'knight' || a.classType === 'berserker' ? 2 : 1;
                const bPriority = b.classType === 'knight' || b.classType === 'berserker' ? 2 : 1;
                
                // If different priorities, prioritize knights/berserkers
                if (aPriority !== bPriority) return bPriority - aPriority;
                
                // If similarly important, pick most injured
                if (Math.abs(aInjury - bInjury) > 0.1) return bInjury - aInjury;
                
                // Otherwise pick closest
                const da = Math.abs(a.x - unit.x) + Math.abs(a.y - unit.y);
                const db = Math.abs(b.x - unit.x) + Math.abs(b.y - unit.y);
                return da - db;
            });
            
            const target = injuredAllies[0];
            const distance = Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y);
            
            // Can heal from current position
            if (distance <= unit.range) {
                console.log(`🔮 ${unit.name} healing ${target.name}`);
                await performHeal(unit, target);
                unit.remainingActions = 0;
                return;
            }
            
            // Need to move closer to heal
            if (unit.canMove && unit.remainingActions > 0) {
                console.log(`🔮 ${unit.name} moving to heal ${target.name}`);
                
                // Calculate move that gets us in heal range while staying safe
                const movesLeft = unit.movement - unit.movesUsed;
                const neededDistance = distance - unit.range;
                
                if (neededDistance <= movesLeft && neededDistance > 0) {
                    // Move toward target but stop at max heal range
                    const path = findPathToHealRange(unit, target, unit.range);
                    if (path && path.length > 1) {
                        for (let i = 1; i < Math.min(path.length, movesLeft + 1); i++) {
                            if (unit.remainingActions <= 0) break;
                            const step = path[i];
                            await moveUnit(unit, step.x, step.y);
                        }
                        
                        // After moving, heal if now in range
                        const newDistance = Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y);
                        if (newDistance <= unit.range && unit.canHeal && unit.remainingActions > 0) {
                            await performHeal(unit, target);
                        }
                    }
                }
                unit.remainingActions = 0;
                return;
            }
        }
    }
    
    // ====== 2. POSITIONING: STAY WITH THE PACK ======
    if (unit.canMove && unit.remainingActions > 0) {
        // Check if we're in a good position
        const isSafe = nearestPlayer ? 
            Math.abs(unit.x - nearestPlayer.x) + Math.abs(unit.y - nearestPlayer.y) >= MIN_SAFE_DISTANCE : 
            true;
        
        const isWithPack = nearestAlly ?
            Math.abs(unit.x - nearestAlly.x) + Math.abs(unit.y - nearestAlly.y) <= PACK_DISTANCE :
            false;
        
        if (!isSafe && nearestAlly) {
            // DANGER! Move toward nearest ally for protection
            console.log(`🔮 ${unit.name} moving to ally for protection`);
                logMessage(`${unit.name} seeks protection with allies.`, 'enemy');
            await moveTowardTarget(unit, nearestAlly.x, nearestAlly.y, false);
            unit.remainingActions = 0;
            return;
        }
        
        if (!isWithPack && nearestAlly) {
            // Too far from pack, regroup
            console.log(`🔮 ${unit.name} regrouping with pack`);
            logMessage(`${unit.name} regroups with the pack.`, 'enemy');
            await moveTowardTarget(unit, nearestAlly.x, nearestAlly.y, false);
            unit.remainingActions = 0;
            return;
        }
        
        // If safe and with pack, try to optimize position
        if (isSafe && isWithPack && allies.length > 0) {
            // Find the "center of mass" of nearby allies
            let avgX = 0, avgY = 0, count = 0;
            allies.forEach(ally => {
                const dist = Math.abs(unit.x - ally.x) + Math.abs(unit.y - ally.y);
                if (dist <= PACK_DISTANCE * 2) { // Consider nearby allies
                    avgX += ally.x;
                    avgY += ally.y;
                    count++;
                }
            });
            
            if (count > 0) {
                avgX = Math.round(avgX / count);
                avgY = Math.round(avgY / count);
                
                // Move toward center of the pack (but stay at heal range from edges)
                const currentDist = Math.abs(unit.x - avgX) + Math.abs(unit.y - avgY);
                if (currentDist > 2) { // If not already near center
                    console.log(`🔮 ${unit.name} moving to better pack position`);
                    await moveTowardTarget(unit, avgX, avgY, false);
                }
            }
        }
    }
    
    // ====== 3. CONSERVE POSITION ======
    console.log(`🔮 ${unit.name} holding position with the pack`);
    unit.remainingActions = 0;
    return;
}

// ====== HELPER: Find path to optimal heal position ======
function findPathToHealRange(healer, target, healRange) {
    const startX = healer.x, startY = healer.y;
    const targetX = target.x, targetY = target.y;
    const maxMoves = healer.movement - healer.movesUsed;
    
    // We want to be exactly at healRange distance (or slightly less)
    const desiredDistance = healRange;
    
    // Find positions at desired distance from target
    const candidatePositions = [];
    
    for (let dx = -desiredDistance; dx <= desiredDistance; dx++) {
        for (let dy = -desiredDistance; dy <= desiredDistance; dy++) {
            if (Math.abs(dx) + Math.abs(dy) !== desiredDistance) continue;
            
            const checkX = targetX + dx;
            const checkY = targetY + dy;
            
            if (checkX >= 0 && checkX < GRID_SIZE && 
                checkY >= 0 && checkY < GRID_SIZE &&
                !getUnitAt(checkX, checkY) &&
                gameState.terrain[checkY][checkX] !== 'water') {
                
                // Check distance to player (safety)
                const players = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
                let minPlayerDist = Infinity;
                players.forEach(p => {
                    const dist = Math.abs(checkX - p.x) + Math.abs(checkY - p.y);
                    if (dist < minPlayerDist) minPlayerDist = dist;
                });
                
                if (minPlayerDist >= 3) { // Safe position
                    const distanceFromHealer = Math.abs(checkX - startX) + Math.abs(checkY - startY);
                    if (distanceFromHealer <= maxMoves) {
                        candidatePositions.push({
                            x: checkX, 
                            y: checkY, 
                            safety: minPlayerDist,
                            distance: distanceFromHealer
                        });
                    }
                }
            }
        }
    }
    
    if (candidatePositions.length === 0) return null;
    
    // Pick safest position
    candidatePositions.sort((a, b) => {
        if (a.safety !== b.safety) return b.safety - a.safety; // Safer first
        return a.distance - b.distance; // Closer second
    });
    
    const targetPos = candidatePositions[0];
    
    // Simple path to that position
    return findShortestPath(startX, startY, targetPos.x, targetPos.y, maxMoves);
}
  
        // ====== BERSERKER BEHAVIOR ======
    if (unit.classType === 'berserker') {
        console.log(`🐗 ${unit.name} IS BERSERKING!`);
        
        // Find CLOSEST player
        let closestPlayer = null;
        let closestDistance = Infinity;
        
        for (const player of players) {
            const distance = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlayer = player;
            }
        }
        
        if (!closestPlayer) {
            unit.remainingActions = 0;
            return;
        }
        
        // BERSERKERS ATTACK MULTIPLE TIMES IF IN RANGE
        if (closestDistance <= unit.range && unit.canAttack && unit.remainingActions > 0) {
            console.log(`🐗 ${unit.name} attacking ${closestPlayer.name} (in range!)`);
            
            let attackCount = 0;
            while (unit.canAttack && attackCount < unit.maxAttacks && closestPlayer.hp > 0 && unit.remainingActions > 0) {
                await performAttack(unit, closestPlayer);
                attackCount++;
                if (closestPlayer.hp <= 0) break;
                await delay(200);
            }
            unit.remainingActions = 0;
            return;
        }
      
        // Standard movement if special charge didn't work
if (unit.canMove && unit.remainingActions > 0) {
    await moveTowardTarget(unit, closestPlayer.x, closestPlayer.y);
    
    // Check if now in range to attack
    const newDistance = Math.abs(unit.x - closestPlayer.x) + Math.abs(unit.y - closestPlayer.y);
    
    if (newDistance <= unit.range && unit.canAttack && unit.remainingActions > 0) {
                logMessage(`${unit.name} reaches the enemy!`, 'system');
                await delay(200);
                
                let attacks = 0;
                while (unit.canAttack && attacks < unit.maxAttacks && closestPlayer.hp > 0 && unit.remainingActions > 0) {
                    await performAttack(unit, closestPlayer);
                    attacks++;
                    if (closestPlayer.hp <= 0) break;
                    await delay(200);
                }
            }
        }
        
        unit.remainingActions = 0;
        return;
    }
    
    // ====== REGULAR AI LOGIC FOR KNIGHTS AND ARCHERS ======
    
    // 1. Try to attack if in range
    if (unit.canAttack && unit.remainingActions > 0) {
        console.log(`⚔️ ${unit.name} can attack`);
        
        for (const player of players) {
            const distance = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
            if (distance <= unit.range) {
                console.log(`⚔️ ${unit.name} attacking ${player.name}`);
                
                let attackCount = 0;
                while (unit.canAttack && attackCount < unit.maxAttacks && player.hp > 0 && unit.remainingActions > 0) {
                    await performAttack(unit, player);
                    attackCount++;
                    
                    if (player.hp <= 0) {
                        console.log(`⚔️ ${unit.name} killed ${player.name}`);
                        break;
                    }
                    
                    if (unit.canAttack && attackCount < unit.maxAttacks && unit.remainingActions > 0) {
                        await delay(200);
                    }
                }
                
                console.log(`⚔️ ${unit.name} made ${attackCount} attacks, actions left: ${unit.remainingActions}`);
                
                // If we attacked, end turn for this unit
                if (attackCount > 0) {
                    unit.remainingActions = 0;
                    return;
                }
            }
        }
    }
    
    // 2. Move toward closest player to get in range
    if (unit.canMove && unit.remainingActions > 0) {
        // Find the closest player
        let closestPlayer = null;
        let closestDistance = Infinity;
        
        for (const player of players) {
            const distance = Math.abs(unit.x - player.x) + Math.abs(unit.y - player.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlayer = player;
            }
        }
        
        if (!closestPlayer) {
            unit.remainingActions = 0;
            return;
        }
        
        // If we're already in range but can't attack (no actions), skip moving
        if (closestDistance <= unit.range && unit.remainingActions <= 0) {
            unit.remainingActions = 0;
            return;
        }
        
        // Move toward player (use full movement)
        await moveTowardTarget(unit, closestPlayer.x, closestPlayer.y);
        
           // Check if now in range to attack
    const newDistance = Math.abs(unit.x - closestPlayer.x) + Math.abs(unit.y - closestPlayer.y);
    console.log(`BERSERKER ${unit.name} after move: distance=${newDistance}, range=${unit.range}, canAttack=${unit.canAttack}, actionsLeft=${unit.remainingActions}`);
    
    if (newDistance <= unit.range && unit.canAttack && unit.remainingActions > 0) {
            await delay(200);
            await performAttack(unit, closestPlayer);
        }
    }
    
    // 3. End turn for this unit
    unit.remainingActions = 0;
}
      
        // ========== HELPER FUNCTIONS ==========
        function selectUnit(unit) {
     document.querySelectorAll('.tile.movable, .tile.selected').forEach(tile => {
        tile.classList.remove('movable', 'selected');
    });
    
    gameState.selectedUnit = unit;
    logMessage(`Selected ${unit.name}`, 'system');
    soundSystem.playSelect();
    
    // Just update the display
    updateSelectedUnitDisplay();
    updatePhaseIndicator();
    updateUI();
    updateUnitRoster();
            
    // Highlight selected unit
    const tile = getTile(unit.x, unit.y);
    if (tile) tile.classList.add('selected');
    
    // Show movement range if it's your unit and can act
if (unit.type === gameState.currentPlayer && unit.canAct && !unit.fleeing) {
    for (let tx = 0; tx < GRID_SIZE; tx++) {
        for (let ty = 0; ty < GRID_SIZE; ty++) {
            // Use isInMovementRange which checks paths properly
            if (isInMovementRange(tx, ty, unit)) {
                const t = getTile(tx, ty);
                if (t) t.classList.add('movable');
            }
        }
    }
}
    
    updateSelectedUnitDisplay();
    updatePhaseIndicator();
    updateUnitRoster();
}
        
       function cancelSelection() {
    // If nothing is selected, do nothing
    if (!gameState.selectedUnit && gameState.phase === 'select') {
        return;
    }
    
    // Only log if we're actually cancelling something
    const hadSelection = !!gameState.selectedUnit;
    const previousPhase = gameState.phase;
    
    gameState.selectedUnit = null;
    gameState.phase = 'select';
    rangeIndicator.style.display = 'none';
    document.querySelectorAll('.tile.in-attack-range').forEach(t => t.classList.remove('in-attack-range'));
    
    if (hadSelection || previousPhase !== 'select') {
        logMessage("Selection cancelled.", 'system');
    }
    
    updateUnitRoster();
    renderAll([]);
}
  
// Make AI functions available globally
window.aiTurn = aiTurn;
window.performAIActions = performAIActions;  
