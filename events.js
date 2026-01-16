/**
 * BAHN-BINGO Events Database
 * Kategorisierte Ereignisse mit Gewichtung für ausgewogene Boards
 */

const BINGO_EVENTS = {
    // ===== VERSPÄTUNGEN =====
    verspaetung: {
        name: "Verspätungen",
        icon: "⏰",
        weight: 1.2, // Höhere Wahrscheinlichkeit
        events: [
            "Verspätung 5+ Min",
            "Verspätung 10+ Min",
            "Verspätung 15+ Min",
            "Verspätung 20+ Min",
            "Verspätung 30+ Min",
            "Verspätung 60+ Min",
            "Pünktliche Abfahrt",
            "Pünktliche Ankunft",
            "Aufgeholte Verspätung"
        ]
    },

    // ===== TECHNISCHE PROBLEME =====
    technik: {
        name: "Technik",
        icon: "🔧",
        weight: 1.0,
        events: [
            "Defekte Klimaanlage",
            "Klimaanlage zu kalt",
            "Klimaanlage zu heiß",
            "Defekte Heizung",
            "Defekte Tür",
            "Tür schließt nicht",
            "Tür öffnet nicht",
            "Defektes WC",
            "Kein Wasser im WC",
            "Verstopftes WC",
            "Kein WLAN",
            "Langsames WLAN",
            "Keine Steckdose",
            "Steckdose defekt",
            "Licht flackert",
            "Beleuchtung defekt",
            "Fenster klemmt",
            "Fenster undicht"
        ]
    },

    // ===== DURCHSAGEN =====
    durchsagen: {
        name: "Durchsagen",
        icon: "📢",
        weight: 1.1,
        events: [
            "Durchsage unverständlich",
            "Durchsage zu leise",
            "Durchsage zu laut",
            "Durchsage wiederholt 3x",
            "Keine Durchsage bei Halt",
            "Englische Durchsage",
            "Lokführer macht Witz",
            "Entschuldigung vom Lokführer",
            "Durchsage mitten im Schlaf"
        ]
    },

    // ===== MITREISENDE =====
    mitreisende: {
        name: "Mitreisende",
        icon: "👥",
        weight: 1.3,
        events: [
            "Lautes Telefonat",
            "Telefonat auf Lautsprecher",
            "Schreiende Kinder",
            "Weinendes Baby",
            "Laute Musik ohne Kopfhörer",
            "Essensgeruch",
            "Döner im Abteil",
            "Füße auf dem Sitz",
            "Ausgebreitete Taschen",
            "Betrunkene",
            "Laute Gruppe",
            "Fußballfans",
            "Schnarcher",
            "Jemand telefoniert im Ruhebereich"
        ]
    },

    // ===== SITZPLÄTZE =====
    sitzplaetze: {
        name: "Sitzplätze",
        icon: "💺",
        weight: 1.0,
        events: [
            "Kein freier Sitzplatz",
            "Reservierung nicht angezeigt",
            "Falscher Sitzplatz belegt",
            "Sitz defekt",
            "Sitz klebrig",
            "Tisch klebrig",
            "Müll am Platz",
            "Gegen Fahrtrichtung",
            "Reservierung für 1 Min",
            "Fensterplatz blockiert"
        ]
    },

    // ===== ZUG & WAGEN =====
    zugwagen: {
        name: "Zug & Wagen",
        icon: "🚃",
        weight: 1.0,
        events: [
            "Zugausfall",
            "Zug fährt durch",
            "Falscher Zugtyp",
            "Ersatzverkehr",
            "Zug überfüllt",
            "Fehlende Wagen",
            "Falsche Wagenreihung",
            "Kurzzug statt Langzug",
            "Erste Klasse überfüllt",
            "Speisewagen geschlossen",
            "Bistro ohne Kaffee",
            "Kein Bordrestaurant"
        ]
    },

    // ===== GLEISE & HALTE =====
    gleise: {
        name: "Gleise & Halte",
        icon: "🛤️",
        weight: 0.9,
        events: [
            "Gleisänderung",
            "Kurzfristige Gleisänderung",
            "Bahnsteig zu kurz",
            "Aufzug defekt",
            "Rolltreppe defekt",
            "Halt entfällt",
            "Außerplanmäßiger Halt",
            "Halt auf freier Strecke",
            "Türen öffnen nicht am Bahnsteig"
        ]
    },

    // ===== ANSCHLÜSSE =====
    anschluesse: {
        name: "Anschlüsse",
        icon: "🔄",
        weight: 1.1,
        events: [
            "Anschluss verpasst",
            "Anschluss wartet",
            "Rennen zum Anschluss",
            "Anschluss auf anderem Bahnhof",
            "Umstieg in 2 Min",
            "Anschluss fällt aus",
            "Kein Ersatzzug"
        ]
    },

    // ===== STÖRUNGEN =====
    stoerungen: {
        name: "Störungen",
        icon: "⚠️",
        weight: 0.8,
        events: [
            "Signalstörung",
            "Weichenstörung",
            "Streckensperrung",
            "Personen im Gleis",
            "Notarzteinsatz",
            "Polizeieinsatz",
            "Feuerwehreinsatz",
            "Unwetter",
            "Sturm",
            "Schnee auf Gleisen",
            "Laub auf Gleisen",
            "Tiere auf Gleisen"
        ]
    },

    // ===== PERSONAL =====
    personal: {
        name: "Personal",
        icon: "👮",
        weight: 0.7,
        events: [
            "Fahrkartenkontrolle",
            "Keine Kontrolle",
            "Freundlicher Schaffner",
            "Unfreundliches Personal",
            "Personal fehlt",
            "Reinigung während Fahrt"
        ]
    },

    // ===== KOMFORT =====
    komfort: {
        name: "Komfort",
        icon: "✨",
        weight: 0.6,
        events: [
            "Guter Kaffee im Bistro",
            "Ruhebereich wirklich ruhig",
            "Leerer Wagen",
            "Upgrade in 1. Klasse",
            "Netter Sitznachbar",
            "Schöne Aussicht"
        ]
    },

    // ===== APPS & TICKETS =====
    digital: {
        name: "Digital",
        icon: "📱",
        weight: 0.8,
        events: [
            "DB Navigator stürzt ab",
            "Ticket nicht ladbar",
            "QR-Code nicht scannbar",
            "Akku leer, kein Ticket",
            "WLAN Login funktioniert nicht",
            "Verspätungsalarm zu spät"
        ]
    },

    // ===== ABSURDES =====
    absurd: {
        name: "Absurdes",
        icon: "🤯",
        weight: 0.5,
        events: [
            "Zug verschwindet aus App",
            "Verspätung wegen Verspätung",
            "3 Gleisänderungen",
            "Lokführer verfahren",
            "Zug zu schnell",
            "Falsches Ziel angezeigt",
            "Zeitreise (Ankunft vor Abfahrt)"
        ]
    }
};

