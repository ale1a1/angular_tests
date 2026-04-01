import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // TODO [CONCEPT: Lifecycle Hook — ngOnInit]
  // ngOnInit() runs once after the component is created.
  // Use it to initialize data, fetch from APIs, etc.
  // Don't use the constructor for heavy logic — use ngOnInit instead.

  user: { username: string; role: string } | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log('HomeComponent initialized — user:', this.user);
  }
}
