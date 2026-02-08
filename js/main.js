// ========== CORE GAME FLOW ==========
function init() {
    window.gameState.currentLevel = 1;  // ← LEVEL TO START GAME FOR TESTING
    if (window.generateTerrain) window.generateTerrain();
    if (window.createGrid) window.createGrid();
    if (window.createUnits) window.createUnits();
    if (window.renderAll) window.renderAll([]);
    if (window.setupEventListeners) window.setupEventListeners();
    
    // Initialize level display
    if (document.getElementById('levelDisplay')) {
        const level = LEVELS[0];
        document.getElementById('levelDisplay').textContent = 
            `Level 1: ${level.name} (${level.difficulty})`;
    }
    
    if (window.logMessage) {
        window.logMessage("Welcome to Iron Resolution - Level System Active!", 'system');
        window.logMessage(`Starting Level 1: ${LEVELS[0].name}`, 'system');
        window.logMessage("Defeat all enemies to advance to the next level!", 'system');
        window.logMessage("Your village is on the left - defend it!", 'system');
    }
    
    if (window.updateEnemiesCounter) window.updateEnemiesCounter();
}

function tileClick(x, y) {
    // Block input during AI turn
    if (window.gameState.aiProcessing) return;

    const clickedUnit = getUnitAt(x, y);
    
    // === HANDLE HEAL PHASE ===
    if (window.gameState.phase === 'heal' && window.gameState.selectedUnit) {
        const healer = window.gameState.selectedUnit;
        
        if (clickedUnit && 
            clickedUnit.type === healer.type && 
            clickedUnit.id !== healer.id &&
            healer.canHeal) {
            
            const distance = Math.abs(x - healer.x) + Math.abs(y - healer.y);
            if (distance <= healer.range) {
                if (window.performHeal) window.performHeal(healer, clickedUnit);
                window.gameState.phase = 'select';
                return;
            } else {
                if (window.logMessage) window.logMessage("Too far to heal!", 'system');
                return;
            }
        }
        return;
    }
    
    // === HANDLE ATTACK PHASE ===
    if (window.gameState.phase === 'attack' && window.gameState.selectedUnit) {
        const attacker = window.gameState.selectedUnit;
        
        if (clickedUnit && 
            clickedUnit.type !== attacker.type &&
            attacker.canAttack) {
            
            const distance = Math.abs(x - attacker.x) + Math.abs(y - attacker.y);
            if (distance <= attacker.range) {
                if (window.performAttack) window.performAttack(attacker, clickedUnit);
                window.gameState.phase = 'select';
                return;
            } else {
                if (window.logMessage) window.logMessage("Out of range!", 'system');
                return;
            }
        }
        return;
    }
    
    // === NORMAL SELECTION/MOVEMENT ===
    // 1. If nothing selected AND clicked a unit: SELECT IT
    if (!window.gameState.selectedUnit && clickedUnit) {
        if (window.selectUnit) window.selectUnit(clickedUnit);
        if (window.soundSystem) window.soundSystem.playSelect();
        return;
    }
    
    // 2. If we have a selected unit
    if (window.gameState.selectedUnit) {
        const selected = window.gameState.selectedUnit;
        
        // A. Clicked on SAME unit: DESELECT
        if (clickedUnit && clickedUnit.id === selected.id) {
            if (window.cancelSelection) window.cancelSelection();
            return;
        }
        
        // B. Clicked on DIFFERENT unit
        if (clickedUnit && clickedUnit.id !== selected.id) {
            // Prevent attacking with enemy units
            if (selected.type === 'enemy') {
                if (window.logMessage) window.logMessage("Cannot control enemy units.", 'system');
                return;
            }
            
            // Enemy unit
            if (clickedUnit.type !== selected.type) {
                // Check attack range
                const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
                if (distance <= selected.range && selected.canAttack) {
                    if (window.performAttack) window.performAttack(selected, clickedUnit);
                } else {
                    if (window.logMessage) window.logMessage("Out of range!", 'system');
                }
                return;
            }
            
            // Ally unit (same team) - MAGES CAN HEAL WITHOUT PHASE
            else {
                // Prevent healing with enemy mages
                if (selected.type === 'enemy') {
                    if (window.logMessage) window.logMessage("Cannot control enemy units.", 'system');
                    return;
                }
                
                // Check if selected unit is a mage and can heal
                if (selected.classType === 'mage' && selected.canHeal) {
                    const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
                    if (distance <= selected.range) {
                        if (window.performHeal) window.performHeal(selected, clickedUnit);
                    } else {
                        if (window.logMessage) window.logMessage("Too far to heal!", 'system');
                    }
                    return;
                }
                // Not a mage or can't heal: switch selection
                else {
                    if (window.selectUnit) window.selectUnit(clickedUnit);
                    return;
                }
            }
        }
        
        // C. Clicked EMPTY tile - MOVE
        if (!clickedUnit) {
            // Prevent moving enemy units
            if (selected.type === 'enemy') {
                if (window.logMessage) window.logMessage("Cannot control enemy units.", 'system');
                return;
            }
            
            const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
            const movesLeft = selected.movement - selected.movesUsed;
            
            // Check if movement is valid
            if (distance <= movesLeft && distance > 0 && 
                window.gameState.terrain[y][x] !== 'water' &&
                !getUnitAt(x, y)) {
                if (window.moveUnit) window.moveUnit(selected, x, y);
            } else {
                if (window.logMessage) window.logMessage("Can't move there!", 'system');
            }
            return;
        }
    }
    
    if (window.renderAll) window.renderAll([]);
}

