// ====== MENU SYSTEM ======

console.log("📜 menu.js loading...");

document.addEventListener('DOMContentLoaded', function() {
    console.log("=== MENU SYSTEM INITIALIZING ===");
    
    // ====== ELEMENT REFERENCES ======
    // ADD THESE VARIABLE DECLARATIONS:
    const mainMenu = document.getElementById('mainMenuOverlay');
    const instructionsModal = document.getElementById('instructionsOverlay');
    const introSplash = document.getElementById('introOverlay');
    const onePlayerBtn = document.getElementById('onePlayerBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const quitBtn = document.getElementById('quitBtn');
    const instructionsBackBtn = document.getElementById('instructionsBackBtn');
    
    console.log("Elements:", {
        mainMenu: !!mainMenu,
        introSplash: !!introSplash,
        onePlayerBtn: !!onePlayerBtn
    });
    
    // ====== EVENT LISTENERS ======
    
    // Add hover sounds to all menu buttons
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (window.soundSystem) {
                window.soundSystem.playMenuHover();
            }
        });
    });
    
    // Add hover sounds to tab buttons too
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (window.soundSystem && !this.classList.contains('active')) {
                window.soundSystem.playMenuHover();
            }
        });
    });
    
    // One Player Game
    onePlayerBtn.addEventListener('click', function() {
		console.log("🎮 One Player Game button clicked!");
        if (window.soundSystem) {
            window.soundSystem.playMenuConfirm();
        }
        // Hide main menu
        mainMenu.style.display = 'none';
        // Show your existing intro splash
        introSplash.style.display = 'flex';
    });
    
    // Two Player Game (placeholder)
    twoPlayerBtn.addEventListener('click', function() {
        if (window.soundSystem) {
            window.soundSystem.playMenuDenied();
        }
        // Show "Coming Soon" message
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #0a1929, #112240);
            border: 2px solid #f1c40f;
            border-radius: 10px;
            padding: 25px;
            z-index: 4000;
            color: #e6f1ff;
            text-align: center;
            min-width: 300px;
            box-shadow: 0 0 30px rgba(241, 196, 15, 0.4);
        `;
        modal.innerHTML = `
            <h3 style="color: #f1c40f; margin-top: 0;">FEATURE IN DEVELOPMENT</h3>
            <p>Two-player hotseat mode is planned for v1.0!</p>
            <p style="color: #8892b0; font-size: 0.9em; margin: 15px 0;">
                Battle against a friend on the same computer
            </p>
            <button id="modalOkBtn" style="
                background: linear-gradient(145deg, #0a7c71, #4ecdc4);
                border: 1px solid #64ffda;
                color: white;
                padding: 10px 25px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 15px;
            ">UNDERSTOOD</button>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('modalOkBtn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Add backdrop click to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });
    
    // Instructions
    instructionsBtn.addEventListener('click', function() {
        if (window.soundSystem) {
            window.soundSystem.playMenuClick();
        }
        mainMenu.style.display = 'none';
        instructionsModal.style.display = 'flex';
    });
    
    // Back from Instructions
    instructionsBackBtn.addEventListener('click', function() {
        if (window.soundSystem) {
            window.soundSystem.playMenuClick();
        }
        instructionsModal.style.display = 'none';
        mainMenu.style.display = 'flex';
    });
    
    // Quit Game
    quitBtn.addEventListener('click', function() {
        if (window.soundSystem) {
            window.soundSystem.playMenuClick();
        }
        
        const quitModal = document.createElement('div');
        quitModal.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #0a1929, #112240);
            border: 2px solid #ef4444;
            border-radius: 10px;
            padding: 30px;
            z-index: 4000;
            color: #e6f1ff;
            text-align: center;
            min-width: 350px;
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
        `;
        quitModal.innerHTML = `
            <h3 style="color: #ef4444; margin-top: 0;">QUIT GAME?</h3>
            <p>Are you sure you want to leave the battlefield?</p>
            <p style="color: #8892b0; font-size: 0.9em; margin: 20px 0;">
                All unsaved progress will be lost.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                <button id="quitConfirmBtn" style="
                    background: linear-gradient(145deg, #7f1d1d, #ef4444);
                    border: 1px solid #ef4444;
                    color: white;
                    padding: 10px 25px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    min-width: 100px;
                ">YES, QUIT</button>
                <button id="quitCancelBtn" style="
                    background: linear-gradient(145deg, #233554, #1e4976);
                    border: 1px solid #64ffda;
                    color: #64ffda;
                    padding: 10px 25px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    min-width: 100px;
                ">NO, STAY</button>
            </div>
        `;
        document.body.appendChild(quitModal);
        
        document.getElementById('quitConfirmBtn').addEventListener('click', function() {
            if (window.soundSystem) {
                window.soundSystem.playMenuConfirm();
            }
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #0a1929;
                    color: #64ffda;
                    text-align: center;
                    padding: 20px;
                    transition: opacity 1s;
                ">
                    <h1 style="color: #64ffda; margin-bottom: 20px;">
                        <img src="ui/sword.png" style="width: 34px; height: 34px; vertical-align: middle;">
                        IRON RESOLUTION
                        <img src="ui/sword.png" style="width: 34px; height: 34px; vertical-align: middle;">
                    </h1>
                    <p style="font-size: 1.2em; margin-bottom: 30px;">Thanks for playing!</p>
                    <p style="color: #8892b0;">The village will remember your command.</p>
                    <p style="color: #8892b0; font-size: 0.9em; margin-top: 40px;">
                        Refresh the page to play again.
                    </p>
                </div>
            `;
        });
        
        document.getElementById('quitCancelBtn').addEventListener('click', function() {
            if (window.soundSystem) {
                window.soundSystem.playMenuClick();
            }
            document.body.removeChild(quitModal);
        });
        
        // Add backdrop click to close
        quitModal.addEventListener('click', function(e) {
            if (e.target === quitModal) {
                document.body.removeChild(quitModal);
            }
        });
});

     // ====== TAB SYSTEM (SIMPLE FIX) ======
    
    // Wait a moment for DOM to be fully ready
    setTimeout(() => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const tabContainer = document.querySelector('.tab-content-container');
        
        console.log("Tab elements found:", {
            buttons: tabBtns.length,
            contents: tabContents.length,
            container: !!tabContainer
        });
        
        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    console.log("Switching to:", tabId);
                    
                    // Update UI
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    const content = document.getElementById(tabId);
                    if (content) content.classList.add('active');
                    
                    // Reset scroll
                    if (tabContainer) tabContainer.scrollTop = 0;
                    
                    // Sound
                    if (window.soundSystem) window.soundSystem.playMenuClick();
                });
            });
            
            console.log("✅ Tabs working!");
        } else {
            console.error("❌ No tab buttons found!");
        }
    }, 100); // Small delay to ensure DOM is ready
    
    // ====== INITIAL SETUP ======
    console.log("✅ Menu system initialized!");
    
}); 
