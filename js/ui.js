// Iron Resolution UI.js

        // ========== INCREMENTAL RENDERING ==========
        async function renderAll(animateUnitIds = []) {
    if (gameState.isUpdating) return;
    gameState.isUpdating = true;
    
    await renderGrid();
    await renderUnits(animateUnitIds);
    await renderDamagePopups();
    
    updateUI();
    updatePhaseIndicator();
    updateEnemiesCounter();
    updateUnitRoster(); 
    
    gameState.isUpdating = false;
}
        
       async function renderGrid() {
    await delay(10);
    
    document.querySelectorAll('.tile').forEach(tile => {
        const x = parseInt(tile.dataset.x);
        const y = parseInt(tile.dataset.y);
        const terrain = gameState.terrain[y] ? gameState.terrain[y][x] : 'normal';
        
        tile.className = 'tile';
        if (terrain !== 'normal') {
            tile.classList.add(terrain);
        }
        
        if (gameState.currentLevel === 9) {
            const coord = `${x},${y}`;
            if (!gameState.visibleTiles.includes(coord)) {
                tile.classList.add('fog');
            } else {
                tile.classList.remove('fog');
            }
        }
    });
                        
            if (gameState.selectedUnit) {
                const unit = gameState.selectedUnit;
                
                if (gameState.phase === 'heal') {
                    rangeIndicator.style.display = 'block';
                    rangeIndicator.textContent = `Heal Range: ${unit.range}`;
                    
                    for (let x = 0; x < GRID_SIZE; x++) {
                        for (let y = 0; y < GRID_SIZE; y++) {
                            const target = getUnitAt(x, y);
                            if (target && target.type === unit.type && isInRange(x, y, unit, unit.range)) {
                                const tile = getTile(x, y);
                                if (tile) tile.classList.add('healable');
                            }
                        }
                    }
                }
                
              if (gameState.phase === 'move') {
    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            if (isInMovementRange(x, y, unit)) {
                const tile = getTile(x, y);
                if (tile) tile.classList.add('movable');
            }
        }
    }
}
                
                const selectedTile = getTile(unit.x, unit.y);
                if (selectedTile) selectedTile.classList.add('selected');

                // === NEW: SHOW ATTACK RANGE FOR SELECTED RANGED UNIT ===
                // Clear previous attack range highlights
                document.querySelectorAll('.tile.in-attack-range').forEach(t => t.classList.remove('in-attack-range'));

                // Show attack range for selected unit (if it can attack)
                if (gameState.selectedUnit && gameState.selectedUnit.canAttack) {
                    const u = gameState.selectedUnit;
                    for (let tx = 0; tx < GRID_SIZE; tx++) {
                        for (let ty = 0; ty < GRID_SIZE; ty++) {
                            const dist = Math.abs(tx - u.x) + Math.abs(ty - u.y);
                            if (dist <= u.range && dist > 0) {
                                const tile = getTile(tx, ty);
                                if (tile) tile.classList.add('in-attack-range');
                            }
                        }
                    }
                }
            }
        }
            
  async function renderUnits() {
    await delay(10);
    
    // Track which units have been placed
    const placedUnitIds = new Set();
    
    for (const unit of gameState.units) {
    
    // Inside renderUnits, when about to create/update a unit
if (unit.type === 'enemy' && gameState.currentLevel === 9) {
    const coord = `${unit.x},${unit.y}`;
    if (!gameState.visibleTiles.includes(coord)) {
        continue; // Skip rendering this enemy
    }
}
    
        await delay(5);
        const tile = getTile(unit.x, unit.y);
        if (!tile) continue;
        
        // Check if there's already a unit element at this position
        let unitEl = tile.querySelector(`.unit[data-unit-id="${unit.id}"]`);
        
        // If unit exists somewhere else, move it
        if (!unitEl) {
            // Look for this unit anywhere on the grid
            unitEl = document.querySelector(`.unit[data-unit-id="${unit.id}"]`);
            
            if (unitEl) {
                // Unit exists in wrong position - move it
                unitEl.remove();
                unitEl = null;
            }
        }
        
        // Create new unit element if needed
        if (!unitEl) {
            unitEl = document.createElement('div');
let classes = ['unit', unit.type, unit.classType];
if (unit.isBoss) classes.push('boss');
unitEl.className = classes.join(' ');
            unitEl.dataset.unitId = unit.id;
            
            if (unit.fleeing) {
                unitEl.classList.add('fleeing');
            }
            if (unit === gameState.aiActiveUnit) {
                unitEl.classList.add('ai-active');
            }
            
            const icon = document.createElement('div');
            icon.className = 'unit-icon';
            unitEl.appendChild(icon);
            
            // Action bar
            const actionBar = document.createElement('div');
            actionBar.className = 'action-bar';
            const actionFill = document.createElement('div');
            actionFill.className = 'action-fill';
            actionFill.style.width = `${unit.actionPercent}%`;
            actionBar.appendChild(actionFill);
            unitEl.appendChild(actionBar);
            
            // HP bar
            const hpBar = document.createElement('div');
            hpBar.className = 'hp-bar';
            const hpFill = document.createElement('div');
            hpFill.className = 'hp-fill';
            hpFill.style.width = `${unit.hpPercent}%`;
            if (unit.hp < unit.maxHp * 0.3) hpFill.classList.add('damaged');
            hpBar.appendChild(hpFill);
            unitEl.appendChild(hpBar);
            
            // Energy bar
            const energyBar = document.createElement('div');
            energyBar.className = 'energy-bar';
            const energyFill = document.createElement('div');
            energyFill.className = 'energy-fill';
            
            if (unit.injuries.length > 0 || unit.morale < 100) {
                energyFill.style.width = `${unit.moralePercent}%`;
                energyFill.style.background = unit.fleeing ? 
                    'linear-gradient(90deg, #95a5a6, #7f8c8d)' : 
                    'linear-gradient(90deg, #ff9f43, #feca57)';
            } else {
                energyFill.style.width = `${unit.hpPercent}%`;
            }
            energyBar.appendChild(energyFill);
            unitEl.appendChild(energyBar);
            
            tile.appendChild(unitEl);
        } else {
            // Update existing unit position and appearance
let classes = ['unit', unit.type, unit.classType];
if (unit.isBoss) classes.push('boss');
unitEl.className = classes.join(' ');
            if (unit.fleeing) {
                unitEl.classList.add('fleeing');
            } else {
                unitEl.classList.remove('fleeing');
            }
            if (unit === gameState.aiActiveUnit) {
                unitEl.classList.add('ai-active');
            } else {
                unitEl.classList.remove('ai-active');
            }
            
            // Update bars
            const actionFill = unitEl.querySelector('.action-fill');
            if (actionFill) actionFill.style.width = `${unit.actionPercent}%`;
            
            const hpFill = unitEl.querySelector('.hp-fill');
            if (hpFill) {
                hpFill.style.width = `${unit.hpPercent}%`;
                hpFill.className = 'hp-fill';
                if (unit.hp < unit.maxHp * 0.3) hpFill.classList.add('damaged');
            }
            
            const energyFill = unitEl.querySelector('.energy-fill');
            if (energyFill) {
                if (unit.injuries.length > 0 || unit.morale < 100) {
                    energyFill.style.width = `${unit.moralePercent}%`;
                    energyFill.style.background = unit.fleeing ? 
                        'linear-gradient(90deg, #95a5a6, #7f8c8d)' : 
                        'linear-gradient(90deg, #ff9f43, #feca57)';
                } else {
                    energyFill.style.width = `${unit.hpPercent}%`;
                }
            }
        }
        
        placedUnitIds.add(unit.id);
    }
    
    // Remove any units that no longer exist in gameState
    document.querySelectorAll('.unit').forEach(unitEl => {
        const unitId = parseInt(unitEl.dataset.unitId);
        if (!placedUnitIds.has(unitId)) {
            unitEl.remove();
        }
    });
}
  
        async function renderDamagePopups() {
        await delay(10);
}
        
        function showCombatResult(x, y, amount, type = 'damage', isCritical = false) {
    const indicator = document.createElement('div');
    indicator.className = 'combat-indicator';
    
    if (type === 'miss') {
        indicator.textContent = 'MISS';
        indicator.classList.add('miss-indicator');
    } else if (isCritical) {
        indicator.textContent = `CRIT! ${amount}`;
        indicator.classList.add('damage-critical');
    } else if (type === 'heal') {
        indicator.textContent = `+${amount}`;
        const size = Math.abs(amount) <= 15 ? 'small' : Math.abs(amount) <= 30 ? 'medium' : 'strong';
        indicator.classList.add(`heal-${size}`);
    } else {
        indicator.textContent = `-${amount}`;
        const size = Math.abs(amount) <= 15 ? 'small' : Math.abs(amount) <= 30 ? 'medium' : 'heavy';
        indicator.classList.add(`damage-${size}`);
    }
    
    const tile = getTile(x, y);
    if (tile) {
        tile.appendChild(indicator);
        setTimeout(() => {
            if (indicator.parentNode === tile) {
                tile.removeChild(indicator);
            }
        }, 1200);
    }
}
       function updateSelectedUnitDisplay() {
    const display = document.getElementById('selectedUnitDisplay');
    display.innerHTML = ''; // Clear display
    
    if (!gameState.selectedUnit) {
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'color: #8892b0; text-align: center; padding: 40px 20px;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 2em; margin-bottom: 10px;';
        icon.textContent = '⚔';
        
        const text1 = document.createElement('div');
        text1.style.cssText = 'margin-bottom: 10px; font-size: 1.1em;';
        text1.textContent = 'Click a unit on the battlefield';
        
        const text2 = document.createElement('div');
        text2.style.cssText = 'font-size: 0.9em; color: #4ecdc4;';
        text2.textContent = 'Unit details will appear here when selected';
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text1);
        placeholder.appendChild(text2);
        display.appendChild(placeholder);
        return;
    }
    
    // If we get here, build the full unit display
    buildFullUnitDisplay(display, gameState.selectedUnit);
}

