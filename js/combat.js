// Iron Resolution COMBAT.JS

       async function performAttack(attacker, defender) {
    if (!attacker.canAttack) {
        logMessage(`${attacker.name} cannot attack anymore this turn.`, 'system');
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
        soundSystem.playRanged();
    } else {
        soundSystem.playAttack();
    }
    
    await delay(100);
            
            // Hit calculation
            const hitChance = attacker.getAttackChance(defender);
            const roll = Math.random() * 100;
            const isCritical = Math.random() < 0.1;
            
           if (roll > hitChance) {
    showCombatResult(defender.x, defender.y, 0, 'miss');
    logMessage(`${attacker.name} misses ${defender.name} (${defender.hp}/${defender.maxHp})! (${Math.floor(hitChance)}% chance)`, attacker.type);
    soundSystem.playMiss();
    attacker.attacksUsed++;
    attacker.useAction();
    
    // Check if this was the archer's only action
    if (attacker.remainingActions <= 0) {
        console.log(`🎯 ${attacker.name} (archer) used all actions on missed shot`);
        // For AI units, we need to end their turn
        if (attacker.type === 'enemy') {
            console.log(`🎯 Ending ${attacker.name}'s turn after missed attack`);
            // The turn will end when performAIActions returns
        }
    }
    
    await renderAll([])
    return;
}
          attacker.hitsLanded++;
            
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
            const terrain = gameState.terrain[defender.y][defender.x];
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
                gameState.battleStats.damageDealt += damage;
            } else {
                gameState.battleStats.damageTaken += damage;
            }
            
            // Apply damage
            const oldHp = defender.hp;                  // ← Save old HP here
            defender.hp -= damage;
            defender.hp = Math.max(0, defender.hp);     // ← Prevent negative HP

           // PHASE 2: Update morale
            const moraleLoss = defender.updateMorale(damage);

            // Visual effects & log message (now safe for both normal and crit)
if (isCritical) {
    showCombatResult(defender.x, defender.y, damage, 'damage', true);
    logMessage(`CRITICAL! ${attacker.name} smashes ${defender.name} (${oldHp}→${defender.hp}/${defender.maxHp}) for ${damage} damage!`, attacker.type);
} else {
    showCombatResult(defender.x, defender.y, damage, 'damage', false);
    logMessage(`${attacker.name} hits ${defender.name} (${oldHp}→${defender.hp}/${defender.maxHp}) for ${damage} damage!`, attacker.type);
}

            soundSystem.playHit();
            
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
			updateSelectedUnitStats();
            
            // XP
            if (attacker.type === 'player') {
			const hitXp = 15 + (defender.level * 4);
				attacker.addXp(hitXp);
				
				if (gameState.selectedUnit && gameState.selectedUnit.id === attacker.id) {
        updateSelectedUnitStats();
    }
            }
            
// Check for death
if (defender.hp <= 0) {
    console.log(`<img src="ui/skull.png" style="width: 16px; height: 16px; vertical-align: middle;"> ${defender.name} DIED! HP: ${defender.hp}`, defender);
    
// ====== ADD EXPLOSION ANIMATION HERE ======
const tile = getTile(defender.x, defender.y);
const gridContainer = document.querySelector('.grid-container');

if (tile && gridContainer) {
    // Get the tile's position
    const tileRect = tile.getBoundingClientRect();
    const containerRect = gridContainer.getBoundingClientRect();
    
    // Remove any existing combat indicators on this tile
    const existingIndicators = tile.querySelectorAll('.combat-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Create new image element
    const explosion = new Image();
    explosion.src = `Animations/Skull-Explode.webp?t=${Date.now()}`;
    explosion.style.cssText = `
        position: absolute;
        top: ${tileRect.top - containerRect.top + tileRect.height/2}px;
        left: ${tileRect.left - containerRect.left + tileRect.width/2}px;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        object-fit: contain;
        z-index: 10000;
        pointer-events: none;
        filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.8));
        opacity: 0;
    `;
    
    // Fade in when loaded
    explosion.onload = () => {
        explosion.style.opacity = '1';
    };
    
    gridContainer.appendChild(explosion);
    
    setTimeout(() => {
        if (explosion.parentNode === gridContainer) {
            gridContainer.removeChild(explosion);
        }
    }, 1200);
}
    
    logMessage(`<img src="ui/skull.png" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;"> ${defender.name} is defeated!`, 'system');
    
    // Update battle stats...           
                // Update battle stats
                if (attacker.type === 'player') {
				const killXp = 40 + (defender.level * 8);
					attacker.addXp(killXp);
					
					if (gameState.selectedUnit && gameState.selectedUnit.id === attacker.id) {
        updateSelectedUnitStats();
    }
				attacker.kills++;
				gameState.battleStats.playerKills++;	
					
					
				} else {
                    gameState.battleStats.enemyKills++;
                }
                
                // Update morale for allies
                const allies = gameState.units.filter(u => u.type === defender.type && u.id !== defender.id);
                allies.forEach(ally => ally.updateMorale(0, true));
                gameState.units = gameState.units.filter(u => u.id !== defender.id);
            }
            cleanupUnits();
            checkVictory();
            await renderAll([])
        }

               // ========== GAME LOGIC ==========
 async function performHeal(healer, target) {
    if (!healer.canHeal) {
        logMessage(`${healer.name} cannot heal.`, 'system');
        return;
    }

    const dist = Math.abs(healer.x - target.x) + Math.abs(healer.y - target.y);
    if (dist > healer.range || dist === 0) {
        console.log(`Heal blocked: ${healer.name} too far from ${target.name} (dist: ${dist}, range: ${healer.range})`);
        return;
    }

    // CHECK IF TARGET NEEDS HEALING
    if (target.hp >= target.maxHp) {
        logMessage(`${target.name} is already at full health!`, 'system');
        return;  // Don't heal, don't use action, don't give XP
    }

    // SAFETY: Ensure healPower exists (default to 10 for mages)
    const healPower = healer.healPower || 10;

    const baseHeal = healPower + healer.level * 2;
    const variation = Math.floor(Math.random() * 6) - 2;
    let healAmount = Math.max(1, baseHeal + variation);

    const oldHp = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + healAmount);
    healAmount = target.hp - oldHp; // Actual amount healed

    // ONLY INCREMENT HEAL COUNTER IF ACTUAL HEALING OCCURRED
if (healAmount > 0) {
    healer.healsPerformed++;  // Lifetime total
    healer.attacksUsed++;       // Battle total ← ADD THIS LINE
}

    // PHASE 2: Healing improves morale
    target.morale = Math.min(100, target.morale + 10);

    showCombatResult(target.x, target.y, healAmount, 'heal');
    logMessage(`${healer.name} heals ${target.name} for ${healAmount} HP!`, 'heal');

    soundSystem.playHeal();

    // === ADD XP FOR HEALING HERE ===
    if (healer.type === 'player' && healAmount > 0) {  // Only give XP if actual healing occurred
        const healXp = 12 + Math.floor(healAmount * 0.8);
        healer.addXp(healXp);
        logMessage(`${healer.name} gains ${healXp} XP for healing!`, 'system');
    }

    healer.useAction();
    
    // Update the selected unit display
    updateSelectedUnitStats();
    
    await renderAll([]);
}
