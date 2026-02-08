// ========== LEVEL TRANSITION SCREEN ==========
function showLevelTransitionScreen() {
    // Create transition overlay
    const transitionHTML = `
        <div id="transitionOverlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    MISSION UPDATE: FOREST PURSUIT
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 25px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        <img src="ui/target.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        PHASE ONE COMPLETE
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The village is secure. Your garrison has held the line against the initial assault.
                        Casualties were taken, but the walls stand strong.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 25px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        <img src="ui/running.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        ENEMY MOVEMENT DETECTED
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Through the smoke and chaos, you watch as the last of the bandits disappear into the 
                        <span style="color: #2ecc71; font-weight: bold;">mist-shrouded forest</span> across the river. 
                        Your scouts report they're attempting to regroup.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 30px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        <img src="ui/scroll.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        NEW ORDERS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; font-style: italic;">
                        "We cannot let them escape to fight another day. The river crossing is treacherous, 
                        but we must pursue. Ready your remaining forces - we move into the Darkwood at dawn."
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/sword1.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>OBJECTIVE:</strong> Cross the river and eliminate all remaining enemies in the Darkwood Forest
                </div>
                
                <button id="continueToForestBtn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/forest.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ADVANCE INTO THE DARKWOOD
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    // Set up event listeners
    const continueBtn = document.getElementById('continueToForestBtn');
    const transitionOverlay = document.getElementById('transitionOverlay');
    
    // Button click
    continueBtn.onclick = () => {
        console.log("🎬 Continue button clicked");
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        if (window.advanceToLevel2) window.advanceToLevel2();
    };
    
    // Space key
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
            console.log("🎬 Space pressed to continue");
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.style.display = 'none';
            }
            if (overlayDiv.parentNode) {
                document.body.removeChild(overlayDiv);
            }
            document.removeEventListener('keydown', transitionKeyHandler);
            if (window.advanceToLevel2) window.advanceToLevel2();
        }
    });
    
    // Click overlay to close
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                console.log("🎬 Overlay clicked to continue");
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                if (window.advanceToLevel2) window.advanceToLevel2();
            }
        });
    }
}

// ========== LEVEL 2 TO 3 TRANSITION ==========
function showLevel2To3Transition() {
    // Create transition overlay
    const transitionHTML = `
        <div id="transition23Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    FINAL MISSION: MOUNTAIN STRONGHOLD
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        FOREST PURSUIT COMPLETE
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The Darkwood Forest is finally cleared, but victory came at a heavy price. 
                        Your forces are battle-hardened but weary from the relentless pursuit.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        ENEMY RETREAT
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Your scouts report the surviving enemy forces have retreated to their mountain stronghold - 
                        the legendary Fortress of Thrak'gor. Carved into the peaks themselves, 
                        the enemy has fortified every approach with camps and defensive positions along the high ground.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        FINAL STAND
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; font-style: italic;">
                        "Ancient texts say no army has ever breached those walls, but we are not just any army. 
                        The enemy warlord awaits, surrounded by his most loyal warriors. 
                        This is their last stand - and ours."
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 25px;">
                    <h3 class="section-header" style="color: #f1c40f;">
                        TERRAIN ANALYSIS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        <div style="margin-bottom: 8px;"><strong>LEFT APPROACH:</strong> Mixed terrain for your advance</div>
                        <div style="margin-bottom: 8px;"><strong>RIGHT FORTRESS:</strong> Concentrated enemy camps and mountain defenses</div>
                        <div><strong>OBJECTIVE:</strong> Breach the stronghold and eliminate all enemy forces</div>
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/mountain.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> Mountain stronghold with fortified enemy positions
                </div>
                
                <button id="continueToLevel3Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/trophy1.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ASSAULT THE STRONGHOLD
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    console.log("🎬 Level 2→3 transition overlay added to DOM");
    
    // Set up event listeners
    const continueBtn = document.getElementById('continueToLevel3Btn');
    const transitionOverlay = document.getElementById('transition23Overlay');
    
    // Button click
    continueBtn.onclick = () => {
        console.log("🎬 Continue to Level 3 button clicked");
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        if (window.advanceToLevel3) window.advanceToLevel3();
    };
    
    // Space key
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
            console.log("🎬 Space pressed to continue to Level 3");
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.style.display = 'none';
            }
            if (overlayDiv.parentNode) {
                document.body.removeChild(overlayDiv);
            }
            document.removeEventListener('keydown', transitionKeyHandler);
            if (window.advanceToLevel3) window.advanceToLevel3();
        }
    });
    
    // Click overlay to close
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                console.log("🎬 Overlay clicked to continue to Level 3");
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                if (window.advanceToLevel3) window.advanceToLevel3();
            }
        });
    }
}

