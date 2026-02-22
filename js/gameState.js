// Iron Resolution GAMESTATE.js

    const VISION_RANGE = 3; // Tiles units can see for level 9
     
        // ========== GAME STATE ==========
        const gameState = {
    gridSize: GRID_SIZE,
    units: [],
    currentPlayer: 'player',
    selectedUnit: null,
    turnCount: 1,
    nextUnitId: 0,
    difficulty: 'normal',
    difficultyMultiplier: 1.0, 
    terrain: [],
    damagePopups: [],
    soundEnabled: true,
    aiProcessing: false,
    isUpdating: false,
    aiActiveUnit: null,
    visibleTiles: [], // Will store coordinates of visible tiles
    phase: 'select',
    highScores: JSON.parse(localStorage.getItem('ironResolutionHighScores')) || [],
    battleStats: {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    },
    // ====== ADD THESE LINES FOR LEVEL SYSTEM ======
    currentLevel: 1,
    maxLevel: 10,
    completedLevels: 0,
    persistentUnits: [], // Units that carry over between levels
    playerUpgrades: {
        damage: 0,
        health: 0,
        morale: 0
    },
    gold: 100,
    totalXP: 0,
    isBossLevel: false
};
 
function saveHighScore(playerName, xp, level, kills, survivors, difficulty) {
    const score = {
        name: playerName,
        xp: xp,
        level: level,
        kills: kills,
        survivors: survivors,
        difficulty: difficulty,
        date: new Date().toLocaleDateString()
    };
    
    // Add to array
    gameState.highScores.push(score);
    
    // Sort by XP (highest first)
    gameState.highScores.sort((a, b) => b.xp - a.xp);
    
    // Keep top 25
    if (gameState.highScores.length > 25) {
        gameState.highScores = gameState.highScores.slice(0, 25);
    }
    
    // Save to localStorage
    localStorage.setItem('ironResolutionHighScores', JSON.stringify(gameState.highScores));
    
    console.log("🏆 High score saved:", score);
} 
 
        
        // ========== DOM ELEMENTS ==========
const gridEl = document.getElementById('grid');
const turnCountEl = document.getElementById('turnCount');
const actionsLeftEl = document.getElementById('actionsLeft');
const enemiesLeftEl = document.getElementById('enemiesLeft');
const selectedUnitDisplay = document.getElementById('selectedUnitDisplay');
const battleLogEl = document.getElementById('battleLog');
const phaseIndicator = document.getElementById('phaseIndicator');
const rangeIndicator = document.getElementById('rangeIndicator');
const soundToggleEl = document.getElementById('soundToggle');
const statsOverlay = document.getElementById('statsOverlay');
const statsTitle = document.getElementById('statsTitle');
const statsContent = document.getElementById('statsContent');
const restartButton = document.getElementById('restartButton');

const endTurnBtn = document.getElementById('endTurn');
const attackBtn = document.getElementById('attackBtn');
const healBtn = document.getElementById('healBtn');
const cancelBtn = document.getElementById('cancelBtn');
  
  
 function updateEnemiesLeft() {
    const enemies = gameState.units.filter(u => u.type === 'enemy' && u.hp > 0 && !u.fleeing);
    enemiesLeftEl.textContent = enemies.length;
}

function updateTurnCount() {
    turnCountEl.textContent = gameState.turnCount;
}   

function initializeGameState() {
    gameState.units = [];
    gameState.currentPlayer = 'player';
    gameState.selectedUnit = null;
    gameState.turnCount = 1;
    gameState.nextUnitId = 0;
    gameState.terrain = [];
    gameState.phase = 'select';
    gameState.aiProcessing = false;
    gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
}

