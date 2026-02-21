// Iron Resolution LEVEL SYSTEM.js

    
     // ========== LEVEL TRANSITION SCREEN ==========
   
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
                    <img src="images/mountain.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
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
    startNextLevel();  // ← NOW startNextLevel() will show stats
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
                        The ambush in the pass has been eliminated. Before you lies the 
                        enemy's mountain citadel - a fortress carved into the peaks 
                        themselves, bristling with defenses.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        THE APPROACH
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        A narrow valley leads to the main gate, flanked by watchtowers 
                        and defensive positions. Enemy camps dot the slopes, and the 
                        sounds of war drums echo from within.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        THE GARRISON
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        Intelligence suggests the warlord has gathered his remaining forces 
                        for one final stand. Veterans, elite guards, and war beasts 
                        all await your assault.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/village-enemy.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>OBJECTIVE:</strong> Breach the citadel and confront the enemy warlord
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

// ========== LEVEL 5 TO 6 TRANSITION ==========
function showLevel5To6Transition() {
    console.log("🎬 Creating Level 5 to Level 6 transition");
    
    // Create transition overlay
    const transitionHTML = `
        <div id="transition56Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    AFTERMATH: THE GREMLIN SWARM
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        THE WARLORD FALLS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The warlord's body lies broken at your feet. His fortress, once thought impregnable, 
                        now belongs to the fallen.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        UNWELCOME GUESTS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        As you sift through the rubble, skittering noises echo from over the ridge. 
                        Your veterans are exhausted, but you know you have to check.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        WHAT ARE THEY?
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        You head down the mountain and are confronted by a... wait, what ARE they?<br><br>
                        The Gremlin. Small. Annoying. And very, very in the way.<br><br>
                        <strong>Hack through the swarm. Silence the archers. Let nothing escape.</strong>
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/sword2.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>OBJECTIVE:</strong> Clear the mountain pass of the gremlin infestation
                </div>
                
                <button id="continueToLevel6Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="images/mountain-pass.webp" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    DESCEND INTO THE PASS
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
    
    console.log("🎬 Level 5→6 transition overlay added to DOM");
    
    // Set up event listeners
    const continueBtn = document.getElementById('continueToLevel6Btn');
    const transitionOverlay = document.getElementById('transition56Overlay');
    
    // Button click
    continueBtn.onclick = () => {
        console.log("🎬 Continue to Level 6 button clicked");
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
            console.log("🎬 Space pressed to continue to Level 6");
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
                console.log("🎬 Overlay clicked to continue to Level 6");
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                startNextLevel();
            }
        });
    }
}


// ========== LEVEL 6 TO 7 TRANSITION ==========
function showLevel6To7Transition() {
    console.log("🎬 Creating Level 6 to Level 7 transition");
    
    const transitionHTML = `
        <div id="transition67Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    THE MISTY LOWLANDS
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        THE MOUNTAIN PASS DESCENDS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        Rock becomes soil, then moss, then pools of stagnant water. 
                        Somewhere ahead lies the Swamp of Sorrows.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        THE ENEMY WAITS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Gremlins dart between trees, warning of your approach. Among them, 
                        knights lock shields. Archers nock arrows. Berserkers sharpen their axes.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        YOUR OBJECTIVE
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        They stand between you and the swamp.<br><br>
                        <strong>Make them regret it.</strong>
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/mountain-pass.webp" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> Valley floor - mountains behind, forest ahead, water pools below
                </div>
                
                <button id="continueToLevel7Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/sword2.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    DESCEND INTO THE VALLEY
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    const continueBtn = document.getElementById('continueToLevel7Btn');
    const transitionOverlay = document.getElementById('transition67Overlay');
    
    continueBtn.onclick = () => {
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        
        startNextLevel();
    };
    
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
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
    
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                startNextLevel();
            }
        });
    }
}

