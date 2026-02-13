// Iron Resolution BATTLE MANAGER.js
// Handles setting up battles for each level

const BattleManager = {
    
    // Start a level
    startLevel(levelNumber) {
        console.log(`⚔️ BattleManager: Starting Level ${levelNumber}`);
        
        // Set current level
        gameState.currentLevel = levelNumber;
        
        // Clear old battle state
        gameState.units = [];
        gameState.selectedUnit = null;
        gameState.phase = 'select';
        gameState.aiProcessing = false;
        gameState.aiActiveUnit = null;
        gameState.turnCount = 1;
        gameState.currentPlayer = 'player';
        
        // Reset battle stats
        gameState.battleStats = {
            playerKills: 0,
            enemyKills: 0,
            damageDealt: 0,
            damageTaken: 0,
            totalRounds: 0,
            survivingUnits: [],
            fleedUnits: []
        };
        
        // Generate terrain and units
        generateTerrain();
        createUnits();
        resetBattleCounters();
        
        // Reset UI
        if (typeof turnCountEl !== 'undefined') turnCountEl.textContent = '1';
        updateEnemiesCounter();
        updateSelectedUnitDisplay();
        
        // Clear and rebuild grid
        createGrid();
        
        // Render everything
        renderAll([]);
        
        // Update UI
        updateUI();
        updatePhaseIndicator();
        
        // Log level start
        if (typeof battleLogEl !== 'undefined') {
            battleLogEl.innerHTML = '';
        }
        
        const levelName = CampaignController.levels[levelNumber - 1]?.name || 'Unknown';
        logMessage(`=== LEVEL ${levelNumber}: ${levelName} ===`, 'system');
        logMessage(`Defeat all enemies!`, 'system');
        logMessage(`Player has first turn!`, 'system');
        
        // Play sound
        if (soundSystem && soundSystem.initialized) {
            soundSystem.playBeep(800, 0.4, 'sine', 0.3);
        }
    }
};

// Make globally available
window.BattleManager = BattleManager;
