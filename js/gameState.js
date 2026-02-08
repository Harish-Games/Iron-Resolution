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
    maxLevel: 3,
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

// Make it globally accessible
window.gameState = gameState;

// ========== DOM ELEMENTS ==========
const gridEl = document.getElementById('grid');
const turnCountEl = document.getElementById('turnCount');
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

// Make DOM elements globally accessible if needed by other modules
window.domElements = {
    gridEl,
    turnCountEl,
    enemiesLeftEl,
    selectedUnitDisplay,
    battleLogEl,
    phaseIndicator,
    rangeIndicator,
    soundToggleEl,
    statsOverlay,
    statsTitle,
    statsContent,
    restartButton,
    endTurnBtn,
    attackBtn,
    healBtn,
    cancelBtn
};