// ========== LEVEL 8 TO 9 TRANSITION ==========
function showLevel8To9Transition() {
    console.log("🎬 Creating Level 8 to Level 9 transition");
    
    const transitionHTML = `
        <div id="transition89Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    THE FOG FIELDS
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        YOU EMERGE FROM THE SWAMP
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        You emerge from the swamp expecting clear skies. Instead, the fog follows you.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #a0a0a0;">
                    <h3 class="section-header" style="color: #cccccc;">
                        NOT MIST. NOT SMOKE.
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Something older. The fog here has weight, has purpose. It rolls across the lowlands in thick waves, hiding everything beyond a few strides. Your veterans exchange uneasy glances. This isn't natural.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        THROUGH BREAKS IN THE MIST
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        You glimpse fragments of terrain - a rocky outcrop here, a forest edge there, pools of stagnant water that echo the swamp you just left. But nothing stays visible for long.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/fog.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>VISIBILITY:</strong> 4 tiles. Beyond that, only fog. The enemy hides somewhere in the mist. Move carefully.
                </div>
                
                <button id="continueToLevel9Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="images/fog.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ENTER THE FOG
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    const continueBtn = document.getElementById('continueToLevel9Btn');
    const transitionOverlay = document.getElementById('transition89Overlay');
    
    continueBtn.onclick = () => {
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        startNextLevel();
    };
    
    // Add space key and click handlers (same as other transitions)
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
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
    
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                startNextLevel();
            }
        });
    }
}


// ========== LEVEL 7 TO 8 TRANSITION ==========
function showLevel7To8Transition() {
    console.log("🎬 Creating Level 7 to Level 8 transition");
    
    const transitionHTML = `
        <div id="transition78Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    THE SWAMP OF SORROWS
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        THE VALLEY FLOOR ENDS
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        Not gradually, but suddenly - as if the land itself gave up trying.
                        Black water stretches before you, dotted with cypress trees draped in moss.
                        Fog rolls across the surface, hiding what lies beneath.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #2ecc71;">
                    <h3 class="section-header" style="color: #2ecc71;">
                        THE AIR SMELLS OF DECAY
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        Your scouts report movement. Gremlins, of course - they're everywhere here. 
                        But also archers, finding rare patches of solid ground. Mages, whispering into the mist. 
                        Knights, standing guard on the only dry approaches.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff6b6b;">
                        TERRAIN PENALTY
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        <strong>Swamp:</strong> Movement halved (rounded down) each turn.<br>
                        <strong>Note:</strong> Gremlins are unaffected - they're native to these waters.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/swamp.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> 55% Swamp | 20% Water | 15% Forest | 10% Normal
                </div>
                
                <button id="continueToLevel8Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="images/swamp.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ENTER THE SWAMP
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    const continueBtn = document.getElementById('continueToLevel8Btn');
    const transitionOverlay = document.getElementById('transition78Overlay');
    
    continueBtn.onclick = () => {
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        startNextLevel();
    };
    
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
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
    
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
                transitionOverlay.style.display = 'none';
                if (overlayDiv.parentNode) {
                    document.body.removeChild(overlayDiv);
                }
                startNextLevel();
            }
        });
    }
}

