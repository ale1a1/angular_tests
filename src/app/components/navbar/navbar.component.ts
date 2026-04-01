import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// TODO [CONCEPT: @Input and @Output]
// @Input() = receive data FROM parent component (home -> navbar)
// @Output() = emit events TO parent component (child -> parent)
// This is how Angular components communicate.

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  // TODO [CONCEPT: @Input — parent passes data in via [user]="data"]
  @Input() user: { username: string; role: string } | null = null;

  // TODO [CONCEPT: @Output — child emits events to parent via EventEmitter]
  // Not used by parent here, but demonstrates the concept.
  @Output() menuClicked = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  onMenuClick(item: string): void {
    this.menuClicked.emit(item); // TODO: parent could listen with (menuClicked)="handler($event)"
  }
}
