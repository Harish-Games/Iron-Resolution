// Iron Resolution SOUND SYSTEM.JS

       // ========== SIMPLE SOUND SYSTEM ==========
        class SoundSystem {
            constructor() {
                this.audioContext = null;
                this.initialized = false;
            }
            
            init() {
                if (this.initialized) return;
                
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.initialized = true;
                } catch (e) {
                    console.log("Could not initialize audio context:", e);
                }
            }
            
            playBeep(frequency, duration, type = 'sine', volume = 0.3) {
                if (!gameState.soundEnabled || !this.initialized) return;
                
                try {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.value = frequency;
                    oscillator.type = type;
                    
                    const now = this.audioContext.currentTime;
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
                    
                    oscillator.start(now);
                    oscillator.stop(now + duration);
                } catch (e) {
                    console.log("Sound play failed:", e);
                }
            }
            
            playAttack() { this.playBeep(800, 0.1, 'square', 0.2); }
            playRanged() { this.playBeep(1200, 0.15, 'sine', 0.2); }
            playHit() { this.playBeep(400, 0.2, 'square', 0.3); }
            playMiss() { this.playBeep(1500, 0.08, 'sine', 0.1); }
            playHeal() { this.playBeep(600, 0.3, 'sine', 0.2); }
            playSelect() { this.playBeep(600, 0.05, 'sine', 0.1); }
            playFlee() { this.playBeep(300, 0.4, 'sawtooth', 0.2); }
            
            playLevelUp() {
        if (!gameState.soundEnabled || !this.initialized) return;
        
        try {
            const now = this.audioContext.currentTime;
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Two-tone fanfare: G5 to C6
            oscillator1.frequency.value = 784;  // G5
            oscillator2.frequency.value = 1046; // C6
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            // Volume envelope
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            oscillator1.start(now);
            oscillator2.start(now + 0.1); // Staggered start
            oscillator1.stop(now + 1.5);
            oscillator2.stop(now + 1.5);
            
        } catch (e) {
            console.log("Level up sound failed:", e);
        }
    }
            toggle() {
                gameState.soundEnabled = !gameState.soundEnabled;
                document.getElementById('soundToggle').textContent = 
                    gameState.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
                
                if (gameState.soundEnabled && !this.initialized) {
                    this.init();
                }
            }

playEnemyDeath() {
    if (!gameState.soundEnabled || !this.initialized) return;
    
    const now = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    masterGain.connect(this.audioContext.destination);
    masterGain.gain.setValueAtTime(0.3, now);
    
    // Low demonic growl
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.exponentialRampToValueAtTime(50, now + 0.2);
    
    // High screech
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(500, now);
    osc2.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    
    osc1.connect(masterGain);
    osc2.connect(masterGain);
    
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.25);
}

playPlayerDeath() {
    if (!gameState.soundEnabled || !this.initialized) return;
    
    const now = this.audioContext.currentTime;
    const masterGain = this.audioContext.createGain();
    masterGain.connect(this.audioContext.destination);
    masterGain.gain.setValueAtTime(0.4, now);
    
    // Heavy thud
    const thud = this.audioContext.createOscillator();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(80, now);
    thud.frequency.exponentialRampToValueAtTime(30, now + 0.25);
    
    // Metal clang
    const clang = this.audioContext.createOscillator();
    clang.type = 'square';
    clang.frequency.setValueAtTime(250, now + 0.1);
    clang.frequency.exponentialRampToValueAtTime(120, now + 0.3);
    
    thud.connect(masterGain);
    clang.connect(masterGain);
    
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    thud.start(now);
    clang.start(now + 0.1);
    thud.stop(now + 0.4);
    clang.stop(now + 0.4);
}


            // ====== MENU SOUNDS ======
            playMenuClick() { 
                if (!gameState.soundEnabled || !this.initialized) return;
                this.playBeep(600, 0.1, 'sine', 0.15); 
            }
            
            playMenuHover() { 
                if (!gameState.soundEnabled || !this.initialized) return;
                this.playBeep(400, 0.05, 'sine', 0.08); 
            }
            
            playMenuDenied() { 
                if (!gameState.soundEnabled || !this.initialized) return;
                this.playBeep(200, 0.3, 'sawtooth', 0.2); 
            }
            
            playMenuConfirm() { 
                if (!gameState.soundEnabled || !this.initialized) return;
                this.playBeep(800, 0.2, 'sine', 0.2); 
            }
            
            playMenuStart() {
                if (!gameState.soundEnabled || !this.initialized) return;
                try {
                    const now = this.audioContext.currentTime;
                    const oscillator1 = this.audioContext.createOscillator();
                    const oscillator2 = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator1.connect(gainNode);
                    oscillator2.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    // Triumphant two-tone
                    oscillator1.frequency.value = 523;  // C5
                    oscillator2.frequency.value = 659;  // E5
                    oscillator1.type = 'sine';
                    oscillator2.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, now);
                    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
                    
                    oscillator1.start(now);
                    oscillator2.start(now + 0.05);
                    oscillator1.stop(now + 1.0);
                    oscillator2.stop(now + 1.0);
                } catch (e) {
                    console.log("Menu start sound failed:", e);
                }
            }

        }
        
        const soundSystem = new SoundSystem();
        soundSystem.init();

// Make sound system available globally
window.soundSystem = soundSystem;
