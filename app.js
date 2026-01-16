/**
 * BAHN-BINGO - Main Application
 * Features: Anti-Cheat, Daily Challenges, Achievements, Optimized Performance
 */

(function() {
    'use strict';

    // =========================================
    // CONFIGURATION
    // =========================================
    const CONFIG = {
        STORAGE_KEY: 'bahnBingo_v2',
        CHECKSUM_SALT: 'BahnBingo2024!Salz',
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        CONFETTI_COUNT: 150,
        GAME_TIMER_INTERVAL: 1000
    };

    // =========================================
    // STATE MANAGEMENT
    // =========================================
    let state = {
        user: null,
        board: [],
        marked: new Set(),
        gameStartTime: null,
        gameTimerInterval: null,
        currentStreak: 0,
        isGameActive: false
    };

    // =========================================
    // ANTI-CHEAT SYSTEM
    // =========================================
    const AntiCheat = {
        /**
         * Generiere eine Checksumme für die Stats
         * Macht einfaches Manipulieren im localStorage schwieriger
         */
        generateChecksum(data) {
            const str = JSON.stringify(data) + CONFIG.CHECKSUM_SALT;
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(36);
        },

        /**
         * Validiere Stats auf Plausibilität
         */
        validateStats(stats) {
            if (stats.wins < 0 || stats.gamesPlayed < 0) return false;
            if (stats.wins > stats.gamesPlayed) return false;
            if (stats.bestStreak > stats.wins) return false;
            if (stats.currentStreak > stats.bestStreak + 1) return false;
            if (stats.bestTime && stats.bestTime < 5) return false;
            if (stats.totalPlayTime < 0) return false;
            
            if (stats.gamesPlayed > 0) {
                const avgTimePerGame = stats.totalPlayTime / stats.gamesPlayed;
                if (avgTimePerGame < 10) return false;
            }
            
            return true;
        },

        /**
         * Speichere Daten mit Checksumme
         */
        saveSecure(data) {
            const checksum = this.generateChecksum(data.stats);
            const payload = {
                ...data,
                _checksum: checksum,
                _timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(payload));
        },

        /**
         * Lade und validiere Daten
         */
        loadSecure() {
            try {
                const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (!raw) return null;
                
                const data = JSON.parse(raw);
                const expectedChecksum = this.generateChecksum(data.stats);
                
                if (data._checksum !== expectedChecksum) {
                    console.warn('Checksum mismatch - resetting stats');
                    return this.createFreshUser(data.username);
                }
                
                if (!this.validateStats(data.stats)) {
                    console.warn('Stats validation failed - resetting');
                    return this.createFreshUser(data.username);
                }
                
                return data;
            } catch (e) {
                console.error('Load error:', e);
                return null;
            }
        },

        /**
         * Erstelle einen neuen, sauberen User
         */
        createFreshUser(username = 'Spieler') {
            return {
                username: username,
                createdAt: Date.now(),
                stats: {
                    wins: 0,
                    gamesPlayed: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    bestTime: null,
                    totalPlayTime: 0,
                    totalStars: 0,
                    dailiesCompleted: 0,
                    lastDailyDate: null,
                    achievements: []
                }
            };
        }
    };

    // =========================================
    // GAME LOGIC
    // =========================================
    const Game = {
        init() {
            state.board = generateBalancedBoard();
            state.marked = new Set([12]);
            state.gameStartTime = Date.now();
            state.isGameActive = true;
            
            this.renderBoard();
            this.startTimer();
        },

        renderBoard() {
            const grid = document.getElementById('bingoGrid');
            grid.innerHTML = '';
            
            state.board.forEach((cell, index) => {
                const div = document.createElement('div');
                div.className = 'bingo-cell';
                div.dataset.index = index;
                div.textContent = cell.text;
                
                if (cell.isFreeSpace) {
                    div.classList.add('free-space', 'marked');
                } else if (state.marked.has(index)) {
                    div.classList.add('marked');
                }
                
                if (!cell.isFreeSpace) {
                    div.addEventListener('click', () => this.toggleCell(index));
                }
                
                grid.appendChild(div);
            });
        },

        toggleCell(index) {
            if (!state.isGameActive) return;
            
            const cell = document.querySelector(`[data-index="${index}"]`);
            
            if (state.marked.has(index)) {
                state.marked.delete(index);
                cell.classList.remove('marked');
            } else {
                state.marked.add(index);
                cell.classList.add('marked');
                
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }
            
            const winResult = this.checkWin();
            if (winResult) {
                this.handleWin(winResult);
            }
        },

        checkWin() {
            const marked = state.marked;
            
            for (let row = 0; row < 5; row++) {
                const indices = [0, 1, 2, 3, 4].map(col => row * 5 + col);
                if (indices.every(i => marked.has(i))) {
                    return { type: 'row', indices };
                }
            }
            
            for (let col = 0; col < 5; col++) {
                const indices = [0, 1, 2, 3, 4].map(row => row * 5 + col);
                if (indices.every(i => marked.has(i))) {
                    return { type: 'column', indices };
                }
            }
            
            const diag1 = [0, 6, 12, 18, 24];
            const diag2 = [4, 8, 12, 16, 20];
            
            if (diag1.every(i => marked.has(i))) {
                return { type: 'diagonal', indices: diag1 };
            }
            if (diag2.every(i => marked.has(i))) {
                return { type: 'diagonal', indices: diag2 };
            }
            
            return null;
        },

        handleWin(winResult) {
            state.isGameActive = false;
            this.stopTimer();
            
            winResult.indices.forEach(i => {
                const cell = document.querySelector(`[data-index="${i}"]`);
                cell.classList.add('winning');
            });
            
            const gameTimeSeconds = Math.floor((Date.now() - state.gameStartTime) / 1000);
            
            const user = state.user;
            user.stats.wins++;
            user.stats.gamesPlayed++;
            user.stats.currentStreak++;
            user.stats.totalPlayTime += gameTimeSeconds;
            
            if (user.stats.currentStreak > user.stats.bestStreak) {
                user.stats.bestStreak = user.stats.currentStreak;
            }
            
            if (!user.stats.bestTime || gameTimeSeconds < user.stats.bestTime) {
                user.stats.bestTime = gameTimeSeconds;
            }
            
            // Track daily history for weekly graph
            if (!user.stats.dailyHistory) {
                user.stats.dailyHistory = {};
            }
            const todayKey = new Date().toISOString().split('T')[0];
            user.stats.dailyHistory[todayKey] = (user.stats.dailyHistory[todayKey] || 0) + 1;
            
            // Clean up old history (keep only last 30 days)
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 30);
            const cutoffKey = cutoffDate.toISOString().split('T')[0];
            Object.keys(user.stats.dailyHistory).forEach(key => {
                if (key < cutoffKey) {
                    delete user.stats.dailyHistory[key];
                }
            });
            
            const gameData = {
                timeSeconds: gameTimeSeconds,
                markedCount: state.marked.size,
                winType: winResult.type,
                currentStreak: user.stats.currentStreak
            };
            
            const newAchievements = Achievements.checkAndUnlock(user.stats);
            const dailyCompleted = DailyChallenge.check(gameData, user);
            
            AntiCheat.saveSecure(user);
            state.user = user;
            
            Celebration.show(gameData, newAchievements, dailyCompleted);
            UI.updateStats();
        },

        startTimer() {
            this.stopTimer();
            state.gameTimerInterval = setInterval(() => {
                if (!state.gameStartTime) return;
                const seconds = Math.floor((Date.now() - state.gameStartTime) / 1000);
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                document.getElementById('statTime').textContent = 
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }, CONFIG.GAME_TIMER_INTERVAL);
        },

        stopTimer() {
            if (state.gameTimerInterval) {
                clearInterval(state.gameTimerInterval);
                state.gameTimerInterval = null;
            }
        },

        newGame() {
            if (state.isGameActive && state.user) {
                state.user.stats.gamesPlayed++;
                state.user.stats.currentStreak = 0;
                AntiCheat.saveSecure(state.user);
            }
            
            this.init();
            UI.updateStats();
        }
    };

    // =========================================
    // DAILY CHALLENGES
    // =========================================
    const DailyChallenge = {
        getCurrent() {
            return getTodaysChallenge();
        },

        check(gameData, user) {
            const today = new Date().toDateString();
            
            if (user.stats.lastDailyDate === today) {
                return false;
            }
            
            const challenge = this.getCurrent();
            if (challenge.check(gameData)) {
                user.stats.lastDailyDate = today;
                user.stats.dailiesCompleted++;
                user.stats.totalStars += challenge.reward;
                return challenge;
            }
            
            return false;
        },

        updateUI() {
            const challenge = this.getCurrent();
            document.getElementById('dailyChallengeText').textContent = challenge.description;
            
            const today = new Date().toDateString();
            const completed = state.user?.stats.lastDailyDate === today;
            
            const badge = document.getElementById('dailyBadge');
            badge.classList.toggle('hidden', completed);
            
            const progressBar = document.getElementById('dailyProgressBar');
            progressBar.style.width = completed ? '100%' : '0%';
        }
    };

    // =========================================
    // ACHIEVEMENTS
    // =========================================
    const Achievements = {
        checkAndUnlock(stats) {
            const newlyUnlocked = [];
            
            ACHIEVEMENTS.forEach(achievement => {
                if (!stats.achievements.includes(achievement.id)) {
                    if (achievement.check(stats)) {
                        stats.achievements.push(achievement.id);
                        stats.totalStars += achievement.reward;
                        newlyUnlocked.push(achievement);
                    }
                }
            });
            
            return newlyUnlocked;
        },

        render() {
            const grid = document.getElementById('achievementsGrid');
            grid.innerHTML = '';
            
            const unlockedIds = state.user?.stats.achievements || [];
            
            ACHIEVEMENTS.forEach(achievement => {
                const isUnlocked = unlockedIds.includes(achievement.id);
                
                const card = document.createElement('div');
                card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
                card.innerHTML = `
                    <div class="achievement-card-icon">${achievement.icon}</div>
                    <div class="achievement-card-content">
                        <div class="achievement-card-title">${achievement.title}</div>
                        <div class="achievement-card-desc">${achievement.description}</div>
                    </div>
                    <div class="achievement-card-reward">+${achievement.reward} 🌟</div>
                `;
                
                grid.appendChild(card);
            });
        }
    };

    // =========================================
    // CELEBRATION / WIN SCREEN
    // =========================================
    const Celebration = {
        show(gameData, newAchievements, dailyChallenge) {
            const overlay = document.getElementById('winOverlay');
            
            const mins = Math.floor(gameData.timeSeconds / 60);
            const secs = gameData.timeSeconds % 60;
            document.getElementById('winTime').textContent = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            document.getElementById('winStreak').textContent = gameData.currentStreak;
            document.getElementById('winTotal').textContent = state.user.stats.wins;
            
            const achievementEl = document.getElementById('winAchievement');
            if (newAchievements.length > 0) {
                const first = newAchievements[0];
                document.getElementById('achievementIcon').textContent = first.icon;
                document.getElementById('achievementText').textContent = first.title + ' freigeschaltet!';
                achievementEl.classList.remove('hidden');
            } else {
                achievementEl.classList.add('hidden');
            }
            
            const dailyEl = document.getElementById('winDaily');
            if (dailyChallenge) {
                dailyEl.classList.remove('hidden');
            } else {
                dailyEl.classList.add('hidden');
            }
            
            overlay.classList.remove('hidden');
            this.startConfetti();
            this.playWinSound();
            
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 200]);
            }
        },

        hide() {
            document.getElementById('winOverlay').classList.add('hidden');
            this.stopConfetti();
        },

        startConfetti() {
            const canvas = document.getElementById('confettiCanvas');
            const ctx = canvas.getContext('2d');
            
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            
            const colors = ['#ec1c24', '#ff6b6b', '#ffd93d', '#00d26a', '#6bcbff', '#a855f7'];
            const confetti = [];
            
            for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
                confetti.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight - window.innerHeight,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speedY: Math.random() * 3 + 2,
                    speedX: Math.random() * 2 - 1,
                    rotation: Math.random() * 360,
                    rotationSpeed: Math.random() * 10 - 5
                });
            }
            
            let animationId;
            
            const animate = () => {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                
                let stillVisible = false;
                
                confetti.forEach(p => {
                    p.y += p.speedY;
                    p.x += p.speedX;
                    p.rotation += p.rotationSpeed;
                    
                    if (p.y < window.innerHeight + 50) {
                        stillVisible = true;
                        
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation * Math.PI / 180);
                        ctx.fillStyle = p.color;
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                        ctx.restore();
                    }
                });
                
                if (stillVisible) {
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            animate();
            this._confettiAnimation = animationId;
        },

        stopConfetti() {
            if (this._confettiAnimation) {
                cancelAnimationFrame(this._confettiAnimation);
                this._confettiAnimation = null;
            }
            
            const canvas = document.getElementById('confettiCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        playWinSound() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523.25, 659.25, 783.99, 1046.50];
                
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    
                    const startTime = audioCtx.currentTime + i * 0.1;
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
                    gain.gain.linearRampToValueAtTime(0, startTime + 0.3);
                    
                    osc.start(startTime);
                    osc.stop(startTime + 0.3);
                });
            } catch (e) {}
        }
    };

    // =========================================
    // UI UPDATES
    // =========================================
    const UI = {
        updateStats() {
            if (!state.user) return;
            
            const stats = state.user.stats;
            
            document.getElementById('headerAvatar').textContent = 
                state.user.username.charAt(0).toUpperCase();
            document.getElementById('headerName').textContent = state.user.username;
            document.getElementById('headerStreak').textContent = `🔥 ${stats.currentStreak}`;
            
            document.getElementById('statWins').textContent = stats.wins;
            document.getElementById('statGames').textContent = stats.gamesPlayed;
            
            const winRate = stats.gamesPlayed > 0 
                ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
                : 0;
            document.getElementById('statRate').textContent = winRate + '%';
            
            DailyChallenge.updateUI();
        },

        showToast(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            
            const icons = { success: '✅', error: '❌', info: 'ℹ️' };
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type]}</span>
                <span class="toast-message">${message}</span>
            `;
            
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'toastSlide 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, CONFIG.TOAST_DURATION);
        }
    };

    // =========================================
    // SHARE FUNCTIONALITY
    // =========================================
    const Share = {
        shareBoard() {
            const text = `🚂 BAHN-BINGO\n\n` +
                `Ich spiele gerade Bahn-Bingo!\n` +
                `${state.marked.size - 1} von 24 Feldern markiert.\n\n` +
                `Spielst du mit? 🎮`;
            
            this.share(text);
        },

        shareWin() {
            const stats = state.user.stats;
            const text = `🏆 BINGO!\n\n` +
                `Ich habe bei Bahn-Bingo gewonnen!\n` +
                `🔥 Serie: ${stats.currentStreak}\n` +
                `⭐ Gesamt: ${stats.wins} Siege\n\n` +
                `#BahnBingo 🚂`;
            
            this.share(text);
        },

        share(text) {
            if (navigator.share) {
                navigator.share({
                    title: 'Bahn-Bingo',
                    text: text,
                    url: window.location.href
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(text + '\n' + window.location.href)
                    .then(() => UI.showToast('In Zwischenablage kopiert!', 'success'))
                    .catch(() => UI.showToast('Teilen fehlgeschlagen', 'error'));
            }
        }
    };

    // =========================================
    // INITIALIZATION
    // =========================================
    function init() {
        const savedUser = AntiCheat.loadSecure();
        
        if (savedUser) {
            state.user = savedUser;
            showMainApp();
        } else {
            showLoginScreen();
        }
        
        setupEventListeners();
        
        setTimeout(() => {
            document.getElementById('splashScreen').classList.add('fade-out');
        }, 1500);
    }

    function showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        
        setTimeout(() => {
            document.getElementById('usernameInput').focus();
        }, 600);
    }

    function showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        Game.init();
        UI.updateStats();
    }

    function handleLogin() {
        const input = document.getElementById('usernameInput');
        const username = input.value.trim();
        
        if (username.length < 2) {
            UI.showToast('Name muss mindestens 2 Zeichen haben', 'error');
            input.focus();
            return;
        }
        
        if (username.length > 15) {
            UI.showToast('Name darf maximal 15 Zeichen haben', 'error');
            input.focus();
            return;
        }
        
        state.user = AntiCheat.createFreshUser(username);
        AntiCheat.saveSecure(state.user);
        
        UI.showToast(`Willkommen, ${username}! 🚂`, 'success');
        showMainApp();
    }

    function setupEventListeners() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
        document.getElementById('usernameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        
        // Game buttons
        document.getElementById('newGameBtn').addEventListener('click', () => Game.newGame());
        document.getElementById('shareBtn').addEventListener('click', () => Share.shareBoard());
        
        // Win overlay
        document.getElementById('newRoundBtn').addEventListener('click', () => {
            Celebration.hide();
            Game.newGame();
        });
        
        document.getElementById('shareWinBtn').addEventListener('click', () => Share.shareWin());
        
        document.getElementById('winOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'winOverlay' || e.target.id === 'confettiCanvas') {
                Celebration.hide();
            }
        });
        
        // Achievements
        document.getElementById('achievementsBtn').addEventListener('click', () => {
            Achievements.render();
            document.getElementById('achievementsScreen').classList.remove('hidden');
        });
        
        document.getElementById('achievementsBackBtn').addEventListener('click', () => {
            document.getElementById('achievementsScreen').classList.add('hidden');
        });
        
        // Statistics back button
        document.getElementById('statsBackBtn').addEventListener('click', () => {
            Statistics.hide();
        });
        
        // Daily challenge button
        document.getElementById('dailyChallengeBtn').addEventListener('click', () => {
            const challenge = DailyChallenge.getCurrent();
            UI.showToast(`${challenge.icon} ${challenge.description}`, 'info');
        });
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const screen = item.dataset.screen;
                handleNavigation(screen);
                
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && state.isGameActive && state.user) {
                // User left mid-game
            }
        });
        
        // Prevent accidental back navigation
        window.addEventListener('beforeunload', (e) => {
            if (state.isGameActive && state.marked.size > 1) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    function handleNavigation(screen) {
        // Hide all overlay screens first
        document.getElementById('statsScreen').classList.add('hidden');
        
        switch (screen) {
            case 'game':
                break;
            case 'stats':
                Statistics.show();
                break;
            case 'leaderboard':
                UI.showToast('Rangliste kommt bald!', 'info');
                break;
            case 'profile':
                UI.showToast('Profil kommt bald!', 'info');
                break;
        }
    }

    // =========================================
    // STATISTICS MODULE
    // =========================================
    const Statistics = {
        show() {
            this.render();
            document.getElementById('statsScreen').classList.remove('hidden');
        },

        hide() {
            document.getElementById('statsScreen').classList.add('hidden');
        },

        render() {
            if (!state.user) return;
            
            const stats = state.user.stats;
            
            // Basic stats
            document.getElementById('statsWins').textContent = stats.wins;
            document.getElementById('statsPlayed').textContent = stats.gamesPlayed;
            
            // Win rate
            const winRate = stats.gamesPlayed > 0 
                ? Math.round((stats.wins / stats.gamesPlayed) * 100) 
                : 0;
            document.getElementById('statsWinrate').textContent = winRate + '%';
            
            // Animate win rate circle
            const circle = document.getElementById('winrateCircle');
            const circumference = 2 * Math.PI * 45; // r=45
            const offset = circumference - (winRate / 100) * circumference;
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 100);
            
            // Time stats
            if (stats.bestTime) {
                const mins = Math.floor(stats.bestTime / 60);
                const secs = stats.bestTime % 60;
                document.getElementById('statsBestTime').textContent = 
                    `${mins}:${secs.toString().padStart(2, '0')}`;
            } else {
                document.getElementById('statsBestTime').textContent = '--:--';
            }
            
            // Average time
            if (stats.gamesPlayed > 0 && stats.totalPlayTime > 0) {
                const avgSeconds = Math.round(stats.totalPlayTime / stats.gamesPlayed);
                const avgMins = Math.floor(avgSeconds / 60);
                const avgSecs = avgSeconds % 60;
                document.getElementById('statsAvgTime').textContent = 
                    `${avgMins}:${avgSecs.toString().padStart(2, '0')}`;
            } else {
                document.getElementById('statsAvgTime').textContent = '--:--';
            }
            
            // Total time
            const totalMins = Math.floor(stats.totalPlayTime / 60);
            if (totalMins >= 60) {
                const hours = Math.floor(totalMins / 60);
                const mins = totalMins % 60;
                document.getElementById('statsTotalTime').textContent = `${hours}h ${mins}m`;
            } else {
                document.getElementById('statsTotalTime').textContent = `${totalMins}m`;
            }
            
            // Streaks
            document.getElementById('statsCurrentStreak').textContent = stats.currentStreak;
            document.getElementById('statsBestStreak').textContent = stats.bestStreak;
            
            // Weekly graph
            this.renderWeeklyGraph();
            
            // Achievements progress
            const unlockedCount = stats.achievements ? stats.achievements.length : 0;
            const totalAchievements = ACHIEVEMENTS.length;
            document.getElementById('achievementsProgress').textContent = 
                `${unlockedCount} / ${totalAchievements}`;
            document.getElementById('achievementsFill').style.width = 
                `${(unlockedCount / totalAchievements) * 100}%`;
            
            // Stars and dailies
            document.getElementById('statsTotalStars').textContent = stats.totalStars || 0;
            document.getElementById('statsDailies').textContent = stats.dailiesCompleted || 0;
        },

        renderWeeklyGraph() {
            const stats = state.user.stats;
            const graphBars = document.getElementById('weeklyGraph');
            const graphLabels = document.getElementById('weeklyLabels');
            
            // Get or initialize daily history
            if (!stats.dailyHistory) {
                stats.dailyHistory = {};
            }
            
            const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            const today = new Date();
            const weekData = [];
            
            // Get last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateKey = date.toISOString().split('T')[0];
                const dayName = days[date.getDay()];
                const isToday = i === 0;
                
                weekData.push({
                    date: dateKey,
                    day: dayName,
                    wins: stats.dailyHistory[dateKey] || 0,
                    isToday: isToday
                });
            }
            
            // Find max for scaling
            const maxWins = Math.max(...weekData.map(d => d.wins), 1);
            
            // Render bars
            graphBars.innerHTML = weekData.map(d => {
                const height = (d.wins / maxWins) * 100;
                const classes = ['graph-bar'];
                if (d.isToday) classes.push('today');
                if (d.wins > 0) classes.push('has-wins');
                
                return `
                    <div class="${classes.join(' ')}" style="height: ${Math.max(height, 4)}%">
                        ${d.wins > 0 ? `<span class="graph-bar-value">${d.wins}</span>` : ''}
                    </div>
                `;
            }).join('');
            
            // Render labels
            graphLabels.innerHTML = weekData.map(d => `
                <span class="graph-label ${d.isToday ? 'today' : ''}">${d.day}</span>
            `).join('');
            
            // Weekly and today stats
            const todayKey = today.toISOString().split('T')[0];
            const todayWins = stats.dailyHistory[todayKey] || 0;
            const weekWins = weekData.reduce((sum, d) => sum + d.wins, 0);
            
            document.getElementById('statsWeekWins').textContent = weekWins;
            document.getElementById('statsTodayWins').textContent = todayWins;
        }
    };

    // =========================================
    // START APP
    // =========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