function advanceToLevel2() {
    console.log("Advancing to Level 2: Forest Pursuit");
    
    // Increment level
    window.gameState.currentLevel = 2;
    
    // Reset game state for new level
    window.gameState.units = [];
    window.gameState.selectedUnit = null;
    window.gameState.phase = 'select';
    window.gameState.aiProcessing = false;
    window.gameState.aiActiveUnit = null;
    window.gameState.turnCount = 1;
    window.gameState.currentPlayer = 'player';
    
    // Clear battle stats for new level
    window.gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
    
    // Generate new terrain for Level 2 (with river)
    if (window.generateTerrain) window.generateTerrain();
    
    // Create units for Level 2
    if (window.createUnits) window.createUnits();
    
    // Reset UI
    if (window.domElements?.turnCountEl) window.domElements.turnCountEl.textContent = '1';
    if (window.updateEnemiesCounter) window.updateEnemiesCounter();
    if (window.updateSelectedUnitDisplay) window.updateSelectedUnitDisplay();
    
    // Clear battle log and add new messages
    if (window.domElements?.battleLogEl) window.domElements.battleLogEl.innerHTML = '';
    if (window.logMessage) {
        window.logMessage("=== LEVEL 2: FOREST PURSUIT ===", 'system');
        window.logMessage("The enemy has retreated across the river into the Darkwood Forest.", 'system');
        window.logMessage("Objective: Cross the river and eliminate all remaining threats.", 'system');
        window.logMessage("Caution: The river is impassable except at bridge crossings.", 'system');
    }
    
    // Clear grid and recreate
    if (window.createGrid) window.createGrid();
    
    // Render everything fresh
    if (window.renderAll) window.renderAll([]);
    
    // Update UI
    if (window.updateUI) window.updateUI();
    if (window.updatePhaseIndicator) window.updatePhaseIndicator();
    
    // Play transition sound
    if (window.soundSystem && window.soundSystem.initialized) {
        window.soundSystem.playBeep(600, 0.3, 'sine', 0.2);
    }
}

function advanceToLevel3() {
    console.log("Advancing to Level 3: Mountain Stronghold");
    
    // Increment level
    window.gameState.currentLevel = 3;
    
    // Reset game state for new level
    window.gameState.units = [];
    window.gameState.selectedUnit = null;
    window.gameState.phase = 'select';
    window.gameState.aiProcessing = false;
    window.gameState.aiActiveUnit = null;
    window.gameState.turnCount = 1;
    window.gameState.currentPlayer = 'player';
    
    // Clear battle stats for new level
    window.gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
    
    // Generate new terrain for Level 3 (with enemy villages and mountains)
    if (window.generateTerrain) window.generateTerrain();
    
    // Create units for Level 3
    if (window.createUnits) window.createUnits();
    
    // Reset UI
    if (window.domElements?.turnCountEl) window.domElements.turnCountEl.textContent = '1';
    if (window.updateEnemiesCounter) window.updateEnemiesCounter();
    if (window.updateSelectedUnitDisplay) window.updateSelectedUnitDisplay();
    
    // Clear battle log and add new messages
    if (window.domElements?.battleLogEl) window.domElements.battleLogEl.innerHTML = '';
    if (window.logMessage) {
        window.logMessage("=== LEVEL 3: MOUNTAIN STRONGHOLD ===", 'system');
        window.logMessage("The enemy has retreated to their fortified mountain stronghold.", 'system');
        window.logMessage("Objective: Breach the defenses and eliminate the enemy warlord.", 'system');
        window.logMessage("Caution: Enemy camps provide defensive bonuses. Mountains offer high ground.", 'system');
    }
    
    // Clear grid and recreate
    if (window.createGrid) window.createGrid();
    
    // Render everything fresh
    if (window.renderAll) window.renderAll([]);
    
    // Update UI
    if (window.updateUI) window.updateUI();
    if (window.updatePhaseIndicator) window.updatePhaseIndicator();
    
    // Play transition sound
    if (window.soundSystem && window.soundSystem.initialized) {
        window.soundSystem.playBeep(800, 0.4, 'sine', 0.3);
    }
}