function buildFullUnitDisplay(container, unit) {
    // Create main container
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'unit-details-container';
    
    // === LEFT COLUMN ===
    const leftColumn = document.createElement('div');
    leftColumn.className = 'unit-column left';
    
    // Unit header
    const header = document.createElement('div');
    header.className = 'unit-header-compact';
    
    const nameType = document.createElement('div');
    nameType.className = 'unit-name-type';
    
    const nameCompact = document.createElement('div');
    nameCompact.className = 'unit-name-compact';
    
    // Add icon
    const icon = document.createElement('span');
    icon.innerHTML = getClassIcon(unit.classType);
    nameCompact.appendChild(icon);
    
    // Add name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = ' ' + unit.name;
    nameCompact.appendChild(nameSpan);
    
    // Add class badge
    const classBadge = document.createElement('span');
    classBadge.className = 'unit-class-badge';
    classBadge.textContent = unit.classType;
    nameCompact.appendChild(classBadge);
    
    nameType.appendChild(nameCompact);
    
    // Subtitle - Just show Level, make brighter
const subtitle = document.createElement('div');
subtitle.className = 'unit-subtitle';
subtitle.textContent = `Level ${unit.level}`;
subtitle.style.color = '#64ffda'; // Brighter cyan color
subtitle.style.fontWeight = '500'; // Slightly bolder
nameType.appendChild(subtitle);
    
    header.appendChild(nameType);
    leftColumn.appendChild(header);
    
    // === ADD THIS HELPER FUNCTION SOMEWHERE ===
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
    
    // === STATS GRID ===
    const statsGrid = document.createElement('div');
    statsGrid.className = 'compact-stats-grid';
    
    // Health
    const healthStat = createStatBox('Health', `${unit.hp}/${unit.maxHp}`, 
        unit.hpPercent, '#2ecc71', unit.hpPercent < 50 ? '#e74c3c' : '#2ecc71');
    statsGrid.appendChild(healthStat);
    
    // Morale
    const moraleStat = createStatBox('Morale', `${unit.morale}%`, 
        unit.moralePercent, '#ff9f43', unit.morale < 50 ? '#e74c3c' : '#ff9f43');
    statsGrid.appendChild(moraleStat);
    
    // Attack
if (unit.classType === 'mage') {
    statsGrid.appendChild(createSimpleStat('Heal Power', unit.healPower || 10, '#2ecc71'));
} else {
    statsGrid.appendChild(createSimpleStat('Attack', unit.attack || 0, '#ff6b6b'));
}    
    // Defense
    statsGrid.appendChild(createSimpleStat('Defense', unit.defense || 0));
    
    // Accuracy
    statsGrid.appendChild(createSimpleStat('Accuracy', `${unit.accuracy}%`));
    
    // Range
    statsGrid.appendChild(createSimpleStat('Range', unit.range));
    
    // Actions
    const actionsStat = createStatBox('Actions', `${unit.remainingActions}/${unit.maxActions}`, 
        unit.actionPercent, '#f1c40f');
    statsGrid.appendChild(actionsStat);
    
    // Movement
    statsGrid.appendChild(createSimpleStat('Movement', 
        `${Math.min(unit.movement - unit.movesUsed, unit.remainingActions)}/${unit.movement}`));
    
// Show "Heals" for mages, "Attacks" for everyone else
if (unit.classType === 'mage') {
    // Use maxHeals and attacksUsed for mages
    const maxHeals = unit.maxHeals || 2
    const attacksUsed = unit.attacksUsed || 0
    const healsRemaining = maxHeals - attacksUsed;
    
    statsGrid.appendChild(createSimpleStat('Heals', 
        `${Math.min(healsRemaining, unit.remainingActions)}/${maxHeals}`,
        '#2ecc71')); // Green color for healing
} else {
    // Regular units use maxAttacks and attacksUsed
    statsGrid.appendChild(createSimpleStat('Attacks', 
        `${Math.min(unit.maxAttacks - unit.attacksUsed, unit.remainingActions)}/${unit.maxAttacks}`,
        '#ff6b6b')); // Red color for attacking
}
    
    // XP Progress
const currentTotalXp = getCumulativeXpForLevel(unit.level) + unit.xp;
const nextLevelTotalXp = getCumulativeXpForLevel(unit.level + 1);
const xpPercent = (unit.xp / unit.xpToNext) * 100;

const xpStat = createStatBox('XP', `${currentTotalXp}/${nextLevelTotalXp}`, 
    xpPercent, '#9b59b6');
statsGrid.appendChild(xpStat);
    
       leftColumn.appendChild(statsGrid);
    detailsContainer.appendChild(leftColumn);
    
    // === RIGHT COLUMN ===
    const rightColumn = document.createElement('div');
    rightColumn.className = 'unit-column right';
    
    // Equipment Section
    const equipmentSection = document.createElement('div');
    equipmentSection.className = 'equipment-section';
    
    const equipTitle = document.createElement('div');
    equipTitle.style.cssText = 'font-size: 0.9em; color: #64ffda; margin-bottom: 8px;';
    equipTitle.textContent = 'Equipment';
    equipmentSection.appendChild(equipTitle);
    
    if (unit.equipment.weapon) {
        // Determine the correct icon based on weapon type
        let weaponIcon = '<img src="ui/sword2.png" style="width: 16px; height: 16px; vertical-align: middle;">';
        
        const weaponName = unit.equipment.weapon.name.toLowerCase();
        if (weaponName.includes('bow')) {
            weaponIcon = '<img src="ui/bow.png" style="width: 16px; height: 16px; vertical-align: middle;">';
        } else if (weaponName.includes('axe')) {
            weaponIcon = '<img src="ui/axe.png" style="width: 16px; height: 16px; vertical-align: middle;">';
        } else if (weaponName.includes('mace')) {
            weaponIcon = '<img src="ui/potion.png" style="width: 16px; height: 16px; vertical-align: middle;">';
        } else if (weaponName.includes('greatsword')) {
            weaponIcon = '<img src="ui/sword.png" style="width: 16px; height: 16px; vertical-align: middle;">';
        }
        
        const weaponItem = createEquipmentItem(
            weaponIcon,
            unit.equipment.weapon.name, 
            `+${unit.equipment.weapon.damage} dmg`
        );
        equipmentSection.appendChild(weaponItem);
    } else {
        const noWeapon = document.createElement('div');
        noWeapon.style.cssText = 'color: #8892b0; font-size: 0.85em; padding: 4px 0;';
        noWeapon.textContent = 'No weapon';
        equipmentSection.appendChild(noWeapon);
    }
    if (unit.equipment.armor) {
const armorItem = createEquipmentItem(
    '<img src="ui/shield.png" style="width: 16px; height: 16px; vertical-align: middle;">',
    unit.equipment.armor.name, 
    `+${unit.equipment.armor.defense} def`
);
        equipmentSection.appendChild(armorItem);
    } else {
        const noArmor = document.createElement('div');
        noArmor.style.cssText = 'color: #8892b0; font-size: 0.85em; padding: 4px 0;';
        noArmor.textContent = 'No armor';
        equipmentSection.appendChild(noArmor);
    }
    
    rightColumn.appendChild(equipmentSection);
    
    // ====== ADD THIS SECTION AFTER EQUIPMENT SECTION ======
// Status Indicators (Injuries & Morale)
if (unit.injuries.length > 0 || unit.morale < 100 || unit.fleeing) {
    const statusSection = document.createElement('div');
    statusSection.className = 'status-indicators';
    
    // Add fleeing status
    if (unit.fleeing) {
        const fleeBadge = document.createElement('span');
        fleeBadge.className = 'status-badge fleeing';
        fleeBadge.innerHTML = '<img src="ui/running.png" style="width: 12px; height: 12px;"> Fleeing';
        statusSection.appendChild(fleeBadge);
    }
    
    // Add morale status
    if (unit.morale < 30) {
        const moraleBadge = document.createElement('span');
        moraleBadge.className = 'status-badge morale-low';
        moraleBadge.innerHTML = '<img src="ui/sad.png" style="width: 12px; height: 12px;"> Low Morale';
        statusSection.appendChild(moraleBadge);
    } else if (unit.morale > 80) {
        const moraleBadge = document.createElement('span');
        moraleBadge.className = 'status-badge morale-high';
        moraleBadge.innerHTML = '<img src="ui/happy.png" style="width: 12px; height: 12px;"> High Morale';
        statusSection.appendChild(moraleBadge);
    }
    
    // Add injuries
    unit.injuries.forEach(injury => {
        const injuryBadge = document.createElement('span');
        injuryBadge.className = 'status-badge injury';
        
        // Choose icon based on injury type
        let icon = '../ui/wound.png';
        if (injury.name.includes('Arm')) icon = 'ui/i-arm.png';
        if (injury.name.includes('Leg')) icon = 'ui/i-leg.png';
        if (injury.name.includes('Concussion')) icon = 'ui/i-head.png';
        
        injuryBadge.innerHTML = `<img src="${icon}" style="width: 12px; height: 12px;"> ${injury.name} (${injury.turnsRemaining}t)`;
        statusSection.appendChild(injuryBadge);
    });
    
    // Add to right column (or wherever you want it)
    rightColumn.appendChild(statusSection);
}

    // ====== TERRAIN EFFECTS SECTION (DYNAMIC) ======
    const terrain = gameState.terrain[unit.y][unit.x];
    const terrainEffect = TERRAIN_EFFECTS[terrain] || TERRAIN_EFFECTS.normal;
    
    // Always create terrain section
    const terrainSection = document.createElement('div');
    terrainSection.className = 'status-indicators';
    terrainSection.style.cssText = 'margin-top: 12px; padding: 10px; background: rgba(30, 73, 118, 0.4); border-radius: 6px; border: 1px solid rgba(100, 255, 218, 0.2);';
    
    const terrainHeader = document.createElement('div');
    terrainHeader.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;';
    
    const terrainIcon = document.createElement('img');
    terrainIcon.src = terrainEffect.icon;
    terrainIcon.style.cssText = 'width: 24px; height: 24px;';
    
    const terrainName = document.createElement('div');
    terrainName.style.cssText = 'font-weight: bold; font-size: 1em; color: #64ffda;';
    terrainName.textContent = terrainEffect.name.toUpperCase();
    
    const effectsList = document.createElement('div');
    effectsList.style.cssText = 'font-size: 0.85em; color: #e6f1ff; line-height: 1.4;';
    
    let effectsHTML = '';
    
    // Defensive effects
    if (terrainEffect.accuracyAgainst !== 0 || terrainEffect.damageReduction !== 0) {
        effectsHTML += '<div style="margin-bottom: 4px;"><strong>When attacked here:</strong></div>';
        
        if (terrainEffect.accuracyAgainst !== 0) {
            const sign = terrainEffect.accuracyAgainst > 0 ? '+' : '';
            effectsHTML += `<div>• ${sign}${terrainEffect.accuracyAgainst}% enemy accuracy</div>`;
        }
        
        if (terrainEffect.damageReduction !== 0) {
            if (terrainEffect.damageReduction > 0) {
                effectsHTML += `<div>• ${terrainEffect.damageReduction}% damage reduction</div>`;
            } else {
                effectsHTML += `<div>• ${Math.abs(terrainEffect.damageReduction)}% damage increase</div>`;
            }
        }
    }
    
    // Offensive effects
    if (terrainEffect.offensiveAccuracy !== 0) {
        if (effectsHTML) effectsHTML += '<div style="margin-top: 6px;">';
        effectsHTML += '<div style="margin-bottom: 4px;"><strong>When attacking from here:</strong></div>';
        const sign = terrainEffect.offensiveAccuracy > 0 ? '+' : '';
        effectsHTML += `<div>• ${sign}${terrainEffect.offensiveAccuracy}% your accuracy</div>`;
    }
    
    // Movement effects
    if (terrainEffect.movementPenalty !== 0) {
        if (effectsHTML) effectsHTML += '<div style="margin-top: 6px;">';
        if (terrainEffect.movementPenalty >= 999) {
            effectsHTML += '<div><strong>Movement:</strong> Impassable</div>';
        } else if (typeof terrainEffect.movementPenalty === 'object') {
            // Class-specific penalties (swamp)
            const penalties = [];
            if (terrainEffect.movementPenalty.knight) penalties.push(`Knight: ${terrainEffect.movementPenalty.knight}`);
            if (terrainEffect.movementPenalty.mage) penalties.push(`Mage: ${terrainEffect.movementPenalty.mage}`);
            if (terrainEffect.movementPenalty.archer) penalties.push(`Archer: ${terrainEffect.movementPenalty.archer}`);
            if (terrainEffect.movementPenalty.berserker) penalties.push(`Berserker: ${terrainEffect.movementPenalty.berserker}`);
            effectsHTML += `<div><strong>Movement:</strong> ${penalties.join(', ')}</div>`;
        } else {
            effectsHTML += `<div><strong>Movement:</strong> ${terrainEffect.movementPenalty > 0 ? '-' : '+'}${Math.abs(terrainEffect.movementPenalty)}</div>`;
        }
    }
    
    // If no effects at all (shouldn't happen with our system)
    if (!effectsHTML) {
        effectsHTML = '<div>• No terrain effects</div>';
    }
    
    effectsList.innerHTML = effectsHTML;
    
    terrainHeader.appendChild(terrainIcon);
    terrainHeader.appendChild(terrainName);
    terrainSection.appendChild(terrainHeader);
    terrainSection.appendChild(effectsList);
    rightColumn.appendChild(terrainSection);
    // ====== END TERRAIN SECTION ======
    
    // Turn Info
    const turnInfo = document.createElement('div');
    turnInfo.style.cssText = 'margin-top: 15px; padding: 8px; background: rgba(30, 73, 118, 0.2); border-radius: 4px; font-size: 0.8em; color: #8892b0;';
    
    const turnLine = document.createElement('div');
    turnLine.textContent = `Turn: ${gameState.turnCount}`;
    
    const phaseLine = document.createElement('div');
    phaseLine.textContent = `Phase: ${gameState.phase}`;
    
    const posLine = document.createElement('div');
    posLine.textContent = `Position: (${unit.x}, ${unit.y})`;
    
    turnInfo.appendChild(turnLine);
    turnInfo.appendChild(phaseLine);
    turnInfo.appendChild(posLine);
    rightColumn.appendChild(turnInfo);
    
    detailsContainer.appendChild(rightColumn);
    container.appendChild(detailsContainer);
}

