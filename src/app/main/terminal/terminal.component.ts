import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalService } from '../../shared/common/terminal.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminalOutput') terminalOutput!: ElementRef;
  @ViewChild('commandInput') commandInput!: ElementRef;
  @Output() closeTerminal = new EventEmitter<void>();

  commandHistory: string[] = [];
  historyIndex: number = -1;
  commandValue: string = '';
  autoCompletePrompt: string = '';
  outputLines: { content: string; isCommand?: boolean }[] = [];
  private clearTerminalBound: any;
  private exitTerminalBound: any;

  constructor(private terminalService: TerminalService) {}

  ngOnInit(): void {
    // Initial welcome message
    this.outputLines.push({
      content: `
 _________________
|# :           : #|
|  : PORTFOLIO :  |
|  :           :  |
|  :    CLI    :  |
|  :___________:  |
|     _________   |
|    | __      |  |
|    ||  |     |  |
 \\___||__|_____|__|
  
Hey there, I'm Micha! Welcome to my interactive Portfolio Terminal. 

To explore my portfolio the classic way, type <span class="command-highlight">help</span> to see all available commands.

You can go back into your command history with the <span class="command-highlight">UP/DOWN</span> arrows.
You can also accept a suggestion by simply pressing the <span class="command-highlight">TAB</span> key.
**************************************************
`,
    });

    // Event listener für clear-Command
    this.clearTerminalBound = this.clearTerminal.bind(this);
    document.addEventListener('terminal-clear', this.clearTerminalBound);

    // Event listener für exit-Command
    this.exitTerminalBound = this.exitTerminal.bind(this);
    document.addEventListener('terminal-exit', this.exitTerminalBound);

    // Fokus auf Eingabefeld setzen
    setTimeout(() => this.focusInput(), 100);
  }

  ngOnDestroy(): void {
    // Event-Listener entfernen
    document.removeEventListener('terminal-clear', this.clearTerminalBound);
    document.removeEventListener('terminal-exit', this.exitTerminalBound);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Tab-Taste abfangen und Autovervollständigung durchführen
    if (event.key === 'Tab' && this.autoCompletePrompt) {
      event.preventDefault();
      this.commandValue = this.autoCompletePrompt;
      this.autoCompletePrompt = '';
      setTimeout(() => this.focusInput(), 0);
    }
  }

  handleCommand(event: KeyboardEvent): void {
    // Handle UP and DOWN keys for command history
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(1);
    } else if (event.key === 'Enter') {
      const command = this.commandValue.trim();

      if (command) {
        // Add command to history
        this.commandHistory.unshift(command);
        this.historyIndex = -1;

        // Display command
        this.outputLines.push({
          content: command,
          isCommand: true,
        });

        // Process command and display result
        const result = this.terminalService.processCommand(command);
        this.outputLines.push({
          content: result,
        });

        // Reset autoCompletePrompt
        this.autoCompletePrompt = '';

        // Scroll to bottom
        setTimeout(() => {
          if (this.terminalOutput) {
            this.terminalOutput.nativeElement.scrollTop =
              this.terminalOutput.nativeElement.scrollHeight;
          }
        });

        // Clear input
        this.commandValue = '';
      }
    } else {
      // Update autoCompletePrompt bei jeder Eingabe
      // Wir brauchen ein setTimeout, damit Angular die aktuelle Eingabe erst verarbeiten kann
      setTimeout(() => {
        this.updateAutoCompletePrompt();
      }, 0);
    }
  }

  updateAutoCompletePrompt(): void {
    // Hole den Autovervollständigungsvorschlag vom Service
    this.autoCompletePrompt = this.terminalService.getAutoCompletePrompt(
      this.commandValue
    );
  }

  navigateHistory(direction: number): void {
    if (this.commandHistory.length === 0) return;

    this.historyIndex = Math.max(
      -1,
      Math.min(this.historyIndex + direction, this.commandHistory.length - 1)
    );

    if (this.historyIndex >= 0) {
      this.commandValue = this.commandHistory[this.historyIndex];
      this.autoCompletePrompt = '';
    } else {
      this.commandValue = '';
      this.updateAutoCompletePrompt();
    }
  }

  clearTerminal(): void {
    this.outputLines = [];
  }

  exitTerminal(): void {
    // Emit closeTerminal event to parent component
    this.closeTerminal.emit();
  }

  focusInput(): void {
    if (this.commandInput) {
      this.commandInput.nativeElement.focus();
    }
  }
}