function endTurn() {
    console.log("🔄 endTurn() called, current player is:", gameState.currentPlayer);
    
    // ====== 1. CLASS-BASED MORALE RECOVERY ======
    gameState.units.forEach(unit => {
        if (!unit.fleeing && unit.hp > 0) {
            let recoveryChance = 0.2; // Base 20%
            let recoveryAmount = 5;   // Base amount
        
            // Class modifiers
            switch(unit.classType) {
                case 'knight':
                    recoveryChance = 0.3; // Knights are disciplined
                    recoveryAmount = 8;
                    break;
                case 'berserker':
                    recoveryChance = 0.25; // Berserkers are wild
                    recoveryAmount = 10; // Big jumps but less often
                    break;
                case 'mage':
                    recoveryChance = 0.15; // Mages are cerebral
                    recoveryAmount = 6;
                    break;
                case 'archer':
                    recoveryChance = 0.2; // Standard
                    recoveryAmount = 5;
                    break;
            }
        
            // Nearby allies boost recovery
            const nearbyAllies = gameState.units.filter(u => 
                u.type === unit.type && 
                u.id !== unit.id &&
                Math.abs(u.x - unit.x) + Math.abs(u.y - unit.y) <= 2
            );
        
            if (nearbyAllies.length > 0) {
                recoveryChance += 0.1 * nearbyAllies.length;
                recoveryAmount += 2 * nearbyAllies.length;
            }
        
            // Apply recovery
            if (Math.random() < recoveryChance) {
                const finalRecovery = recoveryAmount + Math.floor(Math.random() * 6);
                const oldMorale = unit.morale;
                unit.morale = Math.min(100, unit.morale + finalRecovery);
            
                if (unit.morale > oldMorale) {
                    logMessage(`${unit.name} regains courage! (+${unit.morale - oldMorale} morale)`, 'system');
                }
            }
            
            // Special: Very low morale has higher recovery chance
            if (unit.morale < 20 && Math.random() < 0.4) {
                const desperateRecovery = 10 + Math.floor(Math.random() * 11); // 10-20 morale
                unit.morale = Math.min(100, unit.morale + desperateRecovery);
                logMessage(`${unit.name} finds inner strength! (+${desperateRecovery} morale)`, 'system');
            }
        }
    });
    
    // Update the selected unit display if it's still selected
    updateSelectedUnitStats();
    
    // ====== END CLASS-BASED RECOVERY ======
    
    // ====== 2. HEROIC RALLY (KEEP THIS AS IS) ======
    gameState.units.forEach(unit => {
        if (unit.hp > 0 && unit.hp < unit.maxHp * 0.2 && unit.morale < 30) {
            if (Math.random() < 0.1) { // 10% chance
                const rallyBoost = 40 + Math.floor(Math.random() * 31); // 40-70 morale
                unit.morale = Math.min(100, unit.morale + rallyBoost);
                unit.fleeing = false;
                unit.movesUsed = 0;
                logMessage(`${unit.name} makes a heroic last stand! Morale restored!`, 'system');
            }
        }
    });
    
    // ====== 3. ADD FLEEING UNITS RALLY CHANCE (NEW) ======
    gameState.units.forEach(unit => {
        if (unit.fleeing && Math.random() < 0.15) {
            unit.fleeing = false;
            unit.morale = 30 + Math.floor(Math.random() * 21); // 30-50 morale
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.remainingActions = unit.maxActions; // Also reset actions
            logMessage(`${unit.name} rallies with renewed vigor!`, 'system');
    
            // Update display if this unit is selected
            if (gameState.selectedUnit && gameState.selectedUnit.id === unit.id) {
                updateSelectedUnitStats();
            }
        }
    });
    
    gameState.selectedUnit = null;
    
    // ====== SWITCH TURNS ======
    if (gameState.currentPlayer === 'player') {
        // Player is ending turn - switch to enemy
        console.log("👤 Player → Enemy - Resetting ENEMY units for their turn");
        
        // RESET ENEMY UNIT ACTIONS (for AI to use)
gameState.units.forEach(unit => {
    if (unit.type === 'enemy' && !unit.fleeing && unit.hp > 0) {
        unit.remainingActions = unit.maxActions;
        unit.movesUsed = 0;
        unit.attacksUsed = 0;  // Reset attack counter
        
        // Set canAttack and canHeal based on class
        if (unit.classType === 'mage') {
            unit.canAttack = false;   // Mages CANNOT attack
            unit.canHeal = true;      // Mages CAN heal
        } else {
            unit.canAttack = true;    // Other classes CAN attack
            unit.canHeal = false;     // Other classes CANNOT heal
        }
    }
});

        gameState.currentPlayer = 'enemy';
        gameState.turnCount++;
        gameState.phase = 'select';

        // Update UI
        updateTurnCount();
        updateEnemiesLeft();
        updatePhaseIndicator();
        
        logMessage(`--- ENEMY TURN ${gameState.turnCount} ---`, 'system');
        
        // Clear highlights
        updateVision();
        renderAll([]);
        
        // Start AI turn after a short delay
        setTimeout(aiTurn, 1000);
        updateVision();
    } else {
        // Enemy is ending turn - switch BACK to player
        console.log("👹 Enemy → Player - Resetting PLAYER units for their turn");
        
        // RESET PLAYER UNIT ACTIONS (for player to use)
gameState.units.forEach(unit => {
    if (unit.type === 'player' && !unit.fleeing && unit.hp > 0) {
        console.log(`Resetting ${unit.name} (${unit.classType}): remainingActions=${unit.remainingActions}→${unit.maxActions}`);
        unit.remainingActions = unit.maxActions;
        unit.movesUsed = 0;
        unit.attacksUsed = 0;  // Reset attack counter
        
        // Set canAttack and canHeal based on class
        if (unit.classType === 'mage') {
            unit.canAttack = false;   // Mages CANNOT attack
            unit.canHeal = true;      // Mages CAN heal
        } else {
            unit.canAttack = true;    // Other classes CAN attack
            unit.canHeal = false;     // Other classes CANNOT heal
        }
    }
});

        gameState.currentPlayer = 'player';
        gameState.phase = 'select';
        
        // Update UI
        updatePhaseIndicator();
        updateUI();
        updateUnitRoster();
        
        logMessage(`--- PLAYER TURN ${gameState.turnCount} ---`, 'system');
        
        // Clear highlights
        updateVision();
        renderAll([]);
        
        // DO NOT call aiTurn - it's player's turn now
    }
}
function healInjuriesBetweenBattles() {
    console.log("=== HEALING PHASE ===");
    
    // Get all player units (using type, not team)
    const playerUnits = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    
    if (playerUnits.length === 0) return null;
    
    // Find highest level mage
    const mages = playerUnits.filter(u => u.classType === 'mage');
    let mageLevelBonus = 0;
    
    if (mages.length > 0) {
        // Get highest mage level (default to 1 if level undefined)
        const highestMage = mages.reduce((max, mage) => 
            (mage.level || 1) > (max.level || 1) ? mage : max
        , mages[0]);
        
        mageLevelBonus = (highestMage.level || 1) * 10;
        console.log(`Highest mage level: ${highestMage.level || 1} (+${mageLevelBonus}% healing chance)`);
    }
    
    // Base 30% + mage bonus
    const baseHealChance = 30 + mageLevelBonus;
    
    let totalHealed = 0;
    let totalInjuries = 0;
    let healingLog = []; // Store details for UI display
    
    // Check each player unit
    playerUnits.forEach(unit => {
        if (!unit.injuries || unit.injuries.length === 0) return;
        
        console.log(`\n${unit.name} (${unit.classType}):`);
        console.log(`Injuries: ${unit.injuries.length}`);
        
        const remainingInjuries = [];
        const unitLog = {
            unitName: unit.name,
            classType: unit.classType,
            healed: [],
            persisted: []
        };
        
        // Roll for each injury independently
        unit.injuries.forEach(injury => {
            totalInjuries++;
            
            // Random roll 1-100
            const roll = Math.floor(Math.random() * 100) + 1;
            const healed = roll <= baseHealChance;
            
            console.log(`  • ${injury.name}: rolled ${roll}% (needed ≤${baseHealChance}%) - ${healed ? 'HEALED ✓' : 'persists'}`);
            
            if (healed) {
    totalHealed++;
    unitLog.healed.push(injury.name);
    logMessage(`${unit.name}'s ${injury.name} healed between battles!`, 'heal');
    
    // REVERSE THE INJURY EFFECTS
    if (injury.effect.hp) unit.hp -= injury.effect.hp;
    if (injury.effect.attack) unit.attack -= injury.effect.attack;
    if (injury.effect.movement) unit.movement -= injury.effect.movement;
    if (injury.effect.accuracy) unit.accuracy -= injury.effect.accuracy;
    
} else {
    remainingInjuries.push(injury);
    unitLog.persisted.push(injury.name);
}
        });
        
        // Update unit with remaining injuries
        unit.injuries = remainingInjuries;
        
        // Update morale if all injuries healed
        if (unit.injuries.length === 0) {
            console.log(`  All injuries healed for ${unit.name}!`);
            // Small morale boost when fully recovered
            unit.morale = Math.min(100, (unit.morale || 100) + 15);
        }
        
        if (unitLog.healed.length > 0 || unitLog.persisted.length > 0) {
            healingLog.push(unitLog);
        }
    });
    
    console.log(`\n=== HEALING SUMMARY ===`);
    console.log(`Total injuries: ${totalInjuries}`);
    console.log(`Healed: ${totalHealed}`);
    console.log(`Remaining: ${totalInjuries - totalHealed}`);
    console.log(`Healing chance: ${baseHealChance}%`);
    
    return {
        totalInjuries,
        totalHealed,
        remainingInjuries: totalInjuries - totalHealed,
        healChance: baseHealChance,
        mageLevelBonus,
        healingLog
    };
}