function endTurn() {
    window.gameState.turnCount++;
    if (window.domElements?.turnCountEl) window.domElements.turnCountEl.textContent = window.gameState.turnCount;
    
    // ====== 1. CLASS-BASED MORALE RECOVERY ======
    window.gameState.units.forEach(unit => {
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
            const nearbyAllies = window.gameState.units.filter(u => 
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
                    if (window.logMessage) window.logMessage(`${unit.name} regains courage! (+${unit.morale - oldMorale} morale)`, 'system');
                }
            }
            
            // Special: Very low morale has higher recovery chance
            if (unit.morale < 20 && Math.random() < 0.4) {
                const desperateRecovery = 10 + Math.floor(Math.random() * 11); // 10-20 morale
                unit.morale = Math.min(100, unit.morale + desperateRecovery);
                if (window.logMessage) window.logMessage(`${unit.name} finds inner strength! (+${desperateRecovery} morale)`, 'system');
            }
        }
    });
    
    // Update the selected unit display if it's still selected
    if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
    
    // ====== 2. HEROIC RALLY (KEEP THIS AS IS) ======
    window.gameState.units.forEach(unit => {
        if (unit.hp > 0 && unit.hp < unit.maxHp * 0.2 && unit.morale < 30) {
            if (Math.random() < 0.1) { // 10% chance
                const rallyBoost = 40 + Math.floor(Math.random() * 31); // 40-70 morale
                unit.morale = Math.min(100, unit.morale + rallyBoost);
                unit.fleeing = false;
                unit.movesUsed = 0;
                if (window.logMessage) window.logMessage(`${unit.name} makes a heroic last stand! Morale restored!`, 'system');
            }
        }
    });
    
    // ====== 3. ADD FLEEING UNITS RALLY CHANCE (NEW) ======
    window.gameState.units.forEach(unit => {
        if (unit.fleeing && Math.random() < 0.15) {
            unit.fleeing = false;
            unit.morale = 30 + Math.floor(Math.random() * 21); // 30-50 morale
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.remainingActions = unit.maxActions; // Also reset actions
            if (window.logMessage) window.logMessage(`${unit.name} rallies with renewed vigor!`, 'system');
            
            // Update display if this unit is selected
            if (window.gameState.selectedUnit && window.gameState.selectedUnit.id === unit.id) {
                if (window.updateSelectedUnitStats) window.updateSelectedUnitStats();
            }
        }
    });
    
    // Handle fleeing player units
    const playerUnits = window.gameState.units.filter(u => u.type === 'player');
    for (const unit of playerUnits) {
        if (unit.fleeing) {
            const removed = unit.performFlee();
            if (removed) {
                window.gameState.units = window.gameState.units.filter(u => u.id !== unit.id);
            }
        }
    }
    
    // Handle fleeing enemy units
    const enemyUnits = window.gameState.units.filter(u => u.type === 'enemy');
    for (const unit of enemyUnits) {
        if (unit.fleeing) {
            const removed = unit.performFlee();
            if (removed) {
                window.gameState.units = window.gameState.units.filter(u => u.id !== unit.id);
            }
        }
    }
    
    if (window.cleanupUnits) window.cleanupUnits();  // Final cleanup before turn switch

    window.gameState.currentPlayer = window.gameState.currentPlayer === 'player' ? 'enemy' : 'player';
    
    // Reset all units of new player's turn
    window.gameState.units.forEach(unit => {
        if (unit.type === window.gameState.currentPlayer && !unit.fleeing) {
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
        }
    });
    
    window.gameState.selectedUnit = null;
    
    if (window.logMessage) window.logMessage(`--- TURN ${window.gameState.turnCount}: ${window.gameState.currentPlayer.toUpperCase()} ---`, 'system');
    
    if (window.gameState.currentPlayer === 'enemy') {
        setTimeout(window.aiTurn, 1000);
    }
    
    if (window.renderAll) window.renderAll([]);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    if (window.domElements?.endTurnBtn) {
        window.domElements.endTurnBtn.addEventListener('click', endTurn);
    }
    
    // Intro splash
    const introBtn = document.getElementById('introContinueBtn');
    if (introBtn) {
        introBtn.addEventListener('click', hideIntroSplash);
    } else {
        console.warn("Intro button not found!");
    }

    // Heal button - sets phase to heal mode (for mages)
    if (window.domElements?.healBtn) {
        window.domElements.healBtn.addEventListener('click', () => {
            console.log('Heal button clicked');
            if (window.gameState.selectedUnit && window.gameState.selectedUnit.canHeal) {
                window.gameState.phase = 'heal';
                if (window.logMessage) window.logMessage(`${window.gameState.selectedUnit.name} ready to heal - click an injured ally`, 'system');
                if (window.renderAll) window.renderAll([]);
            } else {
                console.log('Cannot heal:', {
                    hasUnit: !!window.gameState.selectedUnit,
                    canHeal: window.gameState.selectedUnit?.canHeal,
                    classType: window.gameState.selectedUnit?.classType
                });
            }
        });
    }
    
    if (window.domElements?.cancelBtn) {
        window.domElements.cancelBtn.addEventListener('click', cancelSelection);
    }
    
    if (window.domElements?.soundToggleEl) {
        window.domElements.soundToggleEl.addEventListener('click', () => {
            if (window.soundSystem) window.soundSystem.toggle();
        });
    }
    
    if (window.domElements?.restartButton) {
        window.domElements.restartButton.addEventListener('click', restartGame);
    }
    
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        // Space to continue intro (check if intro is visible)
        if ((e.code === 'Space' || key === ' ') && 
            document.getElementById('introOverlay').style.display === 'flex') {
            hideIntroSplash();
            e.preventDefault(); // Prevent space from scrolling
            return;
        }
        
        // Escape key - call cancelSelection directly
        if (key === 'escape' || e.code === 'Escape') {
            e.preventDefault(); // Prevent default escape behavior
            if (window.cancelSelection) window.cancelSelection();
            return;
        }
        
        // Other key handlers...
        if (key === 'e') {
            e.preventDefault(); // Prevent default
            endTurn();
        }
        
        // Attack shortcut
        if (key === 'a' && window.gameState.selectedUnit && window.gameState.selectedUnit.canAttack) {
            e.preventDefault(); // Prevent default
            if (window.domElements?.attackBtn) window.domElements.attackBtn.click();
        }
        
        // Heal shortcut
        if (key === 'h' && window.gameState.selectedUnit && window.gameState.selectedUnit.canHeal) {
            e.preventDefault(); // Prevent default
            if (window.domElements?.healBtn) window.domElements.healBtn.click();
        }
    });
}

// ========== START GAME ==========
// Hide overlays at game start (prevents permanent banners)
document.getElementById('victoryOverlay').style.display = 'none';
document.getElementById('recruitOverlay').style.display = 'none';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
    showIntroSplash();
});

// Make core functions globally available
window.init = init;
window.tileClick = tileClick;
window.endTurn = endTurn;
window.setupEventListeners = setupEventListeners;
