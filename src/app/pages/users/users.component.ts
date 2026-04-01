import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UsersService, User } from '../../services/users.service';
import { setTimePeriod } from '../../store/filters.actions';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: User[] = [];
  loading = false;
  error = '';
  selectedPeriod = '7d';

  private usersSub?: Subscription;

  constructor(
    private usersService: UsersService, 
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load initial data immediately
    this.loadUsers(this.selectedPeriod);
  }

  private loadUsers(period: string): void {
    this.loading = true;
    this.error = '';
    
    const userCount = this.getUserCountByPeriod(period);
    this.usersSub = this.usersService.getUsers(userCount).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.cdr.markForCheck(); // Trigger change detection
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        this.cdr.markForCheck(); // Trigger change detection
        console.error(err);
      }
    });
  }

  private getUserCountByPeriod(period: string): number {
    return { '7d': 8, '30d': 15, '90d': 25 }[period] || 8;
  }

  onPeriodChange(event: Event): void {
    const period = (event.target as HTMLSelectElement).value;
    this.loadUsers(period);
    this.store.dispatch(setTimePeriod({ period }));
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