// Helper function to get current healing chance for display
function getCurrentHealChance() {
    const playerUnits = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    const mages = playerUnits.filter(u => u.classType === 'mage');
    
    let mageLevelBonus = 0;
    if (mages.length > 0) {
        const highestMage = mages.reduce((max, mage) => 
            (mage.level || 1) > (max.level || 1) ? mage : max
        , mages[0]);
        mageLevelBonus = (highestMage.level || 1) * 10;
    }
    
    return {
        base: 30,
        mageBonus: mageLevelBonus,
        total: 30 + mageLevelBonus
    };
}

// Add healing summary to recruit screen
function showHealingSummaryInRecruitScreen(healingResult) {
    if (!healingResult || healingResult.totalInjuries === 0) {
        // No injuries to heal - show nothing or a simple message
        const existingSummary = document.getElementById('healingSummary');
        if (existingSummary) existingSummary.remove();
        return;
    }
    
    // Remove existing summary if any
    const existingSummary = document.getElementById('healingSummary');
    if (existingSummary) existingSummary.remove();
    
    // Create healing summary section
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
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 15px;
        color: #2ecc71;
        font-weight: bold;
    `;
    header.innerHTML = `
        <img src="../ui/potion.png" style="width: 20px; height: 20px;">
        BETWEEN BATTLES HEALING
        <span style="margin-left: auto; font-size: 0.9em; color: #64ffda;">
            ${healingResult.healChance}% Chance
        </span>
    `;
    summaryDiv.appendChild(header);
    
    // Healing chance breakdown
    const chanceBreakdown = document.createElement('div');
    chanceBreakdown.style.cssText = `
        font-size: 0.85em;
        color: #8892b0;
        margin-bottom: 15px;
        padding: 8px;
        background: rgba(100, 255, 218, 0.1);
        border-radius: 4px;
    `;
    chanceBreakdown.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <span>Base Recovery Chance:</span>
            <span style="color: #e6f1ff;">30%</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span>Mage Level Bonus (+${healingResult.mageLevelBonus}%):</span>
            <span style="color: #2ecc71;">+${healingResult.mageLevelBonus}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-weight: bold;">
            <span>TOTAL HEALING CHANCE:</span>
            <span style="color: #2ecc71;">${healingResult.healChance}%</span>
        </div>
    `;
    summaryDiv.appendChild(chanceBreakdown);
    
    // Summary stats
    const stats = document.createElement('div');
    stats.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(46, 204, 113, 0.3);
    `;
    stats.innerHTML = `
        <span>Injuries Healed: <span style="color: #2ecc71; font-weight: bold;">${healingResult.totalHealed}</span></span>
        <span>Remaining: <span style="color: #ff6b6b; font-weight: bold;">${healingResult.remainingInjuries}</span></span>
        <span>Total: <span style="color: #e6f1ff;">${healingResult.totalInjuries}</span></span>
    `;
    summaryDiv.appendChild(stats);
    
    // Detailed unit-by-unit breakdown
    if (healingResult.healingLog && healingResult.healingLog.length > 0) {
        const details = document.createElement('div');
        details.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            padding-right: 5px;
        `;
        
        healingResult.healingLog.forEach(unitLog => {
            const unitEntry = document.createElement('div');
            unitEntry.style.cssText = `
                margin-bottom: 12px;
                padding: 10px;
                background: rgba(30, 73, 118, 0.4);
                border-radius: 6px;
                border-left: 3px solid ${unitLog.healed.length > 0 ? '#2ecc71' : '#ff6b6b'};
            `;
            
            let icon = '';
            switch(unitLog.classType) {
                case 'knight': icon = '<img src="../ui/knight.png" style="width: 16px; height: 16px;">'; break;
                case 'archer': icon = '<img src="../ui/bow.png" style="width: 16px; height: 16px;">'; break;
                case 'mage': icon = '<img src="../ui/potion.png" style="width: 16px; height: 16px;">'; break;
                case 'berserker': icon = '<img src="../ui/axe.png" style="width: 16px; height: 16px;">'; break;
                default: icon = '<img src="../ui/shield.png" style="width: 16px; height: 16px;">';
            }
            
            let html = `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                ${icon}
                <span style="font-weight: bold; color: #64ffda;">${unitLog.unitName}</span>
            </div>`;
            
            if (unitLog.healed.length > 0) {
                html += `<div style="color: #2ecc71; font-size: 0.9em; margin-bottom: 4px;">
                    ✓ Healed: ${unitLog.healed.join(', ')}
                </div>`;
            }
            
            if (unitLog.persisted.length > 0) {
                html += `<div style="color: #ff6b6b; font-size: 0.9em;">
                    ✗ Persists: ${unitLog.persisted.join(', ')}
                </div>`;
            }
            
            unitEntry.innerHTML = html;
            details.appendChild(unitEntry);
        });
        
        summaryDiv.appendChild(details);
    }
    
    // Insert into recruit screen (above the hire button)
    const recruitModal = document.querySelector('.recruit-modal');
    if (recruitModal) {
        const hireBtn = document.getElementById('hireBtn');
        if (hireBtn) {
            recruitModal.insertBefore(summaryDiv, hireBtn.parentNode || hireBtn);
        }
    }
}

