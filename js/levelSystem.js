// Iron Resolution LEVEL SYSTEM.js

    
     // ========== LEVEL TRANSITION SCREEN ==========
function showLevel2To3Transition() {    
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
        advanceToLevel2();
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
            advanceToLevel2();
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
                advanceToLevel2();
            }
        });
    }
}
   
   
   function showLevel3To4Transition() {
    console.log("🎬 Creating Level 3 to Level 4 transition");
    
    // Create transition overlay
    const transitionHTML = `
        <div id="transition34Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    TRAVEL: MOUNTAIN PASS
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        STRONGHOLD BREACHED
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The enemy fortress has fallen! The warlord lies defeated, but scouts report 
                        surviving enemies are fleeing through the treacherous mountain pass ahead.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        NARROW PASS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        The mountain pass is barely wide enough for two men abreast. 
                        Cliffs rise on either side, and the enemy has set up ambush positions 
                        along the high ground. This will be a deadly chase.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/mountain.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> Travel level - narrow mountain pass (10x20 grid)
                </div>
                
                <button id="continueToLevel4Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/running.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    PURSUE THROUGH THE PASS
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
    
    console.log("🎬 Level 3→4 transition overlay added to DOM");
    
    // Set up event listeners
    const continueBtn = document.getElementById('continueToLevel4Btn');
    const transitionOverlay = document.getElementById('transition34Overlay');
    
    // Button click
    continueBtn.onclick = () => {
        console.log("🎬 Continue to Level 4 button clicked");
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        startNextLevel();
    };
    
    // Space key
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
            console.log("🎬 Space pressed to continue to Level 4");
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.style.display = 'none';
            }
            if (overlayDiv.parentNode) {
                document.body.removeChild(overlayDiv);
            }
            document.removeEventListener('keydown', transitionKeyHandler);
            
            // Set level to 4 and start it
            gameState.currentLevel = 4;
            console.log(`🚀 Setting level to 4 and starting...`);
            startNextLevel();
        }
    });
    
    // Click overlay to close
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                console.log("🎬 Overlay clicked to continue to Level 4");
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                
                // Set level to 4 and start it
                gameState.currentLevel = 4;
                console.log(`🚀 Setting level to 4 and starting...`);
                startNextLevel();
            }
        });
    }
}

function showLevel4To5Transition() {
    console.log("🎬 Creating Level 4 to Level 5 transition");
    
    // Create transition overlay
    const transitionHTML = `
        <div id="transition45Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    FINAL MISSION: ENEMY CITADEL
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        MOUNTAIN PASS CLEARED
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The ambush in the pass has been eliminated. Ahead lies the enemy's final 
                        stronghold - an ancient citadel built into the mountainside itself.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        THE CITADEL
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Fortified walls, defensive camps, and the enemy's remaining forces are 
                        massed for one final stand. Their leader, the High Warlord, awaits within.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/fortress.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> Enemy citadel - fortified positions and boss encounter
                </div>
                
                <button id="continueToLevel5Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/trophy1.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ASSAULT THE CITADEL
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
    
    console.log("🎬 Level 4→5 transition overlay added to DOM");
    
    // Set up event listeners
    const continueBtn = document.getElementById('continueToLevel5Btn');
    const transitionOverlay = document.getElementById('transition45Overlay');
    
    // Button click
    continueBtn.onclick = () => {
        console.log("🎬 Continue to Level 5 button clicked");
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        startNextLevel();
    };
    
    // Space key
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
            console.log("🎬 Space pressed to continue to Level 5");
            e.preventDefault();
            if (transitionOverlay) {
                transitionOverlay.style.display = 'none';
            }
            if (overlayDiv.parentNode) {
                document.body.removeChild(overlayDiv);
            }
            document.removeEventListener('keydown', transitionKeyHandler);
            startNextLevel();
        }
    });
    
    // Click overlay to close
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                console.log("🎬 Overlay clicked to continue to Level 5");
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                startNextLevel();
            }
        });
    }
}

