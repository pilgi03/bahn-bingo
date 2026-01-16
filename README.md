# 🚂 Bahn-Bingo v2

Das ultimative Bingo-Spiel für deutsche Bahnpendler - jetzt mit Anti-Cheat, Daily Challenges und Achievements!

## 🆕 Was ist neu in v2?

### 1. **Saubere Code-Struktur**
```
bahn-bingo/
├── index.html      # Nur HTML-Struktur (~200 Zeilen)
├── styles.css      # Alle Styles (~700 Zeilen)
├── app.js          # Hauptlogik (~500 Zeilen)
├── events.js       # Event-Pool & Achievements (~350 Zeilen)
├── sw.js           # Service Worker für Offline
├── manifest.json   # PWA-Konfiguration
└── README.md
```

### 2. **Anti-Cheat System**
- **Checksummen**: Stats werden mit einem Hash gespeichert
- **Plausibilitätsprüfung**: 
  - Siege können nicht > Spiele sein
  - Bestzeit kann nicht < 5 Sekunden sein
  - Durchschnittszeit muss realistisch sein
- **Automatischer Reset** bei Manipulation

### 3. **Echter Service Worker**
- Vollständige Offline-Funktionalität
- Cache-First Strategie für schnelles Laden
- Hintergrund-Updates

### 4. **GPU-optimierte Animationen**
- `will-change` für animierte Elemente
- `transform: translateZ(0)` für GPU-Layer
- Canvas-basiertes Confetti (kein DOM-Thrashing)
- `requestAnimationFrame` für smooth 60fps

### 5. **Gamification**
- **Daily Challenges**: Täglich wechselnde Aufgaben
- **19 Achievements**: Von "Erste Fahrt" bis "Eisenbahn-König"
- **Sterne-System**: Sammle Belohnungen
- **Streak-Tracking**: Siegesserien werden belohnt

## 🎮 Features

### Events
- **100+ Bahn-Situationen** in 12 Kategorien
- Gewichtete Verteilung für ausgewogene Boards
- Von "Verspätung 5+ Min" bis "Zeitreise (Ankunft vor Abfahrt)"

### Gameplay
- 5x5 Bingo-Board mit Free Space
- Zeitmessung pro Spiel
- Automatische Sieg-Erkennung (Reihen, Spalten, Diagonalen)
- Haptic Feedback auf unterstützten Geräten

### Social
- Share-Funktion (Native Share API oder Clipboard)
- Exportierbare Siege für Social Media

## 🛠️ Technische Details

### Anti-Cheat Implementation
```javascript
// Checksumme generieren
generateChecksum(data) {
    const str = JSON.stringify(data) + SALT;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Plausibilität prüfen
validateStats(stats) {
    if (stats.wins > stats.gamesPlayed) return false;
    if (stats.bestTime < 5) return false; // Unmöglich
    // ... weitere Checks
}
```

### Performance-Optimierungen
1. **CSS `will-change`**: Nur auf animierte Elemente
2. **Event Delegation**: Wo möglich
3. **DOM-Batching**: Minimale Reflows
4. **Lazy Loading**: Achievements nur bei Bedarf rendern

## 📱 PWA Features

- Installierbar als App
- Funktioniert komplett offline
- Push-Notifications (vorbereitet für Multiplayer)
- Splash Screen

## 🚀 Deployment

### GitHub Pages
```bash
# Repository erstellen
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/bahn-bingo.git
git push -u origin main

# In Repository Settings → Pages → Source: main branch
```

### Lokales Testen
```bash
# Einfacher HTTP Server (Python)
python -m http.server 8000

# Oder mit Node
npx serve
```

## 🔮 Geplante Features

- [ ] Multiplayer mit WebSockets
- [ ] Server-Side Leaderboard
- [ ] Tägliche/Wöchentliche Ranglisten
- [ ] Customizable Boards
- [ ] Freunde-System

## 📄 Lizenz

MIT - Mach damit was du willst!

---

**Made with ❤️ and 🚂 delays**