// ========== LEVEL COMPLETION ==========
function checkVictory() {
    // First, clean up any dead units
    window.gameState.units = window.gameState.units.filter(u => u.hp > 0);
    
    // Count enemies
    const activeEnemies = window.gameState.units.filter(u => u.type === 'enemy');
    const activePlayers = window.gameState.units.filter(u => u.type === 'player');
    
    console.log(`Victory check: ${activeEnemies.length} enemies left, ${activePlayers.length} players left`);
    
    if (activeEnemies.length === 0) {
        console.log("ALL ENEMIES DEFEATED - VICTORY!");
        if (window.updateEnemiesCounter) window.updateEnemiesCounter();
        
        // Small delay then complete level
        setTimeout(() => {
            if (window.completeLevel) window.completeLevel();
        }, 800);
        return;
    }
    
    if (activePlayers.length === 0) {
        console.log("ALL PLAYERS DEAD - DEFEAT!");
        window.gameState.battleStats.totalRounds = window.gameState.turnCount;
        setTimeout(() => {
            if (window.showBattleStats) window.showBattleStats(false);
        }, 800);
        return;
    }
    
    // Update counter
    if (window.updateEnemiesCounter) window.updateEnemiesCounter();
}

function completeLevel() {
    console.log(`completeLevel() called for level ${window.gameState.currentLevel}`);
    
    // Calculate battle statistics
    const playerUnits = window.gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    const totalXP = playerUnits.reduce((sum, unit) => sum + unit.xp, 0);
    const averageLevel = playerUnits.length > 0 ? 
        (playerUnits.reduce((sum, unit) => sum + unit.level, 0) / playerUnits.length).toFixed(1) : 0;
    
    const totalDamageDealt = window.gameState.battleStats.damageDealt || 0;
    const totalDamageTaken = window.gameState.battleStats.damageTaken || 0;
    const enemiesDefeated = window.gameState.battleStats.playerKills || 0;
    
    const damageRatio = totalDamageTaken > 0 ? (totalDamageDealt / totalDamageTaken).toFixed(1) : "∞";
    const isPerfectVictory = playerUnits.length === UNITS_PER_TEAM && 
                             playerUnits.every(u => u.hp > u.maxHp * 0.5);
    
    // ========== Level 1 Special Handling ==========
    if (window.gameState.currentLevel === 1) {
        console.log("LEVEL 1 COMPLETE - Showing stats first, then transition");
        
        // Calculate rewards
        const finalGoldReward = 50 + (window.gameState.currentLevel * 25);
        const finalXpReward = 100 + (window.gameState.currentLevel * 50);
        
        // Save progression
        window.gameState.persistentUnits = playerUnits.map(unit => {
            unit.hp = Math.min(unit.maxHp, unit.hp + Math.floor(unit.maxHp * 0.3));
            unit.morale = Math.min(100, unit.morale + 30);
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.acted = false;
            unit.fleeing = false;
            return unit;
        });
        
        window.gameState.completedLevels++;
        window.gameState.totalXP += finalXpReward;
        window.gameState.gold += finalGoldReward;
        
        console.log("About to show victory overlay for level", window.gameState.currentLevel);
        document.getElementById('victoryOverlay').style.display = 'flex';
        console.log("Victory overlay should be visible now");
        
        // ====== SHOW VICTORY STATS FIRST (NO EMOJIS) ======
        const level = LEVELS[0];
        document.getElementById('victoryLevelName').textContent = level.name;
        document.getElementById('victoryLevelDifficulty').textContent = `Difficulty: ${level.difficulty}`;
        
        // Build rewards HTML
        document.getElementById('victoryRewards').innerHTML = `
            <div style="font-size: 1.3em; margin-bottom: 5px;">
                <span style="color: #9b59b6;">
                    +${finalXpReward} XP
                </span> | 
                <span style="color: #f1c40f;">
                    +${finalGoldReward} Gold
                </span>
            </div>
        `;
        
        // Build detailed stats HTML
        const damageRatio = totalDamageTaken > 0 ? (totalDamageDealt / totalDamageTaken).toFixed(1) : "∞";
        
        let statsHTML = `
        <div class="victory-stats-grid">
            <div class="victory-stats-column">
                <h4>Battle Statistics</h4>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Total Rounds:</span>
                    <span class="victory-stat-value">${window.gameState.turnCount}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Enemies Defeated:</span>
                    <span class="victory-stat-value">${enemiesDefeated}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Damage Dealt:</span>
                    <span class="victory-stat-value">${totalDamageDealt}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Damage Taken:</span>
                    <span class="victory-stat-value">${totalDamageTaken}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Damage Ratio:</span>
                    <span class="victory-stat-value">${damageRatio}:1</span>
                </div>
            </div>
            <div class="victory-stats-column">
                <h4>Unit Statistics</h4>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Surviving Units:</span>
                    <span class="victory-stat-value">${playerUnits.length}/${UNITS_PER_TEAM}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Fleed Units:</span>
                    <span class="victory-stat-value">${window.gameState.battleStats.fleedUnits?.length || 0}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Total XP Earned:</span>
                    <span class="victory-stat-value">${totalXP}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Average Level:</span>
                    <span class="victory-stat-value">${averageLevel}</span>
                </div>
                <div class="victory-stat-row">
                    <span class="victory-stat-label">Missions Completed:</span>
                    <span class="victory-stat-value">${window.gameState.completedLevels + 1}</span>
                </div>
            </div>
        </div>
        `;
        
        // Add hero list
        if (playerUnits.length > 0) {
            statsHTML += `
                <div class="victory-heroes-section">
                    <div class="victory-heroes-title">
                        Surviving Heroes
                    </div>
                    <div class="victory-heroes-list">
            `;
            
            playerUnits.forEach(unit => {
                const hpPercent = (unit.hp / unit.maxHp) * 100;
                let hpClass = '';
                if (hpPercent < 30) hpClass = 'critical';
                else if (hpPercent < 60) hpClass = 'low';
                
                // Class icons as text instead of emojis
                const classText = unit.classType.toUpperCase();
                
                statsHTML += `
                    <div class="victory-hero-badge ${unit.classType}">
                        <div class="victory-hero-name">${unit.name}</div>
                        <div class="victory-hero-level">Lvl ${unit.level} (${classText})</div>
                        <div class="victory-hero-hp ${hpClass}">
                            HP: <span class="hp-value">${unit.hp}/${unit.maxHp}</span>
                        </div>
                    </div>
                `;
            });
            
            statsHTML += `
                    </div>
                </div>
            `;
        }
        
        // Add performance rating
        let performanceText = '';
        if (isPerfectVictory) {
            performanceText = 'PERFECT VICTORY! All units survived with minimal damage.';
        } else if (playerUnits.length === UNITS_PER_TEAM) {
            performanceText = 'Good work! All units survived.';
        } else if (playerUnits.length >= UNITS_PER_TEAM / 2) {
            performanceText = 'Acceptable losses. Some units were lost.';
        } else {
            performanceText = 'Heavy casualties. Better luck next time.';
        }
        
        statsHTML += `
            <div class="victory-performance ${isPerfectVictory ? 'perfect' : ''}">
                ${performanceText}
            </div>
        `;
        
        document.getElementById('victoryStats').innerHTML = statsHTML;
        
        // Show the victory overlay with stats
        document.getElementById('victoryOverlay').style.display = 'flex';
        
        // Set up continue button to always go to recruit screen
        document.getElementById('continueBtn').onclick = () => {
            document.getElementById('victoryOverlay').style.display = 'none';
            if (window.openRecruitScreen) window.openRecruitScreen();
        };
    }
    
    // ====== LEVEL 2 VICTORY ======
    if (window.gameState.currentLevel === 2) {
        console.log("Level 2 complete - showing victory stats");
        // Calculate rewards for Level 2
        const finalXpReward = 100 + (window.gameState.currentLevel * 50);
        const finalGoldReward = 50 + (window.gameState.currentLevel * 25);

        // Save progression data
        window.gameState.persistentUnits = playerUnits.map(unit => {
            unit.hp = Math.min(unit.maxHp, unit.hp + Math.floor(unit.maxHp * 0.3));
            unit.morale = Math.min(100, unit.morale + 30);
            unit.remainingActions = unit.maxActions;
            unit.movesUsed = 0;
            unit.attacksUsed = 0;
            unit.acted = false;
            unit.fleeing = false;
            return unit;
        });
        
        window.gameState.completedLevels++;
        window.gameState.totalXP += finalXpReward;
        window.gameState.gold += finalGoldReward;
        
        // Set up continue button: recruit first, THEN mountain splash
        document.getElementById('continueBtn').onclick = () => {
            document.getElementById('victoryOverlay').style.display = 'none';
            // Show recruit screen first
            setTimeout(() => {
                // After recruit screen, show mountain transition
                document.getElementById('recruitOverlay').addEventListener('hidden', function() {
                    if (window.showLevel2To3Transition) window.showLevel2To3Transition();
                }, { once: true });
                if (window.openRecruitScreen) window.openRecruitScreen();
            }, 500);
        };
    }
    
    // ========== ORIGINAL CODE FOR LEVEL 2+ ==========
    // Update victory popup (for Level 2 and beyond)
    const level = LEVELS[window.gameState.currentLevel - 1];
    document.getElementById('victoryLevelName').textContent = level.name;
    document.getElementById('victoryLevelDifficulty').textContent = `Difficulty: ${level.difficulty}`;
    
    const xpReward = 100 + (window.gameState.currentLevel * 50);
    const goldReward = 50 + (window.gameState.currentLevel * 25);
    const finalGoldReward = level.boss ? goldReward * 2 : goldReward;
    const finalXpReward = level.boss ? xpReward * 2 : xpReward;
    
    document.getElementById('victoryRewards').innerHTML = `
        <div style="font-size: 1.3em; margin-bottom: 5px;">
            <span style="color: #9b59b6;">
                <img src="ui/levelup.png" class="small-icon"> +${finalXpReward} XP
            </span> | 
            <span style="color: #f1c40f;">
                <img src="ui/sword1.png" class="small-icon"> +${finalGoldReward} Gold
            </span>
        </div>
        ${level.boss ? '<div style="color: #ffd700; font-size: 1.1em;"><img src="ui/trophy1.png" class="small-icon"> BOSS BONUS APPLIED!</div>' : ''}
    `;
    
    // Build detailed stats HTML
    let statsHTML = `
    <div class="victory-stats-grid">
        <div class="victory-stats-column">
            <h4><img src="ui/sword.png" class="small-icon"> Battle Statistics</h4>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/scroll.png" class="small-icon"> Total Rounds:</span>
                <span class="victory-stat-value">${window.gameState.turnCount}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/skull.png" class="small-icon"> Enemies Defeated:</span>
                <span class="victory-stat-value">${enemiesDefeated}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/sword2.png" class="small-icon"> Damage Dealt:</span>
                <span class="victory-stat-value">${totalDamageDealt}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/shield.png" class="small-icon"> Damage Taken:</span>
                <span class="victory-stat-value">${totalDamageTaken}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/sword3.png" class="small-icon"> Damage Ratio:</span>
                <span class="victory-stat-value">${damageRatio}:1</span>
            </div>
        </div>
        <div class="victory-stats-column">
            <h4><img src="ui/berserker.png" class="small-icon"> Unit Statistics</h4>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/target.png" class="small-icon"> Surviving Units:</span>
                <span class="victory-stat-value">${playerUnits.length}/${UNITS_PER_TEAM}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/running.png" class="small-icon"> Fleed Units:</span>
                <span class="victory-stat-value">${window.gameState.battleStats.fleedUnits?.length || 0}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/levelup.png" class="small-icon"> Total XP Earned:</span>
                <span class="victory-stat-value">${totalXP}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/celebrate.png" class="small-icon"> Average Level:</span>
                <span class="victory-stat-value">${averageLevel}</span>
            </div>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/tick.png" class="small-icon"> Missions Completed:</span>
                <span class="victory-stat-value">${window.gameState.completedLevels + 1}</span>
            </div>
        </div>
    </div>
    `;
    
    // Add hero list
    if (playerUnits.length > 0) {
        statsHTML += `
            <div class="victory-heroes-section">
                <div class="victory-heroes-title">
                    <img src="ui/trophy.png" class="small-icon"> Surviving Heroes
                </div>
                <div class="victory-heroes-list">
        `;
        
        playerUnits.forEach(unit => {
            const icon = getClassIconHTML(unit.classType);
            const hpPercent = (unit.hp / unit.maxHp) * 100;
            let hpClass = '';
            if (hpPercent < 30) hpClass = 'critical';
            else if (hpPercent < 60) hpClass = 'low';
            
            statsHTML += `
                <div class="victory-hero-badge ${unit.classType}">
                    <div class="victory-hero-icon">${icon}</div>
                    <div class="victory-hero-name">${unit.name}</div>
                    <div class="victory-hero-level">Lvl ${unit.level}</div>
                    <div class="victory-hero-hp ${hpClass}">
                        <img src="ui/heart.png" class="small-icon">
                        <span class="hp-value">${unit.hp}/${unit.maxHp}</span>
                    </div>
                </div>
            `;
        });
        
        statsHTML += `
                </div>
            </div>
        `;
    }
    
    // Add performance rating
    let performanceText = '';
    let performanceIcon = 'ui/tick.png';

    if (isPerfectVictory) {
        performanceText = 'PERFECT VICTORY! All units survived with minimal damage.';
        performanceIcon = 'ui/trophy1.png';
    } else if (playerUnits.length === UNITS_PER_TEAM) {
        performanceText = 'Good work! All units survived.';
        performanceIcon = 'ui/happy.png';
    } else if (playerUnits.length >= UNITS_PER_TEAM / 2) {
        performanceText = 'Acceptable losses. Some units were lost.';
        performanceIcon = 'ui/wound.png';
    } else {
        performanceText = 'Heavy casualties. Better luck next time.';
        performanceIcon = 'ui/sad.png';
    }
    
    statsHTML += `
        <div class="victory-performance ${isPerfectVictory ? 'perfect' : ''}">
            <img src="${performanceIcon}" class="small-icon">
            ${performanceText}
        </div>
    `;
    
    document.getElementById('victoryStats').innerHTML = statsHTML;
    document.getElementById('victoryOverlay').style.display = 'flex';
    
    // Save progression data
    window.gameState.persistentUnits = playerUnits.map(unit => {
        unit.hp = Math.min(unit.maxHp, unit.hp + Math.floor(unit.maxHp * 0.3));
        unit.morale = Math.min(100, unit.morale + 30);
        unit.remainingActions = unit.maxActions;
        unit.movesUsed = 0;
        unit.attacksUsed = 0;
        unit.acted = false;
        unit.fleeing = false;
        return unit;
    });
    
    window.gameState.completedLevels++;
    window.gameState.totalXP += finalXpReward;
    window.gameState.gold += finalGoldReward;
    
    // Check for final victory
    if (window.gameState.currentLevel >= window.gameState.maxLevel) {
        // Final victory handling...
    } else {
        const currentLevelBeforeAdvance = window.gameState.currentLevel;
        // Only set up recruit screen for Level 3+
        if (window.gameState.currentLevel >= 3) {
            document.getElementById('continueBtn').onclick = () => {
                document.getElementById('victoryOverlay').style.display = 'none';
                window.gameState.currentLevel = currentLevelBeforeAdvance + 1;
                if (window.openRecruitScreen) window.openRecruitScreen();
            };
        }
        // Level 2 already has its onclick handler set above
    }
}