function showGameCompleteScreen() {
    console.log("🏆 Showing game complete screen");
    
    const finalStats = `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 3em; color: #ffd700; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                🏆 VICTORY! 🏆
            </div>
            <div style="font-size: 1.5em; color: #64ffda; margin-bottom: 30px;">
                The Ironlands are secure!
            </div>
            <div style="background: rgba(17, 34, 64, 0.8); padding: 20px; border-radius: 10px; border: 2px solid #64ffda; margin-bottom: 30px;">
                <div style="font-size: 1.2em; color: #e6f1ff; margin-bottom: 10px;">
                    <strong>Final Campaign Statistics</strong>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; font-size: 1.1em;">
                    <div style="color: #8892b0;">Levels Completed:</div>
                    <div style="color: #64ffda; font-weight: bold;">${gameState.completedLevels}</div>
                    
                    <div style="color: #8892b0;">Total XP Earned:</div>
                    <div style="color: #64ffda; font-weight: bold;">${gameState.totalXP}</div>
                    
                    <div style="color: #8892b0;">Final Gold:</div>
                    <div style="color: #f1c40f; font-weight: bold;">${gameState.gold}</div>
                    
                    <div style="color: #8892b0;">Total Missions:</div>
                    <div style="color: #64ffda; font-weight: bold;">5</div>
                </div>
            </div>
        </div>
    `;
    
    // Use the existing victory overlay
    document.getElementById('victoryLevelName').textContent = "CAMPAIGN COMPLETE";
    document.getElementById('victoryLevelDifficulty').textContent = "Final Victory";
    document.getElementById('victoryRewards').innerHTML = "";
    document.getElementById('victoryStats').innerHTML = finalStats;
    
    // Update continue button to restart
    document.getElementById('continueBtn').onclick = () => {
        document.getElementById('victoryOverlay').style.display = 'none';
        restartGame();
    };
    
    // Show the victory overlay
    document.getElementById('victoryOverlay').style.display = 'flex';
}
    
    function showLevel1To2Transition() {
   
    // Create transition overlay
    const transitionHTML = `
        <div id="transitionOverlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    MISSION UPDATE: DARKWOOD APPROACH
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 25px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        <img src="ui/target.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        VILLAGE DEFENDED
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The village is secure. Your garrison has held the line against the initial assault.
                        Casualties were taken, but the walls stand strong.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 25px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        <img src="ui/running.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        ENEMY RETREAT DETECTED
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Through the smoke and chaos, you watch as the bandits disappear into the 
                        <span style="color: #2ecc71; font-weight: bold;">Darkwood Forest</span>. 
                        Your scouts report they're attempting to regroup deep in the woods.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 30px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        <img src="ui/scroll.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        NEW ORDERS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; font-style: italic;">
                        "We cannot let them escape to fight another day. The forest is treacherous, 
                        but we must pursue before they reach their main encampment. 
                        Ready your forces - we move into the Darkwood immediately."
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/forest.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>OBJECTIVE:</strong> Pursue the enemy through the Darkwood Forest and eliminate all threats
                </div>
                
                <button id="continueToForestBtn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="images/forest.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    PURSUE INTO THE DARKWOOD
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
        console.log("🎬 Continue to Level 2 button clicked");
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        advanceToLevel2();
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
            advanceToLevel2();
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
                advanceToLevel2();
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
        advanceToLevel3();
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
            advanceToLevel3();
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
                advanceToLevel3();
            }
        });
    }
}

function advanceToLevel3() {
    console.log("Advancing to Level 3: Mountain Stronghold");
    
    // Increment level
    gameState.currentLevel = 3;
    
    // Reset game state for new level
    gameState.units = [];
    gameState.selectedUnit = null;
    gameState.phase = 'select';
    gameState.aiProcessing = false;
    gameState.aiActiveUnit = null;
    gameState.turnCount = 1;
    gameState.currentPlayer = 'player';
    
    // Clear battle stats for new level
    gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
    
    // Generate new terrain for Level 3 (with enemy villages and mountains)
    generateTerrain();
    
    // Create units for Level 3
    createUnits();
    
    // Reset UI
    turnCountEl.textContent = '1';
    updateEnemiesCounter();
    updateSelectedUnitDisplay();
    
    // Clear battle log and add new messages
    battleLogEl.innerHTML = '';
    logMessage("=== LEVEL 3: MOUNTAIN STRONGHOLD ===", 'system');
    logMessage("The enemy has retreated to their fortified mountain stronghold.", 'system');
    logMessage("Objective: Breach the defenses and eliminate the enemy warlord.", 'system');
    logMessage("Caution: Enemy camps provide defensive bonuses. Mountains offer high ground.", 'system');
    
    // Clear grid and recreate
    createGrid();
    
    // Render everything fresh
    renderAll([]);
    
    // Update UI
    updateUI();
    updatePhaseIndicator();
    
    // Play transition sound
    if (soundSystem && soundSystem.initialized) {
        soundSystem.playBeep(800, 0.4, 'sine', 0.3);
    }
}

    function completeLevel() {
    console.log(`🎉 completeLevel() called for level ${gameState.currentLevel}`);
        
    // ====== COMMON CALCULATIONS (for all levels) ======
    const playerUnits = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    const enemyUnits = gameState.units.filter(u => u.type === 'enemy');
    const totalXP = playerUnits.reduce((sum, unit) => sum + unit.xp, 0);
    const averageLevel = playerUnits.length > 0 ? 
        (playerUnits.reduce((sum, unit) => sum + unit.level, 0) / playerUnits.length).toFixed(1) : 0;
    
    const totalDamageDealt = gameState.battleStats.damageDealt || 0;
    const totalDamageTaken = gameState.battleStats.damageTaken || 0;
    const enemiesDefeated = gameState.battleStats.playerKills || 0;
    
    const damageRatio = totalDamageTaken > 0 ? (totalDamageDealt / totalDamageTaken).toFixed(1) : "∞";
    const isPerfectVictory = playerUnits.length === UNITS_PER_TEAM && 
                             playerUnits.every(u => u.hp > u.maxHp * 0.5);
    
    // ====== GET REWARDS FROM CAMPAIGN CONTROLLER ======
    let finalXpReward, finalGoldReward;
    let currentLevelData;
    
    if (typeof CampaignController !== 'undefined' && CampaignController.calculateRewards) {
        const rewards = CampaignController.calculateRewards();
        finalXpReward = rewards.xp;
        finalGoldReward = rewards.gold;
        currentLevelData = CampaignController.getCurrentLevelData();
        console.log(`🎁 Rewards from controller: ${finalGoldReward} gold, ${finalXpReward} XP`);
    } else {
        // Fallback if controller not ready
        currentLevelData = LEVELS[gameState.currentLevel - 1];
        const baseXpReward = 100 + (gameState.currentLevel * 50);
        const baseGoldReward = 50 + (gameState.currentLevel * 25);
        finalXpReward = currentLevelData.boss ? baseXpReward * 2 : baseXpReward;
        finalGoldReward = currentLevelData.boss ? baseGoldReward * 2 : baseGoldReward;
        console.log("⚠️ Using fallback rewards calculation");
    }
    
    // Add gold and XP to gameState
    gameState.gold += finalGoldReward;
    gameState.totalXP += finalXpReward;
    
    // ====== UPDATE VICTORY POPUP ======
    document.getElementById('victoryLevelName').textContent = currentLevelData.name;
    document.getElementById('victoryLevelDifficulty').textContent = `Difficulty: ${currentLevelData.difficulty}`;
    
    // Build rewards HTML
    document.getElementById('victoryRewards').innerHTML = `
        <div style="font-size: 1.3em; margin-bottom: 5px;">
            <span style="color: #9b59b6;">
                <img src="ui/levelup.png" class="small-icon"> +${finalXpReward} XP
            </span> | 
            <span style="color: #f1c40f;">
                <img src="ui/sword1.png" class="small-icon"> +${finalGoldReward} Gold
            </span>
        </div>
        ${currentLevelData.boss ? '<div style="color: #ffd700; font-size: 1.1em;"><img src="ui/trophy1.png" class="small-icon"> BOSS BONUS APPLIED!</div>' : ''}
    `;
    
    // ====== BUILD DETAILED STATS HTML ======
    let statsHTML = `
    <div class="victory-stats-grid">
        <div class="victory-stats-column">
            <h4><img src="ui/sword.png" class="small-icon"> Battle Statistics</h4>
            <div class="victory-stat-row">
                <span class="victory-stat-label"><img src="ui/scroll.png" class="small-icon"> Total Rounds:</span>
                <span class="victory-stat-value">${gameState.turnCount}</span>
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
                <span class="victory-stat-value">${gameState.battleStats.fleedUnits?.length || 0}</span>
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
                <span class="victory-stat-value">${gameState.completedLevels + 1}</span>
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
    
    // ====== SAVE PROGRESSION DATA ======
    gameState.persistentUnits = playerUnits.map(unit => {
        unit.hp = Math.min(unit.maxHp, unit.hp + Math.floor(unit.maxHp * 0.3));
        unit.morale = Math.min(100, unit.morale + 30);
        unit.remainingActions = unit.maxActions;
        unit.movesUsed = 0;
        unit.attacksUsed = 0;
        unit.acted = false;
        unit.fleeing = false;
        return unit;
    });
    
    gameState.completedLevels++;
    
    // ====== SET UP CONTINUE BUTTON ======
    const continueBtn = document.getElementById('continueBtn');
    
    if (gameState.currentLevel >= gameState.maxLevel) {
        // Final victory
        continueBtn.onclick = () => {
            document.getElementById('victoryOverlay').style.display = 'none';
            // Simple final victory alert
            alert("🎉 GAME COMPLETE! 🎉\nYou have defeated all enemies!\n\nFinal Stats:\n- Levels Completed: " + gameState.completedLevels + "\n- Total XP: " + gameState.totalXP + "\n- Gold: " + gameState.gold);
            restartGame();
        };
    } else {
        // For ALL non-final levels (1, 2, 3, 4)
        continueBtn.onclick = () => {
            console.log(`➡️ Continue button clicked for Level ${gameState.currentLevel}`);
            document.getElementById('victoryOverlay').style.display = 'none';
            openRecruitScreen();
        };
    }
}
     function advanceToLevel2() {
    console.log("Advancing to Level 2: Forest Pursuit");
    
    // Increment level
    gameState.currentLevel = 2;
    
    // Reset game state for new level
    gameState.units = [];
    gameState.selectedUnit = null;
    gameState.phase = 'select';
    gameState.aiProcessing = false;
    gameState.aiActiveUnit = null;
    gameState.turnCount = 1;
    gameState.currentPlayer = 'player';
    
    // Clear battle stats for new level
    gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
    
    // Generate new terrain for Level 2 (with river)
    generateTerrain();
    
    // Create units for Level 2
    createUnits();
    
    // Reset UI
    turnCountEl.textContent = '1';
    updateEnemiesCounter();
    updateSelectedUnitDisplay();
    
    // Clear battle log and add new messages
    battleLogEl.innerHTML = '';
    logMessage("=== LEVEL 2: FOREST PURSUIT ===", 'system');
    logMessage("The enemy has retreated across the river into the Darkwood Forest.", 'system');
    logMessage("Objective: Cross the river and eliminate all remaining threats.", 'system');
    logMessage("Caution: The river is impassable except at bridge crossings.", 'system');
    
    // Clear grid and recreate
    createGrid();
    
    // Render everything fresh
    renderAll([]);
    
    // Update UI
    updateUI();
    updatePhaseIndicator();
    
    // Play transition sound if you have one
    if (soundSystem && soundSystem.initialized) {
        soundSystem.playBeep(600, 0.3, 'sine', 0.2);
    }
}
   
    function startNextLevel() {
	 console.log(`[DEBUG-TRACE] === ENTER startNextLevel() === Level: ${gameState.currentLevel}`);
    console.trace(); // This will show the call stack
    
     if (gameState.currentLevel < gameState.maxLevel) {
        gameState.currentLevel++;
        console.log(`📈 Auto-incrementing to Level ${gameState.currentLevel}`);
    }
    
    console.log(`🎮 startNextLevel() called. Now at level: ${gameState.currentLevel}`);
    
    // ====== CRITICAL: CLEAR OLD STATE FIRST ======
    gameState.units = [];  // Clear all units
    gameState.selectedUnit = null;
    gameState.phase = 'select';
    gameState.aiProcessing = false;
    gameState.aiActiveUnit = null;
    
    // Reset turn counter and player phase
    gameState.turnCount = 1;
    gameState.currentPlayer = 'player';  // Player goes first in new level!
    
    // Clear battle stats for new level
    gameState.battleStats = {
        playerKills: 0,
        enemyKills: 0,
        damageDealt: 0,
        damageTaken: 0,
        totalRounds: 0,
        survivingUnits: [],
        fleedUnits: []
    };
    
    // Generate NEW terrain for the new level
    generateTerrain();
    
    // Create units for new level (this uses persistentUnits)
    createUnits();
    
    // Reset UI
    turnCountEl.textContent = '1';
    updateEnemiesCounter();
    updateSelectedUnitDisplay();
    
    // Clear battle log
    battleLogEl.innerHTML = '';
    
     // Regular level messages for ALL levels
const levelIndex = Math.min(gameState.currentLevel - 1, LEVELS.length - 1);
const level = LEVELS[levelIndex];
logMessage(`=== LEVEL ${gameState.currentLevel}: ${level.name} ===`, 'system');
logMessage(`Difficulty: ${level.difficulty}`, 'system');
logMessage(`Defeat all enemies!`, 'system');
logMessage(`Player has first turn!`, 'system');
    
    // Clear the grid and recreate it
    createGrid();
    
    // Render everything fresh
    renderAll([]);
     
    // Ensure UI buttons are properly enabled
    updateUI();
    updatePhaseIndicator();
}
 
// Make level system functions available globally
window.showLevel1To2Transition = showLevel1To2Transition;
window.showLevel2To3Transition = showLevel2To3Transition;
window.showLevel3To4Transition = showLevel3To4Transition;
window.showLevel4To5Transition = showLevel4To5Transition;
window.showGameCompleteScreen = showGameCompleteScreen;
window.completeLevel = completeLevel;
window.startNextLevel = startNextLevel;