/**
 * Tägliche Challenges
 * Rotieren basierend auf dem Datum
 */
const DAILY_CHALLENGES = [
    {
        id: "speed_demon",
        title: "Schnellfahrer",
        description: "Gewinne in unter 5 Minuten",
        icon: "⚡",
        reward: 100,
        check: (gameData) => gameData.timeSeconds < 300
    },
    {
        id: "patient_player",
        title: "Geduldiger Pendler",
        description: "Gewinne in unter 10 Minuten",
        icon: "🧘",
        reward: 50,
        check: (gameData) => gameData.timeSeconds < 600
    },
    {
        id: "full_board",
        title: "Voll besetzt",
        description: "Markiere mindestens 15 Felder vor dem Sieg",
        icon: "📋",
        reward: 75,
        check: (gameData) => gameData.markedCount >= 15
    },
    {
        id: "diagonal_win",
        title: "Diagonal-Denker",
        description: "Gewinne mit einer Diagonale",
        icon: "↗️",
        reward: 60,
        check: (gameData) => gameData.winType === 'diagonal'
    },
    {
        id: "streak_3",
        title: "Hattrick",
        description: "Gewinne 3 Spiele in Folge",
        icon: "🎯",
        reward: 150,
        check: (gameData) => gameData.currentStreak >= 3
    },
    {
        id: "early_bird",
        title: "Frühaufsteher",
        description: "Spiele vor 8 Uhr morgens",
        icon: "🌅",
        reward: 40,
        check: () => new Date().getHours() < 8
    },
    {
        id: "night_owl",
        title: "Nachteule",
        description: "Spiele nach 22 Uhr",
        icon: "🦉",
        reward: 40,
        check: () => new Date().getHours() >= 22
    }
];

/**
 * Achievements / Erfolge
 * Permanente Errungenschaften
 */
