// Iron Resolution MAIN.JS

// ========== INITIALIZATION ==========
function init() {
        gameState.currentLevel = 1;  // ← LEVEL TO START GAME FOR TESTING
    generateTerrain();
    createGrid();
    createUnits();
    renderAll([]);
    setupEventListeners();
    
    console.log("Units count:", gameState.units.length);
console.log("Player units:", gameState.units.filter(u => u.type === 'player').length);
console.log("Enemy units:", gameState.units.filter(u => u.type === 'enemy').length);
    
    // Initialize level display
    if (document.getElementById('levelDisplay')) {
        const level = LEVELS[0];
        document.getElementById('levelDisplay').textContent = 
            `Level 1: ${level.name} (${level.difficulty})`;
    }
    
    logMessage("Welcome to Iron Resolution - Level System Active!", 'system');
    logMessage(`Starting Level 1: ${LEVELS[0].name}`, 'system');
    logMessage("Defeat all enemies to advance to the next level!", 'system');
    logMessage("Your village is on the left - defend it!", 'system');
    updateEnemiesCounter();
    updateUnitRoster();
}

function createGrid() {
    gridEl.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            const terrain = gameState.terrain[y][x];
            if (terrain !== 'normal') {
                tile.classList.add(terrain);
            }
            tile.dataset.x = x;
            tile.dataset.y = y;
            tile.addEventListener('click', () => tileClick(x, y));
            gridEl.appendChild(tile);
        }
    }
}
       
        function setupEventListeners() {
    endTurnBtn.addEventListener('click', endTurn);
    
    // Intro splash
const introBtn = document.getElementById('introContinueBtn');
    if (introBtn) {
        introBtn.addEventListener('click', hideIntroSplash);
    } else {
        console.warn("Intro button not found!");
    }

      // Heal button - sets phase to heal mode (for mages)
    healBtn.addEventListener('click', () => {
        console.log('Heal button clicked');
        if (gameState.selectedUnit && gameState.selectedUnit.canHeal) {
            gameState.phase = 'heal';
            logMessage(`${gameState.selectedUnit.name} ready to heal - click an injured ally`, 'system');
            renderAll([]);
        } else {
            console.log('Cannot heal:', {
                hasUnit: !!gameState.selectedUnit,
                canHeal: gameState.selectedUnit?.canHeal,
                classType: gameState.selectedUnit?.classType
            });
        }
    });
    
    // Add this after the heal button listener
attackBtn.addEventListener('click', () => {
    console.log('Attack button clicked');
    if (gameState.selectedUnit && gameState.selectedUnit.canAttack) {
        gameState.phase = 'attack';
        logMessage(`${gameState.selectedUnit.name} ready to attack - click an enemy`, 'system');
        renderAll([]);
    } else {
        console.log('Cannot attack:', {
            hasUnit: !!gameState.selectedUnit,
            canAttack: gameState.selectedUnit?.canAttack,
            classType: gameState.selectedUnit?.classType
        });
    }
});
    
    
    cancelBtn.addEventListener('click', cancelSelection);
    soundToggleEl.addEventListener('click', () => soundSystem.toggle());
    restartButton.addEventListener('click', restartGame);
    
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
        cancelSelection();
        return;
    }
    
    // Other key handlers...
    if (key === 'e') {
        e.preventDefault(); // Prevent default
        endTurn();
    }
    
    // Attack shortcut
    if (key === 'a' && gameState.selectedUnit && gameState.selectedUnit.canAttack) {
        e.preventDefault(); // Prevent default
        attackBtn.click();
    }
    
    // Heal shortcut
    if (key === 'h' && gameState.selectedUnit && gameState.selectedUnit.canHeal) {
        e.preventDefault(); // Prevent default
        healBtn.click();
    }
});
}
        
        // Hide overlays at game start (prevents permanent banners)
        document.getElementById('victoryOverlay').style.display = 'none';
        document.getElementById('recruitOverlay').style.display = 'none';

        function tileClick(x, y) {
    // Block input during AI turn
    if (gameState.aiProcessing) return;

            const clickedUnit = getUnitAt(x, y);
            
            // === HANDLE HEAL PHASE ===
            if (gameState.phase === 'heal' && gameState.selectedUnit) {
                const healer = gameState.selectedUnit;
                
                if (clickedUnit && 
                    clickedUnit.type === healer.type && 
                    clickedUnit.id !== healer.id &&
                    healer.canHeal) {
                    
                    const distance = Math.abs(x - healer.x) + Math.abs(y - healer.y);
                    if (distance <= healer.range) {
                        performHeal(healer, clickedUnit);
                        gameState.phase = 'select';
                        return;
                    } else {
                        logMessage("Too far to heal!", 'system');
                        return;
                    }
                }
                return;
            }
            
            // === HANDLE ATTACK PHASE ===
            if (gameState.phase === 'attack' && gameState.selectedUnit) {
                const attacker = gameState.selectedUnit;
                
                if (clickedUnit && 
                    clickedUnit.type !== attacker.type &&
                    attacker.canAttack) {
                    
                    const distance = Math.abs(x - attacker.x) + Math.abs(y - attacker.y);
                    if (distance <= attacker.range) {
                        performAttack(attacker, clickedUnit);
                        gameState.phase = 'select';
                        return;
                    } else {
                        logMessage("Out of range!", 'system');
                        return;
                    }
                }
                return;
            }
            
            // === NORMAL SELECTION/MOVEMENT ===
            // 1. If nothing selected AND clicked a unit: SELECT IT
            if (!gameState.selectedUnit && clickedUnit) {
                selectUnit(clickedUnit);
                soundSystem.playSelect();
                return;
            }
            
            // 2. If we have a selected unit
            if (gameState.selectedUnit) {
                const selected = gameState.selectedUnit;
                
                // A. Clicked on SAME unit: DESELECT
                if (clickedUnit && clickedUnit.id === selected.id) {
                    cancelSelection();
                    return;
                }
                
               // B. Clicked on DIFFERENT unit
if (clickedUnit && clickedUnit.id !== selected.id) {
    // Prevent attacking with enemy units
    if (selected.type === 'enemy') {
        logMessage("Cannot control enemy units.", 'system');
        return;
    }
    
    // Enemy unit
    if (clickedUnit.type !== selected.type) {
        // Check attack range
        const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
        if (distance <= selected.range && selected.canAttack) {
            performAttack(selected, clickedUnit);
        } else {
            logMessage("Out of range!", 'system');
        }
        return;
    }
                    
                    // Ally unit (same team) - MAGES CAN HEAL WITHOUT PHASE
else {
    // Prevent healing with enemy mages
    if (selected.type === 'enemy') {
        logMessage("Cannot control enemy units.", 'system');
        return;
    }
    
    // Check if selected unit is a mage and can heal
    if (selected.classType === 'mage' && selected.canHeal) {
                            const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
                            if (distance <= selected.range) {
                                performHeal(selected, clickedUnit);
                            } else {
                                logMessage("Too far to heal!", 'system');
                            }
                            return;
                        }
                        // Not a mage or can't heal: switch selection
                        else {
                            selectUnit(clickedUnit);
                            return;
                        }
                    }
                }
                
                // C. Clicked EMPTY tile - MOVE
if (!clickedUnit) {
    // Prevent moving enemy units
    if (selected.type === 'enemy') {
        logMessage("Cannot control enemy units.", 'system');
        return;
    }
    
    const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
    const movesLeft = selected.movement - selected.movesUsed;
    
    // Check if movement is valid
    if (distance <= movesLeft && distance > 0 && 
        gameState.terrain[y][x] !== 'water' &&
        !getUnitAt(x, y)) {
        moveUnit(selected, x, y);
    } else {
        logMessage("Can't move there!", 'system');
    }
    return;
}
            }
            
            renderAll([]);
        }
      
        // main.js - AT THE BOTTOM OF THE FILE
window.addEventListener('DOMContentLoaded', function() {
    // Initialize the game
    init();
    showIntroSplash();
});

        
// Make main functions available globally
window.init = init;
window.tileClick = tileClick;
window.setupEventListeners = setupEventListeners;