// Helper functions
function getClassIcon(classType) {
    switch(classType) {
        case 'knight': 
            return '<img src="ui/knight.png" style="width: 20px; height: 20px; vertical-align: middle;">';
        case 'archer': 
            return '<img src="ui/bow.png" style="width: 20px; height: 20px; vertical-align: middle;">';
        case 'mage': 
            return '<img src="ui/potion.png" style="width: 20px; height: 20px; vertical-align: middle;">';
        case 'berserker': 
            return '<img src="ui/axe.png" style="width: 20px; height: 20px; vertical-align: middle;">';
        case 'gremlin': 
			return '<img src="ui/gremlin.png" style="width: 20px; height: 20px; vertical-align: middle;">';    
        default: 
            return '<img src="ui/shield.png" style="width: 20px; height: 20px; vertical-align: middle;">';
    }
}

function createStatBox(label, value, percent, color, barColor = null) {
    const stat = document.createElement('div');
    stat.className = 'compact-stat';
    
    const header = document.createElement('div');
    header.className = 'stat-header';
    
    const name = document.createElement('span');
    name.className = 'stat-name';
    name.textContent = label;
    
    const val = document.createElement('span');
    val.className = 'stat-value';
    val.textContent = value;
    val.style.color = barColor || color;
    
    header.appendChild(name);
    header.appendChild(val);
    stat.appendChild(header);
    
    if (percent !== undefined) {
        const bar = document.createElement('div');
        bar.className = 'compact-progress-bar';
        
        const fill = document.createElement('div');
        fill.className = 'compact-progress-fill';
        fill.style.width = `${percent}%`;
        fill.style.background = barColor || color;
        
        bar.appendChild(fill);
        stat.appendChild(bar);
    }
    
    return stat;
}