// Modified openRecruitScreen function
const originalOpenRecruitScreen = window.openRecruitScreen;
window.openRecruitScreen = function() {
    console.log(`🛒 Opening recruit screen for level ${gameState.currentLevel}`);
    
    // ====== HEAL INJURIES BETWEEN BATTLES ======
    const healingResult = healInjuriesBetweenBattles();
    
    // Continue with original recruit screen logic
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

    // Show healing summary if there were injuries
    if (healingResult && healingResult.totalInjuries > 0) {
        showHealingSummaryInRecruitScreen(healingResult);
    }

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
        console.log(`🔍 PREVIOUS LEVEL SHOULD BE:`, gameState.completedLevels);
        console.log(`🔍 STACK TRACE:`, new Error().stack);
            
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
				showGameCompleteScreen(); 
			} else {
                // Fallback - shouldn't happen
                console.error(`❌ Unknown level ${currentLevel}, defaulting to startNextLevel()`);
                startNextLevel();
            }
        }, 500);
    };

    // Show recruit screen
    document.getElementById('recruitOverlay').style.display = 'flex';
};

function showNameEntry(xp, level, kills, survivors, difficulty) {
    console.log("📝 showNameEntry called");
    
    // Set a flag that name entry is active
window.nameEntryActive = true;
    
    // Remove any existing name entry modal
    const existing = document.getElementById('dynamicNameEntry');
    if (existing) existing.remove();
    
    // Create modal from scratch
    const modal = document.createElement('div');
    modal.id = 'dynamicNameEntry';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 20000;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
        <div class="intro-modal" style="max-width: 400px;">
            <div class="intro-title" style="font-size: 1.8em; margin-bottom: 20px;">
                <img src="ui/trophy1.png" style="width: 34px; height: 34px; vertical-align: middle;">
                NEW HIGH SCORE!
            </div>
            
            <div style="margin: 25px 0; text-align: left;">
                <div style="color: #64ffda; margin-bottom: 8px;">Enter your name:</div>
                <input type="text" id="dynamicNameInput" maxlength="20" placeholder="Champion" 
                    style="width: 100%; padding: 10px; background: #1e4976; border: 2px solid #64ffda; 
                    color: white; border-radius: 5px; font-size: 1.2em;">
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="dynamicSaveBtn" class="intro-continue-btn" style="padding: 10px 25px;">
                    <img src="ui/tick.png" style="width: 16px; height: 16px;">
                    SAVE SCORE
                </button>
                <button id="dynamicSkipBtn" class="cancel-btn" style="padding: 10px 25px;">
                    <img src="ui/cancel.png" style="width: 16px; height: 16px;">
                    SKIP
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus the input
    setTimeout(() => document.getElementById('dynamicNameInput').focus(), 100);
    
    // Set up save button
    document.getElementById('dynamicSaveBtn').onclick = () => {
        const name = document.getElementById('dynamicNameInput').value.trim();
        if (name === '') {
            alert('Please enter a name');
            return;
        }
        
        saveHighScore(name, xp, level, kills, survivors, difficulty);
        modal.remove();
        window.nameEntryActive = false;
        showHallOfFame();
    };
    
    // Set up skip button
    document.getElementById('dynamicSkipBtn').onclick = () => {
        modal.remove();
        window.nameEntryActive = false; 
        enableGame();
    };
}