const ACHIEVEMENTS = [
    {
        id: "first_win",
        title: "Erste Fahrt",
        description: "Gewinne dein erstes Spiel",
        icon: "🎉",
        reward: 25,
        check: (stats) => stats.wins >= 1
    },
    {
        id: "wins_5",
        title: "Stammgast",
        description: "Gewinne 5 Spiele",
        icon: "🎫",
        reward: 50,
        check: (stats) => stats.wins >= 5
    },
    {
        id: "wins_10",
        title: "Vielfahrer",
        description: "Gewinne 10 Spiele",
        icon: "🚃",
        reward: 100,
        check: (stats) => stats.wins >= 10
    },
    {
        id: "wins_25",
        title: "Pendler-Profi",
        description: "Gewinne 25 Spiele",
        icon: "🏅",
        reward: 200,
        check: (stats) => stats.wins >= 25
    },
    {
        id: "wins_50",
        title: "Bahn-Legende",
        description: "Gewinne 50 Spiele",
        icon: "🏆",
        reward: 500,
        check: (stats) => stats.wins >= 50
    },
    {
        id: "wins_100",
        title: "Eisenbahn-König",
        description: "Gewinne 100 Spiele",
        icon: "👑",
        reward: 1000,
        check: (stats) => stats.wins >= 100
    },
    {
        id: "streak_3",
        title: "Hattrick",
        description: "3 Siege in Folge",
        icon: "🔥",
        reward: 75,
        check: (stats) => stats.bestStreak >= 3
    },
    {
        id: "streak_5",
        title: "Siegesserie",
        description: "5 Siege in Folge",
        icon: "💪",
        reward: 150,
        check: (stats) => stats.bestStreak >= 5
    },
    {
        id: "streak_10",
        title: "Unaufhaltsam",
        description: "10 Siege in Folge",
        icon: "⚡",
        reward: 300,
        check: (stats) => stats.bestStreak >= 10
    },
    {
        id: "speed_3min",
        title: "Blitzfahrer",
        description: "Gewinne in unter 3 Minuten",
        icon: "🚀",
        reward: 100,
        check: (stats) => stats.bestTime && stats.bestTime < 180
    },
    {
        id: "speed_1min",
        title: "ICE-Tempo",
        description: "Gewinne in unter 1 Minute",
        icon: "💨",
        reward: 250,
        check: (stats) => stats.bestTime && stats.bestTime < 60
    },
    {
        id: "games_50",
        title: "Dauerfahrkarte",
        description: "Spiele 50 Runden",
        icon: "📅",
        reward: 100,
        check: (stats) => stats.gamesPlayed >= 50
    },
    {
        id: "games_100",
        title: "BahnCard 100",
        description: "Spiele 100 Runden",
        icon: "💳",
        reward: 250,
        check: (stats) => stats.gamesPlayed >= 100
    },
    {
        id: "winrate_60",
        title: "Überdurchschnittlich",
        description: "60% Gewinnrate (min. 10 Spiele)",
        icon: "📈",
        reward: 100,
        check: (stats) => stats.gamesPlayed >= 10 && (stats.wins / stats.gamesPlayed) >= 0.6
    },
    {
        id: "winrate_80",
        title: "Bingo-Meister",
        description: "80% Gewinnrate (min. 20 Spiele)",
        icon: "🎯",
        reward: 300,
        check: (stats) => stats.gamesPlayed >= 20 && (stats.wins / stats.gamesPlayed) >= 0.8
    },
    {
        id: "daily_7",
        title: "Wochenpendler",
        description: "Schließe 7 Daily Challenges ab",
        icon: "📆",
        reward: 200,
        check: (stats) => stats.dailiesCompleted >= 7
    },
    {
        id: "stars_500",
        title: "Sternensammler",
        description: "Sammle 500 Sterne",
        icon: "⭐",
        reward: 100,
        check: (stats) => stats.totalStars >= 500
    },
    {
        id: "stars_2000",
        title: "Sternenhimmel",
        description: "Sammle 2000 Sterne",
        icon: "🌟",
        reward: 250,
        check: (stats) => stats.totalStars >= 2000
    }
];

/**
 * Hilfsfunktion: Hole die tägliche Challenge basierend auf dem Datum
 */
function getTodaysChallenge() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

/**
 * Hilfsfunktion: Generiere ein zufälliges, ausgewogenes Board
 */
function generateBalancedBoard() {
    const categories = Object.keys(BINGO_EVENTS);
    const selectedEvents = [];
    const usedEvents = new Set();
    
    // Gewichtete Kategorie-Auswahl
    const weightedCategories = [];
    categories.forEach(cat => {
        const weight = BINGO_EVENTS[cat].weight || 1.0;
        // Füge Kategorie mehrfach hinzu basierend auf Gewicht
        for (let i = 0; i < Math.round(weight * 10); i++) {
            weightedCategories.push(cat);
        }
    });
    
    // Wähle 24 Events (+ 1 Free Space = 25)
    while (selectedEvents.length < 24) {
        // Zufällige gewichtete Kategorie
        const randomCat = weightedCategories[Math.floor(Math.random() * weightedCategories.length)];
        const events = BINGO_EVENTS[randomCat].events;
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        // Nur hinzufügen wenn noch nicht verwendet
        if (!usedEvents.has(randomEvent)) {
            selectedEvents.push({
                text: randomEvent,
                category: randomCat,
                icon: BINGO_EVENTS[randomCat].icon
            });
            usedEvents.add(randomEvent);
        }
    }
    
    // Shuffle (Fisher-Yates)
    for (let i = selectedEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedEvents[i], selectedEvents[j]] = [selectedEvents[j], selectedEvents[i]];
    }
    
    // Free Space in die Mitte (Index 12)
    selectedEvents.splice(12, 0, {
        text: "FREI",
        category: "free",
        icon: "⭐",
        isFreeSpace: true
    });
    
    return selectedEvents;
}

// Export für Module (falls später verwendet)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BINGO_EVENTS,
        DAILY_CHALLENGES,
        ACHIEVEMENTS,
        getTodaysChallenge,
        generateBalancedBoard
    };
}