function createSimpleStat(label, value, color = '#64ffda') {
    const stat = document.createElement('div');
    stat.className = 'compact-stat';
    
    const header = document.createElement('div');
    header.className = 'stat-header';
    
    const name = document.createElement('span');
    name.className = 'stat-name';
    name.textContent = label;
    
    const val = document.createElement('span');
    val.className = 'stat-value';
    val.textContent = value;
    val.style.color = color;
    
    header.appendChild(name);
    header.appendChild(val);
    stat.appendChild(header);
    
    return stat;
}

function createEquipmentItem(icon, name, stats) {
    const item = document.createElement('div');
    item.className = 'equipment-item';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'equipment-icon';
    iconDiv.innerHTML = icon;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'equipment-name';
    nameDiv.textContent = name;
    
    const statsDiv = document.createElement('div');
    statsDiv.className = 'equipment-stats';
    statsDiv.textContent = stats;
    
    item.appendChild(iconDiv);
    item.appendChild(nameDiv);
    item.appendChild(statsDiv);
    
    return item;
}
        
      function logMessage(message, type = 'system') {
    const entry = document.createElement('div');
    
    // Auto-detect critical/important messages
    let finalType = type;
    if (message.includes('CRITICAL!') || message.includes('LEVEL UP!') || 
        message.includes('BOSS') || message.includes('heroic') ||
        message.includes('FINAL')) {
        finalType = 'critical';
    } else if (message.includes('LEVEL UP') || message.includes('level up')) {
        finalType = 'levelup';
    }
    
    entry.className = `log-entry ${finalType}`;
    entry.innerHTML = `[T${gameState.turnCount}] ${message}`;
    battleLogEl.prepend(entry);
    
    // Auto-scroll to show latest message
    battleLogEl.scrollTop = 0;
    
    if (battleLogEl.children.length > 20) { // Increased from 15
        battleLogEl.removeChild(battleLogEl.lastChild);
    }
}

 function checkVictory() {
    // First, clean up any dead units
let isCompletingLevel = false; // Add this at the top with your other gameState variables
    gameState.units = gameState.units.filter(u => u.hp > 0);
    
    // Count enemies
    const activeEnemies = gameState.units.filter(u => u.type === 'enemy');
    const activePlayers = gameState.units.filter(u => u.type === 'player');
    
    
    console.log(`🎯 Victory check - Level ${gameState.currentLevel}:`);
    console.log(`🎯 Active enemies: ${activeEnemies.length}`);
    console.log(`🎯 Active players: ${activePlayers.length}`);
    console.log(`🎯 All enemies:`, activeEnemies.map(e => `${e.name} (${e.hp} HP)`));
    console.log(`Victory check: ${activeEnemies.length} enemies left, ${activePlayers.length} players left`);
    
    if (activeEnemies.length === 0) {
		
		console.log(`🎯🎯🎯 LEVEL ${gameState.currentLevel} VICTORY - Calling completeLevel() 🎯🎯🎯`);
		
        console.log("ALL ENEMIES DEFEATED - VICTORY!");
        updateEnemiesCounter();
        
        // Small delay then complete level
        setTimeout(() => {
            completeLevel();
        }, 800);
        return;
    }
    
    if (activePlayers.length === 0) {
			
        console.log("ALL PLAYERS DEAD - DEFEAT!");
        gameState.battleStats.totalRounds = gameState.turnCount;
        setTimeout(() => {
            showBattleStats(false);
        }, 800);
        return;
    }
    
    // Update counter
    updateEnemiesCounter();
}
     
     function updateVision() {
    // Clear current visible tiles
    gameState.visibleTiles = [];
    
    // Get all player units
    const playerUnits = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    
    // For each player unit, add tiles within VISION_RANGE
    playerUnits.forEach(unit => {
        for (let dx = -VISION_RANGE; dx <= VISION_RANGE; dx++) {
            for (let dy = -VISION_RANGE; dy <= VISION_RANGE; dy++) {
                // Manhattan distance check
                if (Math.abs(dx) + Math.abs(dy) <= VISION_RANGE) {
                    const nx = unit.x + dx;
                    const ny = unit.y + dy;
                    
                    // Check bounds
                    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                        gameState.visibleTiles.push(`${nx},${ny}`);
                    }
                }
            }
        }
    });
    
    // Remove duplicates (though there shouldn't be any with Set, but just in case)
    gameState.visibleTiles = [...new Set(gameState.visibleTiles)];
}
     
     
     // ====== MUSIC FADE OUT ======
