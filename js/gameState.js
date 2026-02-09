// Iron Resolution GAMESTATE.js
     
        // ========== GAME STATE ==========
        const gameState = {
    gridSize: GRID_SIZE,
    units: [],
    currentPlayer: 'player',
    selectedUnit: null,
    turnCount: 1,
    nextUnitId: 0,
    terrain: [],
    damagePopups: [],
    soundEnabled: true,
    aiProcessing: false,
    isUpdating: false,
    aiActiveUnit: null,
    phase: 'select',
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
    maxLevel: 5,
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
    
    logMessage(`--- TURN ${gameState.turnCount}: ${gameState.currentPlayer.toUpperCase()} ---`, 'system');
    
    if (gameState.currentPlayer === 'enemy') {
        setTimeout(aiTurn, 1000);
    }
    
    renderAll([])


}

// Make functions available globally
window.gameState = gameState;
window.endTurn = endTurn;
window.updateEnemiesLeft = updateEnemiesLeft;
window.updateTurnCount = updateTurnCount;
window.initializeGameState = initializeGameState;
