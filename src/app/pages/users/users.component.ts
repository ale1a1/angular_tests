import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { UsersService, User } from '../../services/users.service';
import { setTimePeriod } from '../../store/filters.actions';
import { selectTimePeriod } from '../../store/filters.selectors';

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

  // Pagination
  currentPage = 1;
  pageSize = 10;

  private usersSub?: Subscription;

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  constructor(
    private usersService: UsersService, 
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Read the persisted time period from the store, then load users
    this.store.select(selectTimePeriod).pipe(take(1)).subscribe(period => {
      this.selectedPeriod = period;
      this.loadUsers(period);
    });
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
    return { '7d': 8, '30d': 15, '90d': 25, '1y': 50 }[period] || 8;
  }

  onPeriodChange(event: Event): void {
    const period = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadUsers(period);
    this.store.dispatch(setTimePeriod({ period }));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