function fadeOutMusic(duration = 2000) {
    const menuMusic = document.getElementById('menuMusic');
    if (!menuMusic || menuMusic.paused) return;
    
    const startVolume = menuMusic.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
            menuMusic.pause();
            menuMusic.currentTime = 0;
            menuMusic.volume = startVolume;
            clearInterval(fadeInterval);
            console.log("🎵 Music faded out");
        } else {
            menuMusic.volume = Math.max(0, startVolume - (volumeStep * currentStep));
        }
    }, stepTime);
}
     
     
     // ========== SHOW/HIDE INTRO SPLASH ==========
function showIntroSplash() {
    document.getElementById('introOverlay').style.display = 'flex';
    disableGame();
}

function hideIntroSplash() {
    document.getElementById('introOverlay').style.display = 'none';
    
    // Simple fade out
    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        let volume = menuMusic.volume;
        const fadeOut = setInterval(() => {
            volume = Math.max(0, volume - 0.05);
            menuMusic.volume = volume;
            
            if (volume <= 0) {
                clearInterval(fadeOut);
                menuMusic.pause();
                menuMusic.currentTime = 0;
                menuMusic.volume = 0.3; // Reset for next time
            }
        }, 100);
    }
    
    enableGame();
}
    
     function cleanupUnits() {
    // Progress flee turns and remove fled/dead
    for (let i = gameState.units.length - 1; i >= 0; i--) {
        const unit = gameState.units[i];
        if (unit.fleeing) {
            unit.fleeTurns++;
            if (unit.fleeTurns >= 3) {
                logMessage(`${unit.name} has fled the battlefield!`, 'system');
                gameState.units.splice(i, 1);
                if (unit.type === 'player') {
                    gameState.battleStats.fleedUnits.push(unit);
                }
                continue;
            }
        }
        // Remove any dead stragglers
        if (unit.hp <= 0) {
            gameState.units.splice(i, 1);
        }
    }
checkVictory();
}
       
        function showBattleStats(victory) {
            statsTitle.textContent = victory ? " VICTORY! " : " DEFEAT! ";
            
            const playerUnits = gameState.units.filter(u => u.type === 'player');
            const enemyUnits = gameState.units.filter(u => u.type === 'enemy');
            const totalXP = playerUnits.reduce((sum, unit) => sum + unit.xp, 0);
            const averageLevel = playerUnits.length > 0 ? 
                (playerUnits.reduce((sum, unit) => sum + unit.level, 0) / playerUnits.length).toFixed(1) : 0;
            
            let statsHTML = `
                <div class="stats-grid">
                    <div class="stats-column">
                        <h3>Battle Statistics</h3>
                        <div class="stat-row">
                            <span class="stat-label">Total Rounds:</span>
                            <span class="stat-value-large">${gameState.battleStats.totalRounds}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Enemies Defeated:</span>
                            <span class="stat-value-large">${gameState.battleStats.playerKills}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Dealt:</span>
                            <span class="stat-value-large">${gameState.battleStats.damageDealt}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Damage Taken:</span>
                            <span class="stat-value-large">${gameState.battleStats.damageTaken}</span>
                        </div>
                    </div>
                    <div class="stats-column">
                        <h3>Unit Statistics</h3>
                        <div class="stat-row">
                            <span class="stat-label">Surviving Units:</span>
                            <span class="stat-value-large">${playerUnits.length}/${UNITS_PER_TEAM}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Fleed Units:</span>
                            <span class="stat-value-large">${gameState.battleStats.fleedUnits.length}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Total XP Earned:</span>
                            <span class="stat-value-large">${totalXP}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Average Level:</span>
                            <span class="stat-value-large">${averageLevel}</span>
                        </div>
                    </div>
                </div>
            `;
            
            if (playerUnits.length > 0) {
                statsHTML += `
                    <div class="surviving-units">
                        <h3>🏆 Surviving Heroes</h3>
                        <div class="unit-list">
                `;
                
                for (const unit of playerUnits) {
                    const icon = {
                        'knight': '⚔️',
                        'archer': '🏹',
                        'mage': '🔮',
                        'berserker': '💢'
                    }[unit.classType] || '⚔️';
                    
                    statsHTML += `
                        <div class="unit-badge player">
                            ${icon} ${unit.name} (Lvl ${unit.level}) 
                            <span style="color: #ff6b6b;">❤️ ${unit.hp}/${unit.maxHp}</span>
                        </div>
                    `;
                }
                
                statsHTML += `
                        </div>
                    </div>
                `;
            }
            
            if (gameState.battleStats.fleedUnits.length > 0) {
                statsHTML += `
                    <div class="surviving-units">
                        <h3>🏃 Fleed Units</h3>
                        <div class="unit-list">
                `;
                
                for (const unit of gameState.battleStats.fleedUnits) {
                    const icon = {
                        'knight': '⚔️',
                        'archer': '🏹',
                        'mage': '🔮',
                        'berserker': '💢'
                    }[unit.classType] || '⚔️';
                    
                    statsHTML += `
                        <div class="unit-badge enemy">
                            ${icon} ${unit.name} (Fled)
                        </div>
                    `;
                }
                
                statsHTML += `
                        </div>
                    </div>
                `;
            }
            
            statsContent.innerHTML = statsHTML;
            statsOverlay.style.display = 'flex';
            
            disableGame();
            
           if (!victory) {
        const playerUnits = gameState.units.filter(u => u.type === 'player');
        const survivors = playerUnits.length;
        const kills = gameState.battleStats.playerKills || 0;
        const xp = playerUnits.reduce((sum, u) => sum + u.xp, 0);
        
        showNameEntry(xp, gameState.currentLevel, kills, survivors, gameState.difficulty);
    }
} 
        
        function disableGame() {
            endTurnBtn.disabled = true;
            attackBtn.disabled = true;
            healBtn.disabled = true;
            cancelBtn.disabled = true;
            gameState.aiProcessing = false;
        }
        
        function enableGame() {
            endTurnBtn.disabled = false;
            attackBtn.disabled = false;
            healBtn.disabled = false;
            cancelBtn.disabled = false;
            // gameState.aiProcessing remains as is - don't enable AI here
        }
        
        function restartGame() {
            location.reload();
        }
        
        // ========== START GAME ==========