// ========== LEVEL 9 TO 10 TRANSITION ==========
function showLevel9To10Transition() {
    console.log("🎬 Creating Level 9 to Level 10 transition");
    
    const transitionHTML = `
        <div id="transition910Overlay" class="intro-overlay" style="display: flex;">
            <div class="intro-modal">
                <div class="intro-title" style="margin-bottom: 25px;">
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                    THE FINAL STAND
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        THE FOG VANISHES
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The fog vanishes. The final battle awaits!
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        BEFORE YOU LIES THE END
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        A river so wide it could swallow armies. A bridge so long it takes four turns to cross. Twin fortresses of black stone, their walls lined with archers, their gates guarded by knights, their keeps burning with dark fire.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        THREE FIGURES WATCH
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        <strong>The Warlord.</strong> Iron and rage. She waits in the central keep, surrounded by her finest.<br><br>
                        <strong>The Sorcerer.</strong> Shadow and flame. His tower crackles with power, lightning dancing between the battlements.<br><br>
                        <strong>The Beastmaster.</strong> Flesh and fang. His courtyard echoes with the snarls of things that should not exist.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; padding: 12px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid #f1c40f;">
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; font-style: italic; color: #f1c40f;">
                        They know why you're here. They've been waiting.<br><br>
                        This is the end of the journey. Make your village proud.
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="ui/sword3.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>THE FINAL BATTLE:</strong> Cross the bridge. Breach the fortresses. Defeat all three leaders.
                </div>
                
                <button id="continueToLevel10Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="ui/sword3.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    BEGIN THE FINAL BATTLE
                </button>
                
                <div class="intro-tip" style="margin-top: 15px; color: #8892b0; font-size: 0.9em;">
                    Press Space or click to continue
                </div>
            </div>
        </div>
    `;
    
    const overlayDiv = document.createElement('div');
    overlayDiv.innerHTML = transitionHTML;
    document.body.appendChild(overlayDiv);
    
    const continueBtn = document.getElementById('continueToLevel10Btn');
    const transitionOverlay = document.getElementById('transition910Overlay');
    
    continueBtn.onclick = () => {
        if (transitionOverlay) {
            transitionOverlay.style.display = 'none';
        }
        if (overlayDiv.parentNode) {
            document.body.removeChild(overlayDiv);
        }
        startNextLevel();
    };
    
    document.addEventListener('keydown', function transitionKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && transitionOverlay && transitionOverlay.style.display === 'flex') {
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
    
    if (transitionOverlay) {
        transitionOverlay.addEventListener('click', function(e) {
            if (e.target === transitionOverlay) {
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
    console.log("🏆 Showing game complete cinematic");
    
    // Hide victory overlay if it's showing
    document.getElementById('victoryOverlay').style.display = 'none';
    
    // Show the cinematic
    document.getElementById('endGameOverlay').style.display = 'flex';
    
    // Set up continue button
    document.getElementById('continueToStatsBtn').onclick = () => {
        document.getElementById('endGameOverlay').style.display = 'none';
        showCampaignStats();
    };
    
    // Space bar handler
    document.addEventListener('keydown', function endGameKeyHandler(e) {
        if ((e.code === 'Space' || e.key === ' ') && 
            document.getElementById('endGameOverlay').style.display === 'flex') {
            e.preventDefault();
            document.getElementById('endGameOverlay').style.display = 'none';
            document.removeEventListener('keydown', endGameKeyHandler);
            showCampaignStats();
        }
    });
}

function showCampaignStats() {
    console.log("📊 showCampaignStats started");
    
    // Calculate final stats
    const playerUnits = gameState.units.filter(u => u.type === 'player' && u.hp > 0);
    console.log("Player units:", playerUnits.length);
    
    const totalXP = gameState.totalXP;
    const totalKills = gameState.battleStats.playerKills || 0;
    const survivors = playerUnits.length;
    const levelsCompleted = gameState.completedLevels;
    
    console.log("Stats:", {totalXP, totalKills, survivors, levelsCompleted});
    
    // Build stats HTML
    let finalStats = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 2em; color: #64ffda; margin-bottom: 20px;">CAMPAIGN STATS</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; margin: 20px 0;">
                <div style="color: #8892b0;">Total XP Earned:</div>
                <div style="color: #64ffda; font-weight: bold;">${totalXP}</div>
                
                <div style="color: #8892b0;">Levels Completed:</div>
                <div style="color: #64ffda; font-weight: bold;">${levelsCompleted}/10</div>
                
                <div style="color: #8892b0;">Enemies Killed:</div>
                <div style="color: #64ffda; font-weight: bold;">${totalKills}</div>
                
                <div style="color: #8892b0;">Surviving Units:</div>
                <div style="color: ${survivors >= 4 ? '#2ecc71' : '#ff6b6b'}; font-weight: bold;">${survivors}/6</div>
                
                <div style="color: #8892b0;">Final Gold:</div>
                <div style="color: #f1c40f; font-weight: bold;">${gameState.gold}</div>
            </div>
    `;
    
    // Add surviving heroes list
    if (playerUnits.length > 0) {
        finalStats += `<div style="margin-top: 20px;"><strong style="color: #64ffda;">Surviving Heroes</strong></div>`;
        playerUnits.forEach(unit => {
            finalStats += `
                <div style="display: flex; justify-content: space-between; margin: 5px 0; padding: 5px; background: rgba(30, 73, 118, 0.3); border-radius: 4px;">
                    <span style="color: #e6f1ff;">${unit.name} (Lvl ${unit.level})</span>
                    <span style="color: #2ecc71;">${unit.hp}/${unit.maxHp} HP</span>
                </div>
            `;
        });
    }
    
    finalStats += `</div>`;
    
    console.log("Updating victory overlay elements");
    
    // Use victory overlay for stats
    document.getElementById('victoryLevelName').textContent = "CAMPAIGN COMPLETE";
    document.getElementById('victoryLevelDifficulty').textContent = "Final Victory";
    document.getElementById('victoryRewards').innerHTML = "";
    document.getElementById('victoryStats').innerHTML = finalStats;
    
    console.log("Setting up continue button");
    
    // Update continue button to go to name entry
    document.getElementById('continueBtn').onclick = () => {
        console.log("Continue button clicked - going to name entry");
        document.getElementById('victoryOverlay').style.display = 'none';
        
        // Show name entry with campaign stats
        showNameEntry(
            gameState.totalXP,
            gameState.currentLevel,
            gameState.battleStats.playerKills || 0,
            playerUnits.length,
            gameState.difficulty
        );
    };
    
    console.log("Showing victory overlay");
    
    // Show stats
    document.getElementById('victoryOverlay').style.display = 'flex';
    
    console.log("showCampaignStats completed");
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
                    MISSION UPDATE: FOREST OUTPOST
                    <img src="ui/sword.png" alt="⚔" class="title-icon" style="width: 34px; height: 34px;">
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px;">
                    <h3 class="section-header" style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 8px;">
                        DARKWOOD PURSUIT COMPLETE
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        The Darkwood Forest has been cleared, but your scouts report a fortified enemy outpost 
                        ahead. The bandits have dug in behind a defensive river line.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.3); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <h3 class="section-header" style="color: #ff9e6b;">
                        RIVER DEFENSES
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6; color: #e6f1ff;">
                        A fast-flowing river cuts across the battlefield, blocking direct access to the enemy outpost.
                        Only two narrow crossing points exist - one in the north and one in the south.
                        The enemy has positioned archers to cover both approaches.
                    </div>
                </div>
                
                <div class="intro-section" style="margin-bottom: 20px; background: rgba(30, 73, 118, 0.4); padding: 15px; border-radius: 8px; border-left: 4px solid #64ffda;">
                    <h3 class="section-header" style="color: #64ffda;">
                        TACTICAL SITUATION
                    </h3>
                    <div class="section-content" style="font-size: 1.1em; line-height: 1.6;">
                        <div style="margin-bottom: 8px;"><strong>LEFT SIDE:</strong> Your forces approach through mixed forest terrain</div>
                        <div style="margin-bottom: 8px;"><strong>RIVER:</strong> Impassable except at two bridge crossings</div>
                        <div style="margin-bottom: 8px;"><strong>RIGHT SIDE:</strong> Enemy outpost with defensive positions</div>
                        <div><strong>OBJECTIVE:</strong> Cross the river and eliminate the enemy outpost</div>
                    </div>
                </div>
                
                <div class="controls-note" style="margin: 20px 0; padding: 12px; background: rgba(30, 73, 118, 0.3); border: 1px solid rgba(255, 193, 7, 0.3); color: #f1c40f;">
                    <img src="images/river.png" style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px;">
                    <strong>BATTLEFIELD:</strong> Forest outpost with river barrier - find the crossings!
                </div>
                
                <button id="continueToLevel3Btn" class="intro-continue-btn" style="margin-top: 20px; min-width: 280px;">
                    <img src="images/forest.png" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
                    ADVANCE TO THE OUTPOST
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
    
    // ====== CALCULATE REWARDS ======
    const currentLevelData = LEVELS[gameState.currentLevel - 1];
    const baseXpReward = 100 + (gameState.currentLevel * 50);
    const baseGoldReward = 50 + (gameState.currentLevel * 25);
    const finalXpReward = currentLevelData.boss ? baseXpReward * 2 : baseXpReward;
    const finalGoldReward = currentLevelData.boss ? baseGoldReward * 2 : baseGoldReward;
    
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
    gameState.totalXP += finalXpReward;
    gameState.gold += finalGoldReward;
    
    // ====== SET UP CONTINUE BUTTON ======
const continueBtn = document.getElementById('continueBtn');

if (gameState.currentLevel >= gameState.maxLevel) {
    // Final victory - show cinematic instead of recruit screen
    continueBtn.onclick = () => {
        document.getElementById('victoryOverlay').style.display = 'none';
        // Show the end game cinematic
        showGameCompleteScreen();
    };
} else {
    // For non-final levels
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
    
     if (gameState.currentLevel < gameState.maxLevel) {
        gameState.currentLevel++;
        console.log(`📈 Auto-incrementing to Level ${gameState.currentLevel}`);
    }

// Update level display
    document.getElementById('levelNameDisplay').textContent = 
    `${gameState.currentLevel}: ${LEVELS[gameState.currentLevel - 1].name}`;
    
    console.log("Current difficulty multiplier in startNextLevel:", gameState.difficultyMultiplier);
        
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
    updateVision();
    
    // Reset UI
    turnCountEl.textContent = '1';
    updateEnemiesCounter();
    updateSelectedUnitDisplay();
    
    // Clear battle log
    battleLogEl.innerHTML = '';
    renderAll([]);
    
    
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
window.showLevel5To6Transition = showLevel5To6Transition;
window.showLevel6To7Transition = showLevel6To7Transition;
window.showLevel7To8Transition = showLevel7To8Transition;
window.showLevel8To9Transition = showLevel8To9Transition;
window.showLevel9To10Transition = showLevel9To10Transition;
window.showGameCompleteScreen = showGameCompleteScreen;
window.showCampaignStats = showCampaignStats; 
window.completeLevel = completeLevel;
window.startNextLevel = startNextLevel;
