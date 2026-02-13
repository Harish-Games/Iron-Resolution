// Iron Resolution CAMPAIGN CONTROLLER.js
// STEP 1: Just the skeleton - game will still use old flow

const CampaignController = {
    // Current state
    currentLevel: 1,
    maxUnlockedLevel: 1,
    
    // Campaign data
    levels: [
        { id: 1, name: "Village Defense", difficulty: "Easy", boss: false, completed: false },
        { id: 2, name: "Darkwood Approach", difficulty: "Medium", boss: false, completed: false },
        { id: 3, name: "Forest Outpost", difficulty: "Medium", boss: false, completed: false },
        { id: 4, name: "Mountain Pass", difficulty: "Hard", boss: false, completed: false },
        { id: 5, name: "Enemy Citadel", difficulty: "Hard", boss: true, completed: false }
    ],
    
    // For now, these just log - old flow still runs
    onVictory() {
        console.log("🏆 CampaignController: Victory detected");
    },
    
    onVictoryContinue() {
        console.log("➡️ CampaignController: Continue clicked");
    },
    
    onCampComplete() {
        console.log("➡️ CampaignController: Camp complete");
        
        // For now, still use old transition functions
        const nextLevel = this.currentLevel + 1;
        
        if (this.currentLevel === 1) {
            showLevel1To2Transition();
        } else if (this.currentLevel === 2) {
            showLevel2To3Transition();
        } else if (this.currentLevel === 3) {
            showLevel3To4Transition();
        } else if (this.currentLevel === 4) {
            showLevel4To5Transition();
        } else if (this.currentLevel === 5) {
            showGameCompleteScreen();
        }
    },  // ← Added comma here
    
    onAdvanceToNextLevel() {
        console.log("➡️ CampaignController: Advancing to next level");
        
        // Increment current level
        this.currentLevel++;
        
        // For now, use the old startNextLevel function
        if (typeof startNextLevel === 'function') {
            startNextLevel();
        } else {
            console.error("startNextLevel not found!");
        }
    },  // ← Added comma here
    
    // Helper
    getCurrentLevelData() {
        return this.levels[this.currentLevel - 1];
    }
};

// Make globally available
window.CampaignController = CampaignController;