function showHealingSummaryInRecruitScreen(healingResult) {
    if (!healingResult || healingResult.totalInjuries === 0) return;
    
    // Remove old summary if exists
    const oldSummary = document.getElementById('healingSummary');
    if (oldSummary) oldSummary.remove();
    
    // Create summary div
    const summaryDiv = document.createElement('div');
    summaryDiv.id = 'healingSummary';
    summaryDiv.style.cssText = `
        margin: 20px 0;
        padding: 15px;
        background: rgba(46, 204, 113, 0.1);
        border: 1px solid #2ecc71;
        border-radius: 8px;
    `;
    
    // Header
    summaryDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px; color: #2ecc71; font-weight: bold;">
            <img src="../ui/potion.png" style="width: 20px; height: 20px;">
            BETWEEN BATTLES HEALING
            <span style="margin-left: auto; font-size: 0.9em; color: #64ffda;">
                ${healingResult.healChance}% Chance
            </span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(46, 204, 113, 0.3);">
            <span>Healed: <span style="color: #2ecc71; font-weight: bold;">${healingResult.totalHealed}</span></span>
            <span>Remaining: <span style="color: #ff6b6b; font-weight: bold;">${healingResult.remainingInjuries}</span></span>
            <span>Total: <span style="color: #e6f1ff;">${healingResult.totalInjuries}</span></span>
        </div>
    `;
    
    // Add each unit's injuries
    if (healingResult.healingLog) {
        healingResult.healingLog.forEach(unitLog => {
            const unitDiv = document.createElement('div');
            unitDiv.style.cssText = `
                margin-bottom: 10px;
                padding: 10px;
                background: rgba(30, 73, 118, 0.4);
                border-radius: 6px;
                border-left: 3px solid ${unitLog.healed.length > 0 ? '#2ecc71' : '#ff6b6b'};
            `;
            
            let html = `<div style="font-weight: bold; color: #64ffda; margin-bottom: 5px;">${unitLog.unitName}</div>`;
            
            if (unitLog.healed.length > 0) {
                html += `<div style="color: #2ecc71; font-size: 0.9em;">✓ Healed: ${unitLog.healed.join(', ')}</div>`;
            }
            if (unitLog.persisted.length > 0) {
                html += `<div style="color: #ff6b6b; font-size: 0.9em;">✗ Persists: ${unitLog.persisted.join(', ')}</div>`;
            }
            
            unitDiv.innerHTML = html;
            summaryDiv.appendChild(unitDiv);
        });
    }
    
    // Insert into recruit screen
    const recruitModal = document.querySelector('.recruit-modal');
    const hireBtn = document.getElementById('hireBtn');
    if (recruitModal && hireBtn) {
        recruitModal.insertBefore(summaryDiv, hireBtn.parentNode);
    }
}   
        
    function openRecruitScreen() {
    console.log(`🛒 Opening recruit screen for level ${gameState.currentLevel}`);
    const healingResult = healInjuriesBetweenBattles(); //Call the healing summary for injuries between levels
    showHealingSummaryInRecruitScreen(healingResult);
    
    document.getElementById('victoryOverlay').style.display = 'none';

    // Calculate recruit cost
    const recruitCost = 60 + (gameState.currentLevel * 20);

    // Random class
    const classes = ['Knight', 'Archer', 'Berserker', 'Mage'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    // Update recruit screen
    document.getElementById('recruitClass').textContent = randomClass;
    document.getElementById('recruitCost').textContent = `Cost: ${recruitCost} Gold`;
    document.getElementById('currentGold').textContent = gameState.gold;

    // Hire button state
    const hireBtn = document.getElementById('hireBtn');
    hireBtn.disabled = gameState.gold < recruitCost;

    // Store the current level for reference
    const currentLevel = gameState.currentLevel;
    
    hireBtn.onclick = () => {
        console.log(`🎯 Hire clicked for level ${currentLevel}`);
        
        if (gameState.gold >= recruitCost) {
            gameState.gold -= recruitCost;
            const newUnit = new Unit('player', `${randomClass} Recruit`, 0, 0);
            newUnit.level = 1;
            newUnit.xp = 0;
            gameState.persistentUnits.push(newUnit);
            logMessage(`Hired ${newUnit.name}!`, 'system');
        }
        
        document.getElementById('recruitOverlay').style.display = 'none';
        
        // Handle ALL level transitions consistently
        setTimeout(() => {
            console.log(`🔄 Processing post-recruit transition for level ${currentLevel}`);
            
            // Map each level to its specific transition
if (currentLevel === 1) {
    showLevel1To2Transition();
} else if (currentLevel === 2) {
    showLevel2To3Transition();
} else if (currentLevel === 3) {
    showLevel3To4Transition();
} else if (currentLevel === 4) {
    showLevel4To5Transition();
} else if (currentLevel === 5) {
    showLevel5To6Transition();
} else if (currentLevel === 6) {
    showLevel6To7Transition();    
} else if (currentLevel === 7) {
    showLevel7To8Transition();    
} else if (currentLevel === 8) {
    showLevel8To9Transition();
} else if (currentLevel === 9) {
    showLevel9To10Transition();
} else if (currentLevel === 10) {
    showGameCompleteScreen();  // ← Level 10 is final
} else {
    // Fallback - shouldn't happen
    console.error(`❌ Unknown level ${currentLevel}, defaulting to startNextLevel()`);
    startNextLevel();
}
        }, 500);
    };

    // Show recruit screen
    document.getElementById('recruitOverlay').style.display = 'flex';
}
    
// Make UI functions available globally
window.renderAll = renderAll;
window.logMessage = logMessage;
window.updateSelectedUnitDisplay = updateSelectedUnitDisplay;
window.updateUnitRoster = updateUnitRoster;
window.showIntroSplash = showIntroSplash;
window.hideIntroSplash = hideIntroSplash;
window.openRecruitScreen = openRecruitScreen;
window.showBattleStats = showBattleStats;
window.getTile = getTile;
window.updateEnemiesCounter = updateEnemiesCounter;
window.updateUI = updateUI;
window.updatePhaseIndicator = updatePhaseIndicator;
window.updateVision = updateVision;
