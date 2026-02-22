// Iron Resolution MAIN.JS

let gameInitialized = false;

// ========== INITIALIZATION ==========
function init() {
        if (window.tutorialActive === true) {
        console.log("Tutorial mode active - completely skipping init");
        return;
    }
    
    
    gameState.currentLevel = 7;  // ← LEVEL TO START GAME FOR TESTING
    generateTerrain();
    createGrid();
    createUnits();
    updateVision();
    renderAll([]);
    setupEventListeners();
    
    // Set displays
	document.getElementById('levelNameDisplay').textContent = 	
    `${gameState.currentLevel}: ${LEVELS[gameState.currentLevel - 1].name}`;
    document.getElementById('difficultyDisplay').textContent = gameState.difficulty.toUpperCase();
    
    console.log("Units count:", gameState.units.length);
    console.log("Player units:", gameState.units.filter(u => u.type === 'player').length);
    console.log("Enemy units:", gameState.units.filter(u => u.type === 'enemy').length);
      
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

// Quit button
document.getElementById('quitGameBtn').addEventListener('click', showQuitConfirmation);

// Help/Instructions button
document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('instructionsOverlay').style.display = 'flex';
});

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
    // If name entry is active, don't trigger game shortcuts
    if (window.nameEntryActive) {
        return;
    }
    
    const key = e.key.toLowerCase();
    
    // Space to continue intro (check if intro is visible)
    if ((e.code === 'Space' || key === ' ') && 
        document.getElementById('introOverlay').style.display === 'flex') {
        hideIntroSplash();
        e.preventDefault();
        return;
    }
    
    // Escape key - call cancelSelection directly
    if (key === 'escape' || e.code === 'Escape') {
        e.preventDefault();
        cancelSelection();
        return;
    }
    
    // Other key handlers...
    if (key === 'e') {
        e.preventDefault();
        endTurn();
    }
    
    // Attack shortcut
    if (key === 'a' && gameState.selectedUnit && gameState.selectedUnit.canAttack) {
        e.preventDefault();
        attackBtn.click();
    }
    
    // Heal shortcut
    if (key === 'h' && gameState.selectedUnit && gameState.selectedUnit.canHeal) {
        e.preventDefault();
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
    // If we have an enemy selected, just select the new unit
    if (selected.type === 'enemy') {
        selectUnit(clickedUnit);
        return;
    }
    
    // If clicked on an enemy unit
    if (clickedUnit.type !== selected.type) {
        // Check attack range
        const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
        if (distance <= selected.range && selected.canAttack) {
            performAttack(selected, clickedUnit);
        } else {
            // If out of range, just select the enemy to view stats
            selectUnit(clickedUnit);
        }
        return;
    }
                    
    // Ally unit (same team)
    else {
        // Check if selected unit is a mage and can heal
        if (selected.classType === 'mage' && selected.canHeal) {
            const distance = Math.abs(x - selected.x) + Math.abs(y - selected.y);
            if (distance <= selected.range) {
                performHeal(selected, clickedUnit);
                return;
            }
        }
        // Not a mage, can't heal, or out of range: switch selection
        selectUnit(clickedUnit);
        return;
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

function showQuitConfirmation() {
    // Create modal if it doesn't exist
    let quitModal = document.getElementById('quitModal');
    
    if (!quitModal) {
        quitModal = document.createElement('div');
        quitModal.id = 'quitModal';
        quitModal.className = 'modal-overlay';
        quitModal.innerHTML = `
            <div class="modal-content">
                <h3>Return to Main Menu?</h3>
                <p>Current progress will be lost.</p>
                <div class="modal-buttons">
                    <button id="confirmQuitBtn" class="modal-btn confirm">QUIT</button>
                    <button id="cancelQuitBtn" class="modal-btn cancel">CANCEL</button>
                </div>
            </div>
        `;
        document.body.appendChild(quitModal);
        
        // Add event listeners
        document.getElementById('confirmQuitBtn').addEventListener('click', returnToMainMenu);
        document.getElementById('cancelQuitBtn').addEventListener('click', () => {
            quitModal.style.display = 'none';
        });
    }
    
    quitModal.style.display = 'flex';
}

function returnToMainMenu() {
    // Calculate stats before quitting
    const playerUnits = gameState.units.filter(u => u.type === 'player');
    const survivors = playerUnits.length;
    const kills = gameState.battleStats.playerKills || 0;
    const xp = gameState.totalXP;
    
    // Hide quit modal
    document.getElementById('quitModal').style.display = 'none';
    
    // Show name entry
    showNameEntry(xp, gameState.currentLevel, kills, survivors, gameState.difficulty);
    
    // Return to main menu after a short delay
    setTimeout(() => {
        document.querySelector('.game-container').style.display = 'none';
        document.getElementById('mainMenuOverlay').style.display = 'flex';
        initializeGameState();
        console.log("After reset - totalXP:", gameState.totalXP);
    }, 1000);
}

      
        // main.js - AT THE BOTTOM OF THE FILE
window.addEventListener('DOMContentLoaded', function() {
    // Don't auto-start the game
    // Just make sure the menu is visible
    console.log("Page loaded - waiting for user to choose");
    document.getElementById('mainMenuOverlay').style.display = 'flex';
});
        
// Make main functions available globally
window.init = init;
window.tileClick = tileClick;
window.setupEventListeners = setupEventListeners;