function openRecruitScreen() {
    console.log(`🛒 Opening recruit screen for level ${window.gameState.currentLevel}`);
    document.getElementById('victoryOverlay').style.display = 'none';

    // Calculate recruit cost
    const recruitCost = 60 + (window.gameState.currentLevel * 20);

    // Random class
    const classes = ['Knight', 'Archer', 'Berserker', 'Mage'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    // Update recruit screen
    document.getElementById('recruitClass').textContent = randomClass;
    document.getElementById('recruitCost').textContent = `Cost: ${recruitCost} Gold`;
    document.getElementById('currentGold').textContent = window.gameState.gold;

    // Hire button state
    const hireBtn = document.getElementById('hireBtn');
    hireBtn.disabled = window.gameState.gold < recruitCost;

    // Store current level for reference
    const currentLevelForRecruit = window.gameState.currentLevel;
    
    hireBtn.onclick = () => {
        console.log(`<img src="ui/shop.png" style="width: 16px; height: 16px; vertical-align: middle;"> Hire clicked for level ${window.gameState.currentLevel}`);
        
        if (window.gameState.gold >= recruitCost) {
            window.gameState.gold -= recruitCost;
            const newUnit = new Unit('player', `${randomClass} Recruit`, 0, 0);
            newUnit.level = 1;
            newUnit.xp = 0;
            window.gameState.persistentUnits.push(newUnit);
            if (window.logMessage) window.logMessage(`Hired ${newUnit.name}!`, 'system');
        }
        document.getElementById('recruitOverlay').style.display = 'none';
        
        // Handle level transitions
        if (window.gameState.currentLevel === 1) {
            window.gameState.currentLevel = 2; // Force advance to Level 2
            if (window.showLevelTransitionScreen) window.showLevelTransitionScreen(); // Show forest splash
        } else if (window.gameState.currentLevel === 2) {
            window.gameState.currentLevel = 3; // Force advance to Level 3
            if (window.showLevel2To3Transition) window.showLevel2To3Transition(); // Show mountain splash
        } else {
            if (window.showGameCompleteScreen) window.showGameCompleteScreen(); // Game complete for Level 3
        }
    };

    // Show recruit screen
    document.getElementById('recruitOverlay').style.display = 'flex';
}

// Helper function for icons
function getClassIconHTML(classType) {
    switch(classType) {
        case 'knight': return '<img src="ui/knight.png" style="width: 24px; height: 24px;">';
        case 'archer': return '<img src="ui/bow.png" style="width: 24px; height: 24px;">';
        case 'mage': return '<img src="ui/potion.png" style="width: 24px; height: 24px;">';
        case 'berserker': return '<img src="ui/axe.png" style="width: 24px; height: 24px;">';
        default: return '<img src="ui/shield.png" style="width: 24px; height: 24px;">';
    }
}

// Make functions globally available
window.showLevelTransitionScreen = showLevelTransitionScreen;
window.showLevel2To3Transition = showLevel2To3Transition;
window.advanceToLevel2 = advanceToLevel2;
window.advanceToLevel3 = advanceToLevel3;
window.checkVictory = checkVictory;
window.completeLevel = completeLevel;
window.openRecruitScreen = openRecruitScreen;
window.getClassIconHTML = getClassIconHTML;