function showHallOfFame() {
    // Create modal if it doesn't exist
    let hallModal = document.getElementById('hallOfFameModal');
    
    if (!hallModal) {
        hallModal = document.createElement('div');
        hallModal.id = 'hallOfFameModal';
        hallModal.style.zIndex = '15000'; 
        hallModal.className = 'stats-overlay'; // Reuse existing style
        document.body.appendChild(hallModal);
    }
    
    // Build the table
    let html = `
        <div class="stats-modal" style="max-width: 800px;">
            <div class="stats-header">
                <img src="ui/trophy1.png" style="width: 34px; height: 34px; vertical-align: middle;">
                HALL OF FAME
                <img src="ui/trophy1.png" style="width: 34px; height: 34px; vertical-align: middle;">
            </div>
            <div style="max-height: 500px; overflow-y: auto;">
                <table style="width: 100%; color: #e6f1ff; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #64ffda;">
                            <th style="padding: 10px; text-align: left;"></th>
                            <th style="padding: 10px; text-align: left;">Name</th>
                            <th style="padding: 10px; text-align: right;">XP</th>
                            <th style="padding: 10px; text-align: center;">Level</th>
                            <th style="padding: 10px; text-align: right;">Kills</th>
                            <th style="padding: 10px; text-align: center;">Units</th>
                            <th style="padding: 10px; text-align: left;">Difficulty</th>
                            <th style="padding: 10px; text-align: left;">Date</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    if (gameState.highScores.length === 0) {
        html += `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #8892b0;">
                    No scores yet. Complete a campaign to enter the Hall of Fame!
                </td>
            </tr>
        `;
    } else {
        gameState.highScores.forEach((score, index) => {
            const rank = index + 1;
            let rankIcon = '';
            if (rank === 1) rankIcon = '🥇 ';
            else if (rank === 2) rankIcon = '🥈 ';
            else if (rank === 3) rankIcon = '🥉 ';
            
            const survivorsClass = score.survivors >= 4 ? '#2ecc71' : '#ff6b6b';
            
            html += `
                <tr style="border-bottom: 1px solid #1e4976;">
                    <td style="padding: 8px; text-align: left; font-size: 1.2em;">${rankIcon}</td>
                    <td style="padding: 8px; text-align: left; color: #64ffda;">${score.name}</td>
                    <td style="padding: 8px; text-align: right;">${score.xp}</td>
                    <td style="padding: 8px; text-align: center;">${score.level}</td>
                    <td style="padding: 8px; text-align: right;">${score.kills}</td>
                    <td style="padding: 8px; text-align: center; color: ${survivorsClass};">${score.survivors}</td>
                    <td style="padding: 8px; text-align: left;">${score.difficulty}</td>
                    <td style="padding: 8px; text-align: left;">${score.date}</td>
                </tr>
            `;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
            <button id="closeHallBtn" class="restart-button primary" style="margin-top: 20px;">
                CLOSE
            </button>
        </div>
    `;
    
    hallModal.innerHTML = html;
    hallModal.style.display = 'flex';
    
    document.getElementById('closeHallBtn').onclick = () => {
        hallModal.style.display = 'none';
    };
}

// Make functions globally available
window.healInjuriesBetweenBattles = healInjuriesBetweenBattles;
window.getCurrentHealChance = getCurrentHealChance;
window.gameState = gameState;
window.endTurn = endTurn;
window.updateEnemiesLeft = updateEnemiesLeft;
window.updateTurnCount = updateTurnCount;
window.initializeGameState = initializeGameState;
window.saveHighScore = saveHighScore;
window.showHallOfFame = showHallOfFame;
