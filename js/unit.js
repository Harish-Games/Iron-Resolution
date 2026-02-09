
// Iron Resolution UNIT.js

        // ========== ENHANCED UNIT SYSTEM ==========
        class Unit {
            constructor(type, name, x, y, forceName = null) {
    this.id = gameState.nextUnitId++;
    this.type = type;
    this.name = forceName || generateRandomName(type, name);
    this.classType = this.extractClassType(name);
    this.x = x;
    this.y = y;
    this.lastMoveDirection = { dx: 0, dy: 0 }; // Track last move to avoid ping-pong
                this.accuracy = 80;
                this.aiPriority = this.getAIPriority();
                this.xp = 0;
                this.level = 1;
                this.xpToNext = 100;
                this.hitsLanded = 0;
				this.kills = 0;
				this.healsPerformed = 0;
				this.missionsCompleted = 0;
        
                // PHASE 2: Injuries & Morale
                this.injuries = [];
                this.morale = 100;
                this.moraleThreshold = 50;
                this.fleeing = false;
                this.fleeTurns = 0;
                
                // PHASE 1: Equipment
                this.equipment = this.generateStartingEquipment();
                
                this.setClassStats();
                this.applyEquipmentStats();
            }
            
           extractClassType(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('berserker') || lowerName.includes('troll')) return 'berserker';
    if (lowerName.includes('knight') || lowerName.includes('orc')) return 'knight';
    if (lowerName.includes('archer') || lowerName.includes('goblin')) return 'archer';
    if (lowerName.includes('mage') || lowerName.includes('shaman')) return 'mage';
    return 'warrior';
}
            
            generateStartingEquipment() {
                const equipment = {
                    weapon: null,
                    armor: null
                };
                
                switch(this.classType) {
                    case 'berserker':
                        equipment.weapon = {...WEAPONS.greatsword};
                        equipment.armor = {...ARMOR.leather};
                        break;
                    case 'knight':
                        equipment.weapon = {...WEAPONS.sword};
                        equipment.armor = {...ARMOR.chainmail};
                        break;
                    case 'archer':
                        equipment.weapon = {...WEAPONS.longbow};
                        equipment.armor = {...ARMOR.leather};
                        break;
                    case 'mage':
                        equipment.armor = {...ARMOR.leather};
                        break;
                    default:
                        equipment.weapon = {...WEAPONS.sword};
                        equipment.armor = {...ARMOR.leather};
                }
                
                return equipment;
            }
            
            setClassStats() {
                switch(this.classType) {
                    case 'berserker':
                        this.maxHp = 25;
                        this.hp = 25;
                        this.baseAttack = 12;
                        this.range = 1;
                        this.movement = 3;
                        this.maxActions = 3;
                        this.maxAttacks = 3;
                        this.moraleThreshold = 30;
                        break;
                        
                    case 'knight':
                        this.maxHp = 40;
                        this.hp = 40;
                        this.baseAttack = 10;
                        this.range = 1;
                        this.movement = 2;
                        this.maxActions = 3;
                        this.maxAttacks = 2;
                        this.moraleThreshold = 60;
                        break;
                        
                    case 'archer':
                        this.maxHp = 25;
                        this.hp = 25;
                        this.baseAttack = 8;
                        this.range = 3;
                        this.movement = 3;
                        this.maxActions = 3;
                        this.maxAttacks = 1;
                        this.accuracy = 85;
                        this.moraleThreshold = 40;
                        break;
                        
                    case 'mage':
                        this.maxHp = 20;
                        this.hp = 20;
                        this.baseAttack = 0;
                        this.range = 3;
                        this.movement = 2;
                        this.maxActions = 2;
                        this.maxAttacks = 0;
                        this.healPower = 10;
                        this.moraleThreshold = 50;
                        break;
                        
                    default:
                        this.maxHp = 30;
                        this.hp = 30;
                        this.baseAttack = 8;
                        this.range = 1;
                        this.movement = 2;
                        this.maxActions = 2;
                        this.maxAttacks = 2;
                        this.moraleThreshold = 50;
                }
                
                this.remainingActions = this.maxActions;
                this.movesUsed = 0;
                this.attacksUsed = 0;
                this.acted = false;
            }
            
            applyEquipmentStats() {
                if (this.equipment.weapon) {
                    this.attack = this.baseAttack + this.equipment.weapon.damage;
                    this.accuracy += this.equipment.weapon.accuracy || 0;
                    if (this.equipment.weapon.range) {
                        this.range += this.equipment.weapon.range;
                    }
                } else {
                    this.attack = this.baseAttack;
                }
                
                if (this.equipment.armor) {
                    this.defense = this.equipment.armor.defense || 0;
                    this.dodge = this.equipment.armor.dodge || 0;
                    if (this.equipment.armor.movement) {
                        this.movement += this.equipment.armor.movement;
                    }
                }
            }
            
            getAIPriority() {
                switch(this.classType) {
                    case 'mage': return 4;
                    case 'archer': return 3;
                    case 'berserker': return 2;
                    case 'knight': return 1;
                    default: return 1;
                }
            }
            
            get canMove() { 
                return !this.fleeing && this.remainingActions > 0 && this.movesUsed < this.movement; 
            }
            
            get canAttack() { 
                return !this.fleeing && this.remainingActions > 0 && this.attacksUsed < this.maxAttacks && this.attack > 0; 
            }
            
            get canHeal() {
                return !this.fleeing && this.remainingActions > 0 && this.classType === 'mage';
            }
            
            get canAct() { 
                return !this.fleeing && this.remainingActions > 0 && !this.acted; 
            }
            
            get actionPercent() { 
                return (this.remainingActions / this.maxActions) * 100; 
            }
            
            get hpPercent() { 
                return (this.hp / this.maxHp) * 100; 
            }
            
            get moralePercent() {
                return (this.morale / 100) * 100;
            }
            
            get xpPercent() { 
                return (this.xp / this.xpToNext) * 100; 
            }
            
            // PHASE 2: Injury system
            addInjury(injuryType) {
                const injury = {...INJURIES[injuryType]};
                injury.turnsRemaining = injury.duration;
                this.injuries.push(injury);
                this.applyInjuryEffects(injury);
                logMessage(`${this.name} suffers a ${injury.name}!`, 'system');
            }
            
            applyInjuryEffects(injury) {
                if (injury.effect.hp) this.hp += injury.effect.hp;
                if (injury.effect.attack) this.attack += injury.effect.attack;
                if (injury.effect.movement) this.movement += injury.effect.movement;
                if (injury.effect.accuracy) this.accuracy += injury.effect.accuracy;
            }
            
            updateInjuries() {
                for (let i = this.injuries.length - 1; i >= 0; i--) {
                    this.injuries[i].turnsRemaining--;
                    if (this.injuries[i].turnsRemaining <= 0) {
                        logMessage(`${this.name}'s ${this.injuries[i].name} has healed.`, 'system');
                        this.injuries.splice(i, 1);
                    }
                }
            }
            
            // PHASE 2: Morale system with flee behavior
            updateMorale(damageTaken, alliesLost = false) {
                let moraleLoss = Math.floor(damageTaken / 3);
                if (alliesLost) moraleLoss += 15;
                if (this.hpPercent < 50) moraleLoss += 10;
                
                this.morale = Math.max(0, this.morale - moraleLoss);
                
                if (this.morale < this.moraleThreshold) {
                    const penalty = Math.floor((this.moraleThreshold - this.morale) / 10);
                    this.accuracy -= penalty;
                    this.attack -= penalty;
                    logMessage(`${this.name} is shaken! (-${penalty} combat stats)`, 'system');
                }
                
                if (this.morale <= 0 && !this.fleeing) {
                    this.flee();
                }
                
                return moraleLoss;
            }
            
            flee() {
                this.fleeing = true;
                this.morale = 0;
                logMessage(`${this.name} has broken and is fleeing!`, 'system');
                soundSystem.playFlee();
                
                if (this.type === 'player') {
                    gameState.battleStats.fleedUnits.push(this);
                }
                this.fleeTurns = 0;
            }
            
            performFlee() {
                if (!this.fleeing) return false;
                
                this.fleeTurns++;
                
                // CHANCE TO RALLY EVERY TURN
    const rallyChance = 0.15 + (this.fleeTurns * 0.05); // 15% + 5% per turn fleeing
    if (Math.random() < rallyChance) {
        this.fleeing = false;
        this.morale = 30 + Math.floor(Math.random() * 21); // Rally to 30-50 morale
        this.movesUsed = 0; // RESET MOVEMENT
        logMessage(`${this.name} rallies and rejoins the fight!`, 'system');
        return false;
    }
               
                // Find closest enemy
                const enemies = gameState.units.filter(u => u.type !== this.type && !u.fleeing);
                let closestEnemy = null;
                let minDistance = Infinity;
                
                for (const enemy of enemies) {
                    const distance = Math.abs(this.x - enemy.x) + Math.abs(this.y - enemy.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestEnemy = enemy;
                    }
                }
                
                // Move away from closest enemy
                if (closestEnemy) {
                    const dx = this.x - closestEnemy.x;
                    const dy = this.y - closestEnemy.y;
                    
                    let moveX = this.x;
                    let moveY = this.y;
                    
                    if (Math.abs(dx) > Math.abs(dy)) {
                        moveX += dx > 0 ? 1 : -1;
                    } else {
                        moveY += dy > 0 ? 1 : -1;
                    }
                    
                    // Bound checking
                    moveX = Math.max(0, Math.min(GRID_SIZE - 1, moveX));
                    moveY = Math.max(0, Math.min(GRID_SIZE - 1, moveY));
                    
                    // Move if tile is empty and not water
                    if (!getUnitAt(moveX, moveY) && gameState.terrain[moveY][moveX] !== 'water') {
                        this.x = moveX;
                        this.y = moveY;
                        logMessage(`${this.name} flees in terror!`, 'system');
                        
                        // Update display if this unit is selected
        if (gameState.selectedUnit && gameState.selectedUnit.id === this.id) {
            updateSelectedUnitStats();
            
                    }
                }
                
              // After 3 turns of fleeing, remove from battle
                if (this.fleeTurns >= 3) {
                    return true;
                }
               }
                return false;
            }
            useAction(cost = 1) {
                this.remainingActions = Math.max(0, this.remainingActions - cost);
            }
            
            addXp(amount) {
                this.xp += amount;
                if (this.xp >= this.xpToNext) {
                    this.levelUp();
                }
            }
            
           levelUp() {
    this.level++;
    
    // FIX: Carry over leftover XP instead of losing it
    const leftoverXp = this.xp - this.xpToNext;
    this.xp = Math.max(0, leftoverXp); 
    
    this.xpToNext = Math.floor(this.xpToNext * 1.5);
    this.maxHp += 3;
    this.hp = Math.min(this.hp + 3, this.maxHp);
    
    if (this.attack > 0) {
        this.attack += 1;
    }
    
    if (this.classType === 'mage') {
        this.healPower += 2;
    }
    
    this.accuracy = Math.min(95, this.accuracy + 1);
    this.morale = Math.min(100, this.morale + 15);
    
    // Big centered level up announcement
    const popup = document.createElement('div');
    popup.className = 'level-up-popup';
    popup.textContent = `${this.name} LEVEL UP!`;
    document.body.appendChild(popup);

    // Remove after animation
    setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 2000);

    // Small on-tile popup too
    const indicator = document.createElement('div');
    indicator.className = 'combat-indicator level-up-indicator';
    indicator.textContent = 'LEVEL UP!';
    const tile = getTile(this.x, this.y);
    if (tile) {
        tile.appendChild(indicator);
        setTimeout(() => {
            if (indicator.parentNode === tile) {
                tile.removeChild(indicator);
            }
        }, 1200);
    }
    
    // Play level up sound
    soundSystem.playLevelUp();
}
                        getAttackChance(target) {
                let chance = this.accuracy;
                
                if (this.range > 1) {
                    const distance = Math.abs(this.x - target.x) + Math.abs(this.y - target.y);
                    chance -= distance * 5;
                }
                
                // DEFENSIVE terrain effect (target's terrain)
                const targetTerrain = gameState.terrain[target.y][target.x];
                const targetTerrainEffect = TERRAIN_EFFECTS[targetTerrain] || TERRAIN_EFFECTS.normal;
                chance += targetTerrainEffect.accuracyAgainst;
                
                // OFFENSIVE terrain effect (attacker's terrain - attacking FROM here)
                const attackerTerrain = gameState.terrain[this.y][this.x];
                const attackerTerrainEffect = TERRAIN_EFFECTS[attackerTerrain] || TERRAIN_EFFECTS.normal;
                chance += attackerTerrainEffect.offensiveAccuracy;
                
                if (this.morale < this.moraleThreshold) {
                    chance -= Math.floor((this.moraleThreshold - this.morale) / 5);
                }
                
                if (target.dodge) {
                    chance -= target.dodge;
                }
                
                return Math.max(20, Math.min(95, chance));
            }

checkHeroicRally() {
    // Very low HP units might make a last stand
    if (this.hp > 0 && this.hp < this.maxHp * 0.2 && this.morale < 30) {
        if (Math.random() < 0.1) { // 10% chance
            const rallyBoost = 40 + Math.floor(Math.random() * 31); // 40-70 morale
            this.morale = Math.min(100, this.morale + rallyBoost);
            this.fleeing = false;
            logMessage(`${this.name} makes a heroic last stand! Morale restored!`, 'system');
            return true;
        }
    }
    return false;
}
}


// Make Unit class globally available
window.Unit = Unit;
    
    // Handle fleeing player units
    const playerUnits = gameState.units.filter(u => u.type === 'player');
    for (const unit of playerUnits) {
        if (unit.fleeing) {
            const removed = unit.performFlee();
            if (removed) {
                gameState.units = gameState.units.filter(u => u.id !== unit.id);
            }
        }
    }
    
    // Handle fleeing enemy units
    const enemyUnits = gameState.units.filter(u => u.type === 'enemy');
    for (const unit of enemyUnits) {
        if (unit.fleeing) {
            const removed = unit.performFlee();
            if (removed) {
                gameState.units = gameState.units.filter(u => u.id !== unit.id);
            }
        }
    }
 
