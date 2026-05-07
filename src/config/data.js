export const galaxies = [
  {
    id: 'hackathon',
    position: [-3, -6, -8],
    color: 0x22c55e,
    name: { en: 'Hackathon', fr: 'Hackathon', it: 'Hackathon' },
    description: {
      en: 'Projects born from hackathons and intensive challenges',
      fr: 'Projets nés de hackathons et challenges intensifs',
      it: 'Progetti nati da hackathon e sfide intensive'
    },
    worlds: [
      {
        id: 'greenmap',
        type: 'ocean',
        name: { en: 'Green Map', fr: 'Green Map', it: 'Green Map' },
        description: {
          en: 'Interactive web app combining Leaflet & Flask to visualize environmental data and calculate pedestrian green routes in Marseille.',
          fr: 'Application web interactive combinant Leaflet & Flask pour visualiser des données environnementales et calculer des itinéraires piétons verts à Marseille.',
          it: 'App web interattiva che combina Leaflet & Flask per visualizzare dati ambientali e calcolare percorsi pedonali verdi a Marsiglia.'
        },
        tech: ['JavaScript', 'Python', 'Flask', 'Leaflet.js', 'OSMnx'],
        github: 'https://github.com/Emanuelee00/Projects-Hack',
        demo: null,
        color: 0x4ade80,
        orbitRadius: 3.5, orbitSpeed: 0.20, orbitOffset: 0
      },
      {
        id: 'qista-hack',
        type: 'lava',
        name: { en: 'Qista — Mosquito Risk', fr: 'Qista — Risque Moustiques', it: 'Qista — Rischio Zanzare' },
        description: {
          en: 'Mosquito risk prediction platform using weather data and environmental factors. Three-service architecture: Leaflet map, Express gateway, FastAPI predictor.',
          fr: 'Plateforme de prédiction du risque moustiques basée sur la météo et les facteurs environnementaux. Architecture trois services : carte Leaflet, passerelle Express, moteur FastAPI.',
          it: 'Piattaforma di predizione del rischio zanzare basata su dati meteo e fattori ambientali. Architettura a tre servizi: mappa Leaflet, gateway Express, motore FastAPI.'
        },
        tech: ['Python', 'FastAPI', 'Node.js', 'Leaflet.js', 'Docker'],
        github: 'https://github.com/taobenaouda199/qista-1',
        demo: null,
        color: 0xf97316,
        orbitRadius: 5.2, orbitSpeed: 0.14, orbitOffset: Math.PI
      },
      {
        id: 'knowledge-graph',
        type: 'nebular',
        name: { en: 'Knowledge Graph Explorer', fr: 'Knowledge Graph Explorer', it: 'Knowledge Graph Explorer' },
        description: {
          en: 'Web app for semantic exploration using Google Knowledge Graph and Wikidata. Interactive D3.js graph visualization and URL semantic audit with SEO coverage scoring.',
          fr: 'Application web d\'exploration sémantique via Google Knowledge Graph et Wikidata. Visualisation interactive D3.js et audit sémantique d\'URL avec score de couverture SEO.',
          it: 'App web per l\'esplorazione semantica tramite Google Knowledge Graph e Wikidata. Visualizzazione interattiva D3.js e audit semantico di URL con score di copertura SEO.'
        },
        tech: ['Python', 'Next.js', 'TypeScript', 'D3.js', 'Tailwind CSS'],
        github: 'https://github.com/Emanuelee00/kKowledgeGraphVisualizer',
        demo: null,
        color: 0xa78bfa,
        orbitRadius: 7.2, orbitSpeed: 0.09, orbitOffset: Math.PI * 1.5
      }
    ]
  },
  {
    id: 'trading',
    position: [5, -7, -11],
    color: 0xfbbf24,
    name: { en: 'Trading', fr: 'Trading', it: 'Trading' },
    description: {
      en: 'Algorithmic trading systems and financial strategies',
      fr: 'Systèmes de trading algorithmique et stratégies financières',
      it: 'Sistemi di trading algoritmico e strategie finanziarie'
    },
    worlds: [
      {
        id: 'gold-trading',
        type: 'desert',
        name: { en: 'Gold MA Cross', fr: 'Gold MA Cross', it: 'Gold MA Cross' },
        description: {
          en: 'Algorithmic trading system for gold using moving average crossover strategies, with backtesting engine and parameter optimization.',
          fr: 'Système de trading algorithmique sur l\'or basé sur le croisement de moyennes mobiles, avec moteur de backtesting et optimisation des paramètres.',
          it: 'Sistema di trading algoritmico sull\'oro con strategie di crossover tra medie mobili, motore di backtesting e ottimizzazione dei parametri.'
        },
        tech: ['Python', 'Pandas', 'NumPy', 'Backtesting'],
        github: 'https://github.com/Emanuelee00/Gold_project_moving_avg/tree/main/gold_project_moving_avg_cross',
        demo: null,
        color: 0xfbbf24,
        orbitRadius: 3.5, orbitSpeed: 0.18, orbitOffset: 0
      },
      {
        id: 'etf-portfolio',
        type: 'nebular',
        name: { en: 'ETF Portfolio Analytics', fr: 'ETF Portfolio Analytics', it: 'ETF Portfolio Analytics' },
        description: {
          en: 'Multi-asset portfolio analytics engine: ISIN→ticker mapping, Yahoo Finance data, performance & risk metrics, Monte Carlo optimization (Max Sharpe / Min Vol) and multi-horizon stability analysis with automated Excel reporting.',
          fr: 'Moteur d\'analyse de portefeuille multi-actifs : mapping ISIN→ticker, données Yahoo Finance, métriques de performance & risque, optimisation Monte Carlo (Max Sharpe / Min Vol) et analyse de stabilité multi-horizons avec rapport Excel automatisé.',
          it: 'Motore di analisi di portafoglio multi-asset: mapping ISIN→ticker, dati Yahoo Finance, metriche di performance e rischio, ottimizzazione Monte Carlo (Max Sharpe / Min Vol) e analisi di stabilità multi-orizzonte con report Excel automatizzato.'
        },
        tech: ['Python', 'Pandas', 'NumPy', 'yfinance', 'SciPy', 'openpyxl'],
        github: 'https://github.com/Emanuelee00/Project_ETF',
        demo: null,
        color: 0x38bdf8,
        orbitRadius: 5.5, orbitSpeed: 0.12, orbitOffset: Math.PI * 0.7
      }
    ]
  },
  {
    id: 'c42',
    position: [-9, 2, -4],
    color: 0x60a5fa,
    name: { en: 'C', fr: 'C', it: 'C' },
    description: {
      en: 'Low-level C programming projects — École 42',
      fr: 'Projets de programmation C bas niveau — École 42',
      it: 'Progetti di programmazione C a basso livello — Scuola 42'
    },
    worlds: [
      {
        id: 'libft',
        type: 'rocky',
        name: { en: 'Libft', fr: 'Libft', it: 'Libft' },
        description: {
          en: 'Custom reimplementation of the C standard library (libc) from scratch. Source code reserved — École 42 project.',
          fr: 'Réimplémentation personnalisée de la bibliothèque standard C (libc) depuis zéro. Code source réservé — projet École 42.',
          it: 'Reimplementazione personalizzata della libreria standard C (libc) da zero. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['C', 'Makefile'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0x93c5fd,
        orbitRadius: 3.0, orbitSpeed: 0.25, orbitOffset: 0
      },
      {
        id: 'ft-printf',
        type: 'ice',
        name: { en: 'ft_printf', fr: 'ft_printf', it: 'ft_printf' },
        description: {
          en: 'Variadic printf() function reimplemented from scratch in C, supporting multiple format specifiers. Source code reserved — École 42 project.',
          fr: 'Fonction printf() variadique réimplémentée en C, supportant plusieurs spécificateurs de format. Code source réservé — projet École 42.',
          it: 'Funzione printf() variadica reimplementata in C, con supporto per vari specificatori di formato. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['C', 'Makefile'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0x7dd3fc,
        orbitRadius: 4.8, orbitSpeed: 0.17, orbitOffset: Math.PI * 0.8
      },
      {
        id: 'get-next-line',
        type: 'desert',
        name: { en: 'get_next_line', fr: 'get_next_line', it: 'get_next_line' },
        description: {
          en: 'Reads a text file line by line using a single file descriptor in C, with static buffer management. Source code reserved — École 42 project.',
          fr: 'Lecture ligne par ligne d\'un fichier via un descripteur unique en C, avec gestion de buffer statique. Code source réservé — projet École 42.',
          it: 'Lettura riga per riga di un file tramite file descriptor in C, con gestione del buffer statico. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['C', 'Makefile'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0x60a5fa,
        orbitRadius: 6.4, orbitSpeed: 0.11, orbitOffset: Math.PI * 1.5
      }
    ]
  },
  {
    id: 'python42',
    position: [9, -1.5, -5],
    color: 0xf59e0b,
    name: { en: 'Python', fr: 'Python', it: 'Python' },
    description: {
      en: 'Python scripting and data projects — École 42',
      fr: 'Projets Python et données — École 42',
      it: 'Progetti Python e dati — Scuola 42'
    },
    worlds: [
      {
        id: 'py-data',
        type: 'gas',
        name: { en: 'Data & Statistics', fr: 'Données & Statistiques', it: 'Dati & Statistiche' },
        description: {
          en: 'Data analysis and statistical processing project in Python. Source code reserved — École 42 project.',
          fr: 'Projet d\'analyse de données et traitement statistique en Python. Code source réservé — projet École 42.',
          it: 'Progetto di analisi dati ed elaborazione statistica in Python. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['Python', 'NumPy', 'Pandas', 'Matplotlib'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0xfcd34d,
        orbitRadius: 3.2, orbitSpeed: 0.22, orbitOffset: 0
      },
      {
        id: 'py-ml',
        type: 'lava',
        name: { en: 'Machine Learning', fr: 'Machine Learning', it: 'Machine Learning' },
        description: {
          en: 'Machine learning model training and evaluation project. Source code reserved — École 42 project.',
          fr: 'Projet d\'entraînement et d\'évaluation de modèles de machine learning. Code source réservé — projet École 42.',
          it: 'Progetto di addestramento e valutazione di modelli di machine learning. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['Python', 'scikit-learn', 'NumPy', 'Matplotlib'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0xf59e0b,
        orbitRadius: 5.0, orbitSpeed: 0.14, orbitOffset: Math.PI
      },
      {
        id: 'py-algo',
        type: 'ocean',
        name: { en: 'Algorithms', fr: 'Algorithmes', it: 'Algoritmi' },
        description: {
          en: 'Algorithm design and optimization project in Python. Source code reserved — École 42 project.',
          fr: 'Projet de conception et d\'optimisation d\'algorithmes en Python. Code source réservé — projet École 42.',
          it: 'Progetto di progettazione e ottimizzazione di algoritmi in Python. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['Python'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0xd97706,
        orbitRadius: 6.8, orbitSpeed: 0.09, orbitOffset: Math.PI * 0.6
      }
    ]
  },
  {
    id: 'sysnet42',
    position: [1, 5, -13],
    color: 0x34d399,
    name: { en: 'System & Networks', fr: 'Système & Réseaux', it: 'Sistema & Reti' },
    description: {
      en: 'Systems administration and networking projects — École 42',
      fr: 'Projets d\'administration système et réseau — École 42',
      it: 'Progetti di amministrazione di sistema e reti — Scuola 42'
    },
    worlds: [
      {
        id: 'born2beroot',
        type: 'rocky',
        name: { en: 'Born2BeRoot', fr: 'Born2BeRoot', it: 'Born2BeRoot' },
        description: {
          en: 'Virtual machine setup and server hardening with Debian/Rocky Linux: partitioning, SSH, firewall, sudo policies. Source code reserved — École 42 project.',
          fr: 'Configuration de machine virtuelle et durcissement serveur sous Debian/Rocky Linux : partitionnement, SSH, pare-feu, politiques sudo. Code source réservé — projet École 42.',
          it: 'Configurazione di macchina virtuale e hardening del server con Debian/Rocky Linux: partitioning, SSH, firewall, policy sudo. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['Linux', 'Bash', 'VirtualBox', 'Debian'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0x6ee7b7,
        orbitRadius: 3.3, orbitSpeed: 0.24, orbitOffset: 0
      },
      {
        id: 'net-practice',
        type: 'ocean',
        name: { en: 'NetPractice', fr: 'NetPractice', it: 'NetPractice' },
        description: {
          en: 'Network configuration and subnetting exercises: IP addressing, routing tables, TCP/IP protocols. Source code reserved — École 42 project.',
          fr: 'Exercices de configuration réseau et sous-réseaux : adressage IP, tables de routage, protocoles TCP/IP. Code source réservé — projet École 42.',
          it: 'Esercizi di configurazione di rete e subnetting: indirizzamento IP, tabelle di routing, protocolli TCP/IP. Codice sorgente riservato — progetto Scuola 42.'
        },
        tech: ['TCP/IP', 'Networking', 'Routing'],
        github: 'https://github.com/Emanuelee00',
        demo: null,
        color: 0x34d399,
        orbitRadius: 5.1, orbitSpeed: 0.15, orbitOffset: Math.PI * 1.2
      },
      // {
      //   id: 'ft-irc',
      //   type: 'nebular',
      //   name: { en: 'ft_irc', fr: 'ft_irc', it: 'ft_irc' },
      //   description: {
      //     en: 'IRC server implemented in C++ following RFC 1459: socket programming, multi-client handling, channel management. Source code reserved — École 42 project.',
      //     fr: 'Serveur IRC implémenté en C++ selon RFC 1459 : programmation socket, gestion multi-clients, gestion de canaux. Code source réservé — projet École 42.',
      //     it: 'Server IRC implementato in C++ secondo RFC 1459: programmazione socket, gestione multi-client, gestione canali. Codice sorgente riservato — progetto Scuola 42.'
      //   },
      //   tech: ['C++', 'Sockets', 'TCP/IP', 'Makefile'],
      //   github: 'https://github.com/Emanuelee00',
      //   demo: null,
      //   color: 0x2dd4bf,
      //   orbitRadius: 7.0, orbitSpeed: 0.09, orbitOffset: Math.PI * 0.4
      // }
    ]
  }
];
