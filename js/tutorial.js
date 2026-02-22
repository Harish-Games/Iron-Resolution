// Iron Resolution TUTORIAL.js

// Tutorial uses its own separate state
let tutorialState = {
    units: [],
    terrain: [],
    currentPlayer: 'player',
    turnCount: 1
};

let tutorialStep = 0;
let tutorialActive = false;

const tutorialMessages = [
    "Welcome to the Tutorial! Follow these step by step to learn the basics of Iron Resolution.",
    "You're troops are Blue on the left and the enemy are Red on the right.",
    "Click on your Knight (the sword icon) to select him.",
    "The Blue highlighted squares show where you can move. Click to move your Knight next to the nearest red enemy.",
    "Now click on the enemy to attack it.",
    "Did you hit, or miss?  It's based on dice role and probabiliy.  So if you missed, try again on your next move.",
    "Good! Now click on your Archer (the bow icon) to select her.",
    "Click on the blue square next to her move, (in the game you can click the Attack button, or hit the A key on your keyboard, but we're keeping things simple in the tutorial so just move one square for now).",
    "The Orange highlighted squares show your attack range. Click on an enemy to fire an arrow at it!",
    "Perfect! Your Mage can heal. Click on your Mage, then click on a wounded unit.",
    "Don't worry if you can't heal yet, as nobody has become injured yet.  Try it in the game.",
    "Congratulations! You've learned the basics. Ready for the real campaign?"
];

function startTutorial() {
    console.log("📚 Tutorial started");
    
    // Kill all possible overlays
    const overlays = ['introOverlay', 'victoryOverlay', 'recruitOverlay', 'difficultyOverlay'];
    overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // Hide main menu
    document.getElementById('mainMenuOverlay').style.display = 'none';
    
    // Set tutorial flag
    tutorialActive = true;
    window.tutorialActive = true;
    tutorialStep = 0;
    
    // Clear tutorial state
    tutorialState.units = [];
    tutorialState.terrain = [];
    
    // Save real gameState (we don't need to save it since we'll copy back)
    window.realGameState = JSON.parse(JSON.stringify(gameState));
    
    // Create tutorial battlefield
    createTutorialTerrain();
    createTutorialUnits();
    
    // Set current player
    tutorialState.currentPlayer = 'player';
    tutorialState.turnCount = 1;
    
    // Copy tutorial state INTO gameState (can't reassign const)
    gameState.units = tutorialState.units;
    gameState.terrain = tutorialState.terrain;
    gameState.currentPlayer = tutorialState.currentPlayer;
    gameState.turnCount = tutorialState.turnCount;
    
    // Create grid and render
    createGrid();
    renderAll([]);
    
    // Show first message
    showTutorialMessage(tutorialStep);
}

function createTutorialTerrain() {
    GRID_SIZE = 16;
    tutorialState.terrain = [];  // Use tutorialState, not gameState
    
    for (let y = 0; y < GRID_SIZE; y++) {
        tutorialState.terrain[y] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            tutorialState.terrain[y][x] = 'normal';
        }
    }
}

function createTutorialUnits() {
    // Player units on left - moved closer to center
    const knight = new Unit('player', 'Tutorial Knight', 6, 6);
    knight.level = 1;
    
    const archer = new Unit('player', 'Tutorial Archer', 5, 8); 
    archer.level = 1;
    
    const mage = new Unit('player', 'Tutorial Mage', 4, 7);
    mage.level = 1;
    
    // Enemy gremlins on right - moved closer
    const gremlin1 = new Unit('enemy', 'Target Gremlin', 8, 6); 
    gremlin1.classType = 'gremlin';
    gremlin1.maxHp = 8;
    gremlin1.hp = 8;
    
    const gremlin2 = new Unit('enemy', 'Target Gremlin', 10, 8); 
    gremlin2.classType = 'gremlin';
    gremlin2.maxHp = 8;
    gremlin2.hp = 8;
    
    const gremlin3 = new Unit('enemy', 'Target Gremlin', 10, 10); 
    gremlin3.classType = 'gremlin';
    gremlin3.maxHp = 8;
    gremlin3.hp = 8;
    
    tutorialState.units.push(knight, archer, mage, gremlin1, gremlin2, gremlin3);
    }

function showTutorialMessage(step) {
    // Remove old message if exists
    const oldMsg = document.getElementById('tutorialMessage');
    if (oldMsg) oldMsg.remove();
    
    // Create message box
    const msgBox = document.createElement('div');
    msgBox.id = 'tutorialMessage';
    msgBox.style.cssText = `
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(17, 34, 64, 0.95);
        border: 2px solid #64ffda;
        border-radius: 10px;
        padding: 20px 30px;
        color: #e6f1ff;
        font-size: 1.2em;
        text-align: center;
        z-index: 10000;
        max-width: 500px;
        box-shadow: 0 0 20px rgba(100, 255, 218, 0.3);
        backdrop-filter: blur(5px);
    `;
    
    msgBox.innerHTML = `
        <p>${tutorialMessages[step]}</p>
        <button id="nextTutorialBtn" style="
            background: linear-gradient(145deg, #0a7c71, #4ecdc4);
            border: 1px solid #64ffda;
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            margin-top: 15px;
            cursor: pointer;
        ">Next</button>
        <button id="exitTutorialBtn" style="
            background: linear-gradient(145deg, #7f1d1d, #ef4444);
            border: 1px solid #ef4444;
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            margin-top: 15px;
            margin-left: 10px;
            cursor: pointer;
        ">Exit Tutorial</button>
    `;
    
    document.body.appendChild(msgBox);
    
    document.getElementById('nextTutorialBtn').onclick = () => {
        msgBox.remove();
        nextTutorialStep();
    };
    
    document.getElementById('exitTutorialBtn').onclick = endTutorial;
}

function nextTutorialStep() {
    tutorialStep++;
    
    if (tutorialStep < tutorialMessages.length) {
        showTutorialMessage(tutorialStep);
    } else {
        endTutorial();
    }
}

function endTutorial() {
    console.log("Tutorial ended - reloading page");
    
    // Remove tutorial UI
    const msg = document.getElementById('tutorialMessage');
    if (msg) msg.remove();
    
    // Reload the page completely (same as F5)
    location.reload();
}

// Make functions available globally
window.startTutorial = startTutorial;
window.endTutorial = endTutorial;
