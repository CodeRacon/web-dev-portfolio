<?php

return [
    'password' => 'replace-with-your-real-password',

    /*
     * Preferred:
     * Place protected files outside public_html and point contentRoot there.
     *
     * Example:
     * 'contentRoot' => '/home/u123456789/protected-portfolio-content',
     *
     * Fallback:
     * Keep protected-portfolio-content next to the PHP files in public_html
     * and block direct access via .htaccess.
     */
    'contentRoot' => __DIR__ . '/protected-portfolio-content',

    'projects' => [
        'web-app' => [
            'title' => 'HateAid Buddy',
            'summary' => 'Mitarbeit an HateAid Buddy, einer Web-App zur Unterstuetzung von Menschen, die von digitaler Gewalt und Online-Hass betroffen sind.',
            'details' => [
                'Umsetzung eines Webseiten-Frontends auf Basis eines vorgegebenen Designs mit React und TypeScript.',
                'Erstellen saemtlicher Primitive Components und darauf aufbauend komplexerer Bausteine.',
                'Entwicklung statischer Webseiteninhalte sowie eines mehrstufigen Wizards zum Finden der passenden Unterstuetzung.',
                'Implementierung des State Managements innerhalb des mehrstufigen Unterstuetzungsprozesses.',
                'Anbindung des Frontends an das bestehende Backend und Abstimmung zu API-Design, Schnittstellenanforderungen und Datenuebergabe.',
            ],
            'note' => 'Aus vertraglichen Gruenden werden zu diesem Projekt keine Screenshots oder Code-Snippets gezeigt.',
            'translations' => [
                'de' => [
                    'summary' => 'Mitarbeit an HateAid Buddy, einer Web-App zur Unterstuetzung von Menschen, die von digitaler Gewalt und Online-Hass betroffen sind.',
                    'details' => [
                        'Umsetzung eines Webseiten-Frontends auf Basis eines vorgegebenen Designs mit React und TypeScript.',
                        'Erstellen saemtlicher Primitive Components und darauf aufbauend komplexerer Bausteine.',
                        'Entwicklung statischer Webseiteninhalte sowie eines mehrstufigen Wizards zum Finden der passenden Unterstuetzung.',
                        'Implementierung des State Managements innerhalb des mehrstufigen Unterstuetzungsprozesses.',
                        'Anbindung des Frontends an das bestehende Backend und Abstimmung zu API-Design, Schnittstellenanforderungen und Datenuebergabe.',
                    ],
                    'note' => 'Aus vertraglichen Gruenden werden zu diesem Projekt keine Screenshots oder Code-Snippets gezeigt.',
                ],
                'en' => [
                    'summary' => 'Worked on HateAid Buddy, a web app supporting people affected by digital violence and online hate.',
                    'details' => [
                        'Implemented a website frontend based on a provided design with React and TypeScript.',
                        'Created all primitive components and more complex building blocks based on them.',
                        'Developed static website content and a multi-step wizard for finding suitable support.',
                        'Implemented state management within the multi-step support process.',
                        'Connected the frontend to the existing backend and coordinated API design, interface requirements and data handover.',
                    ],
                    'note' => 'Due to contractual constraints, no screenshots or code snippets are shown for this project.',
                ],
            ],
            'links' => [
                [
                    'label' => 'buddy.hateaid.org',
                    'url' => 'https://buddy.hateaid.org/de',
                ],
            ],
            'showcases' => [],
        ],
        'ynspool' => [
            'title' => 'YNSPOOL',
            'summary' => 'Mitarbeit an YNSPOOL, einer iOS-App fuer DIY-Projekte mit einem mehrstufigen Flow fuer Content-Creation, AI-Unterstuetzung und Schritt-fuer-Schritt-Anleitungen.',
            'details' => [
                'Erweiterung einer bestehenden App um einen Flow zur Erstellung von Anleitungen mit React Native und TypeScript.',
                'Umsetzung manueller und AI-gestuetzter Erstellungspfade innerhalb des Create-Flows.',
                'Anbindung des Frontends an das bestehende Backend und Abstimmung zu API-Design, Schnittstellenanforderungen und Datenuebergabe.',
                'Zusammenarbeit mit Designern sowie Diskussion und Bewertung von Designentscheidungen waehrend der laufenden Produktentwicklung.',
            ],
            'translations' => [
                'de' => [
                    'summary' => 'Mitarbeit an YNSPOOL, einer iOS-App fuer DIY-Projekte mit einem mehrstufigen Flow fuer Content-Creation, AI-Unterstuetzung und Schritt-fuer-Schritt-Anleitungen.',
                    'details' => [
                        'Erweiterung einer bestehenden App um einen Flow zur Erstellung von Anleitungen mit React Native und TypeScript.',
                        'Umsetzung manueller und AI-gestuetzter Erstellungspfade innerhalb des Create-Flows.',
                        'Anbindung des Frontends an das bestehende Backend und Abstimmung zu API-Design, Schnittstellenanforderungen und Datenuebergabe.',
                        'Zusammenarbeit mit Designern sowie Diskussion und Bewertung von Designentscheidungen waehrend der laufenden Produktentwicklung.',
                    ],
                ],
                'en' => [
                    'summary' => 'Worked on YNSPOOL, an iOS app for DIY projects with a multi-step content creation flow, AI support and step-by-step instructions.',
                    'details' => [
                        'Extended an existing app with a flow for creating instructions using React Native and TypeScript.',
                        'Implemented manual and AI-assisted creation paths within the create flow.',
                        'Connected the frontend to the existing backend and coordinated API design, interface requirements and data handover.',
                        'Collaborated with designers and evaluated design decisions during ongoing product development.',
                    ],
                ],
            ],
            'links' => [],
            'showcases' => [
                [
                    'id' => 'create-entry',
                    'title' => 'DashboardScreen',
                    'caption' => 'Drei unterschiedliche Einstiege in den Erstellungsprozess mit eigener Flow-Logik.',
                    'screenshot' => [
                        'file' => 'ynspool/screens/create-flow-dashboard.jpg',
                        'alt' => 'YNSPOOL create something new screen',
                    ],
                    'snippet' => [
                        'file' => 'ynspool/snippets/01-dashboard-flow.tsx',
                        'language' => 'tsx',
                        'sourceLabel' => 'DashboardScreen.tsx',
                    ],
                ],
                [
                    'id' => 'own-idea',
                    'title' => 'OwnIdea',
                    'caption' => 'Prompt-Eingabe, Vorschlagsabgleich und Uebergabe in den Generate-Flow.',
                    'screenshot' => [
                        'file' => 'ynspool/screens/create-flow-step1.jpg',
                        'alt' => 'YNSPOOL own idea prompt screen',
                    ],
                    'snippet' => [
                        'file' => 'ynspool/snippets/02-own-idea-prompt.tsx',
                        'language' => 'tsx',
                        'sourceLabel' => 'OwnIdea.tsx',
                    ],
                ],
                [
                    'id' => 'configuration-sheet',
                    'title' => 'ConfigurationSheet',
                    'caption' => 'Filter, Kostenpraeferenz und server-sichere Auswahl-Normalisierung.',
                    'screenshot' => [
                        'file' => 'ynspool/screens/create-flow-step1-config.jpg',
                        'alt' => 'YNSPOOL configuration sheet screen',
                    ],
                    'snippet' => [
                        'file' => 'ynspool/snippets/03-configuration-sheet.tsx',
                        'language' => 'tsx',
                        'sourceLabel' => 'ConfigurationSheet.tsx',
                    ],
                ],
                [
                    'id' => 'instruction-editor',
                    'title' => 'Step2Screen',
                    'caption' => 'Verwaltung von Step-Medien und Synchronisierung des Hero-Visuals.',
                    'screenshot' => [
                        'file' => 'ynspool/screens/create-flow-step2.jpg',
                        'alt' => 'YNSPOOL instruction editor screen',
                    ],
                    'snippet' => [
                        'file' => 'ynspool/snippets/04-instruction-media-sync.tsx',
                        'language' => 'tsx',
                        'sourceLabel' => 'Step2Screen.tsx',
                    ],
                ],
            ],
        ],
    ],
];
