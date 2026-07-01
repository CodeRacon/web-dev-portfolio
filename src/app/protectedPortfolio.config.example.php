<?php
return [
    'password' => 'replace-with-a-strong-password',
    'contentRoot' => __DIR__ . '/protected-portfolio-content',
    'projects' => [
        'web-app' => [
            'title' => 'Professional Experience — Project name after unlock',
            'summary' => 'Short unlocked project summary.',
            'details' => [
                'Additional implementation detail.',
            ],
            'note' => 'Optional display note.',
            'links' => [
                [
                    'label' => 'Live App',
                    'url' => 'https://example.com',
                ],
            ],
        ],
        'ynspool' => [
            'title' => 'YNSPOOL',
            'summary' => 'Short unlocked project summary.',
            'details' => [
                'Additional implementation detail.',
            ],
            'note' => '',
            'links' => [],
            'showcases' => [
                [
                    'id' => 'create-entry',
                    'title' => 'DashboardScreen',
                    'caption' => 'Entry point into the guided creation flow.',
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
                    'caption' => 'Prompt input, idea matching and configuration hand-off.',
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
                    'caption' => 'Server-safe filter normalization and applied state.',
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
                    'caption' => 'Step media handling and project hero image sync.',
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
