import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { UsersService, User } from '../../services/users.service';
import { selectTimePeriod } from '../../store/filters.selectors';
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
  loading = true;
  error = '';
  selectedPeriod = '7d';

  // TODO [CONCEPT: Subscription management]
  // When you subscribe manually, you MUST unsubscribe to prevent memory leaks.
  // We store the subscription and call unsubscribe() in ngOnDestroy.
  // Alternative: use the async pipe in the template (auto-unsubscribes).
  private usersSub!: Subscription;

  constructor(private usersService: UsersService, private store: Store) {} // DI

  // TODO [CONCEPT: Lifecycle Hook — ngOnInit]
  // Called once after component is created. Best place to fetch initial data.
  ngOnInit(): void {
    // Subscribe to time period changes and reload users whenever period changes
    this.usersSub = this.store.select(selectTimePeriod)
      .pipe(
        switchMap(period => {
          this.selectedPeriod = period;
          this.loading = true;
          // Fetch different number of users based on period for demo purposes
          const userCount = this.getUserCountByPeriod(period);
          return this.usersService.getUsers(userCount);
        })
      )
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users';
          this.loading = false;
          console.error(err);
        }
      });
  }

  // Helper method to return different number of users based on time period
  private getUserCountByPeriod(period: string): number {
    const countByPeriod: { [key: string]: number } = {
      '7d': 8,
      '30d': 15,
      '90d': 25,
    };
    return countByPeriod[period] || 8;
  }

  // TODO [CONCEPT: Dispatching NgRx Actions]
  // When user changes dropdown, dispatch action to update store
  onPeriodChange(event: Event): void {
    const period = (event.target as HTMLSelectElement).value;
    this.store.dispatch(setTimePeriod({ period }));
  }

  // TODO [CONCEPT: Lifecycle Hook — ngOnDestroy]
  // Called when component is removed from the DOM. Clean up here.
  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
