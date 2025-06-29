import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  constructor(private router: Router) {}

  // Methode, die Vorschläge für die Autovervollständigung liefert
  getAutoCompletePrompt(input: string): string {
    if (!input.trim()) return '';

    // Teile den Eingabetext in Wörter auf
    const parts = input.split(' ');
    const lastWord = parts[parts.length - 1].toLowerCase();

    // Wenn wir den ersten Befehl eingeben
    if (parts.length === 1) {
      const matchingCommands = this.commands.filter(
        (cmd) => cmd.startsWith(lastWord) && cmd !== lastWord
      );

      if (matchingCommands.length > 0) {
        // Gib den vollständigen Befehl zurück
        return matchingCommands[0];
      }
    }

    // Projektnamenvervollständigung für 'project' Befehl
    if (parts.length === 2 && parts[0].toLowerCase() === 'project') {
      const projectNameInput = parts[1].toLowerCase();
      const projectNames = Object.keys(this.projects);

      const matchingProjects = projectNames.filter(
        (name) => name.startsWith(projectNameInput) && name !== projectNameInput
      );

      if (matchingProjects.length > 0) {
        // Kombiniere 'project' mit dem passenden Projektnamen
        return `project ${matchingProjects[0]}`;
      }
    }

    // Seitenvervollständigung für 'goto' Befehl
    if (parts.length === 2 && parts[0].toLowerCase() === 'goto') {
      const pageInput = parts[1].toLowerCase();
      const pages = ['home', 'projects', 'contact'];

      const matchingPages = pages.filter(
        (page) => page.startsWith(pageInput) && page !== pageInput
      );

      if (matchingPages.length > 0) {
        // Kombiniere 'goto' mit der passenden Seite
        return `goto ${matchingPages[0]}`;
      }
    }

    return '';
  }

  // Aktualisierte Liste der verfügbaren Commands
  private commands: string[] = [
    'help',
    'about',
    'skills',
    'projects',
    'project',
    'contact',
    'github',
    'linkedin',
    'clear',
    'exit',
  ];

  // Aktualisierte Help-Methode
  private getHelp(): string {
    return `
Available commands:
  help            - Show this help message
  about           - About me
  skills          - My technical skills
  projects        - List all projects
  project [name]  - Show details about a specific project
  contact         - My contact information
  github          - Open my GitHub profile
  linkedin        - Open my LinkedIn profile
  clear           - Clear the terminal
  exit            - Close the terminal
`;
  }

  // Aktualisierte processCommand-Methode
  processCommand(input: string): string {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        return this.getHelp();
      case 'about':
        return this.getAbout();
      case 'skills':
        return this.getSkills();
      case 'projects':
        return this.getProjects();
      case 'project':
        return this.getProjectDetails(args[0]);
      case 'contact':
        return this.getContact();
      case 'github':
        window.open('https://github.com/CodeRacon', '_blank');
        return 'Opening GitHub profile in a new tab...';
      case 'linkedin':
        window.open(
          'https://www.linkedin.com/in/michael-buschmann-front-end-dev/',
          '_blank'
        );
        return 'Opening LinkedIn profile in a new tab...';

      case 'clear':
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('terminal-clear'));
        }, 10);
        return '';
      case 'exit':
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('terminal-exit'));
        }, 100);
        return 'Closing terminal...';
      default:
        return `Command not found: ${command}. Type 'help' to see available commands.`;
    }
  }

  private getAbout(): string {
    return `
<span class="command-highlight">
┌─────────────────────────────────────────────────────────────┐
│                        ABOUT ME                             │
└─────────────────────────────────────────────────────────────┘
</span>
Hi there! I'm a Front-End developer based in Dresden, Germany.

I combine a detail-oriented approach with a passion for interactive web design.
My background in design principles gives me the foundation to create 
exceptional user interfaces, while my coding expertise allows me to implement 
them with precision.

What drives me is creating user experiences that are:
• Unique and memorable
• Highly accessible
• Built to last

I love collaborating with creative minds to turn concepts into functional, 
beautiful web applications.

Type 'skills' to explore my technical stack or 'projects' to see my work in action.
`;
  }

  private getSkills(): string {
    return `
<span class="command-highlight">    
┌─────────────────────────────────────────────────────────────┐
│                     TECHNICAL SKILLS                        │
└─────────────────────────────────────────────────────────────┘
</span>

FRONTEND DEVELOPMENT:
• Angular | TypeScript | VUE.js
• HTML5 | CSS3 | SCSS
• JavaScript (ES6+)
• Responsive Design
• Design Framework Integration (Material Design, Bootstrap)

UI/UX IMPLEMENTATION:
• Figma Design Implementation
• Component-Based Architecture
• Accessibility Standards
• Cross-Browser Compatibility

DATA & INTEGRATION:
• REST API Integration
• Google Firebase
• State Management
• External Service Integration

TOOLS & PRACTICES:
• Git & GitHub Version Control
• Agile Development (SCRUM, Kanban)
• Team Collaboration
• AI-Assisted Development (Anthropic, Sourcegraph)

Type 'projects' to see these skills in action or 'contact' to get in touch.
`;
  }

  private getProjects(): string {
    return `
<span class="command-highlight">
┌─────────────────────────────────────────────────────────────┐
│                        PROJECTS                             │
└─────────────────────────────────────────────────────────────┘
</span>

Here are some of my key projects:

1. <span class="command-highlight">MyBubble</span>
   Full-featured messenger app with channels, chats, profiles, and more
   Tech: Angular, TypeScript, Firebase
   Type 'project mybubble' for details

2. <span class="command-highlight">Join</span>
   Kanban-based project management tool for team collaboration
   Tech: JavaScript, Firebase, HTML, CSS
   Type 'project join' for details

3. <span class="command-highlight">M7 Dashboard</span>
   Data visualization dashboard for the world's 7 largest tech companies
   Tech: REST API, VUE.JS, JavaScript, SCSS
   Type 'project m7dashboard' for details

4. <span class="command-highlight">CavernQuest</span>
   2D jump'n run browser game with an adventurous cave exploration theme
   Tech: JavaScript OOP, Firebase, HTML, CSS
   Type 'project cavernquest' for details

5. <span class="command-highlight">PokeDex</span>
   PokeAPI-powered database for all your Pokemon information needs
   Tech: REST API, JavaScript, HTML, CSS
   Type 'project pokedex' for details

Type <span class="command-highlight">project [name]</span> to get more details about a specific project.
`;
  }

  private projects: {
    [key: string]: {
      title: string;
      description: string;
      tech: string[];
      links: { name: string; url: string }[];
    };
  } = {
    mybubble: {
      title: 'MyBubble',
      description: `A full-featured messenger application with a comprehensive range of communication functions.
    
Features include:
• Multiple messaging channels for different topics
• Private and group chat functionality
• User profiles with customization options
• Real-time notifications
• Advanced search capabilities
• Firebase-powered backend for reliable data storage`,
      tech: [
        'Angular',
        'TypeScript',
        'Firebase',
        'Real-time Database',
        'Authentication',
      ],
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/MyBubble' },
        { name: 'Live Demo', url: 'https://bubble.michael-buschmann.dev/' },
      ],
    },

    join: {
      title: 'Join',
      description: `A Kanban-based project management tool designed to enhance workflow and collaboration within teams.
    
Features include:
• Task board with drag-and-drop functionality
• Task categorization and priority settings
• Team member assignment
• Due date tracking
• Progress visualization
• Firebase backend for multi-user collaboration`,
      tech: ['JavaScript', 'Firebase', 'HTML', 'CSS', 'Drag-and-Drop API'],
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/join' },
        { name: 'Live Demo', url: 'https://join.michael-buschmann.dev/' },
      ],
    },

    m7dashboard: {
      title: 'M7 - Dashboard',
      description: `An API-based dashboard that visualizes various financial metrics of the world's 7 largest tech companies, known as the Magnificent Seven.
    
Features include:
• Interactive data charts and graphs
• Real-time financial data via API
• Comparative analysis between companies
• Responsive design for all device sizes
• VUE.JS powered dynamic components`,
      tech: ['REST API', 'JavaScript', 'VUE.JS', 'HTML', 'SCSS', 'Chart.js'],
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/MagSeven' },
        { name: 'Live Demo', url: 'https://m7.michael-buschmann.dev/' },
      ],
    },

    cavernquest: {
      title: 'CavernQuest',
      description: `A 2D jump'n run browser game where players help the character Woozle navigate through a mysterious and dangerous mossy cavern.
    
Features include:
• Engaging platformer gameplay mechanics
• Multiple levels with increasing difficulty
• Collectible items and power-ups
• Enemy AI and collision detection
• Score tracking with Firebase integration
• Object-oriented programming architecture`,
      tech: [
        'JavaScript',
        'Object-Oriented Programming',
        'Firebase',
        'HTML',
        'CSS',
        'Canvas API',
      ],
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/CavernQuest' },
        {
          name: 'Live Demo',
          url: 'https://cavernquest.michael-buschmann.dev/',
        },
      ],
    },

    pokedex: {
      title: 'PokeDex',
      description: `A comprehensive Pokemon database powered by the PokeAPI that provides detailed information about Pokemon characters.
    
Features include:
• Complete Pokemon listings with search functionality
• Detailed Pokemon statistics and attributes
• Type classification and evolution chains
• Responsive card-based design
• Dynamic data loading from PokeAPI`,
      tech: [
        'REST API',
        'JavaScript',
        'HTML',
        'CSS',
        'Async/Await',
        'Fetch API',
      ],
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/PokeDex' },
        { name: 'Live Demo', url: 'https://pokedex.michael-buschmann.dev/' },
      ],
    },
  };

  private getProjectDetails(projectName: string): string {
    if (!projectName) {
      return `Please specify a project name. Type 'projects' to see all available projects.`;
    }

    const project = this.projects[projectName.toLowerCase()];

    if (!project) {
      return `Project '${projectName}' not found. Type 'projects' to see all available projects.`;
    }

    let output = `
<span class="command-highlight">
┌─────────────────────────────────────────────────────────────┐
│ PROJECT: ${project.title.padEnd(50)} │
└─────────────────────────────────────────────────────────────┘
</span>
${project.description}

TECHNOLOGIES:
${project.tech.map((t) => '• ' + t).join('\n')}

LINKS:`;

    project.links.forEach((link) => {
      output += `\n• ${link.name}: ${link.url}`;
    });

    output += `\n\nType 'projects' to see all projects or 'github' to visit my GitHub profile.`;

    return output;
  }

  // Contact Command
  private getContact(): string {
    return `
<span class="command-highlight">
┌─────────────────────────────────────────────────────────────┐
│                        CONTACT                              │
└─────────────────────────────────────────────────────────────┘
</span>

I'm always open to new opportunities and collaborations.
Feel free to reach out through any of these channels:

• Email: hey@michael-buschmann.dev
• LinkedIn: linkedin.com/in/michael-buschmann-front-end-dev
• GitHub: github.com/CodeRacon

You can also use the contact form on this website to send me a message directly.

Type 'linkedin' to visit my LinkedIn profile or 'github' to check out my code.
`;
  }
}
