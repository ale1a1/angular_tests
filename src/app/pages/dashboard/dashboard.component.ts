import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { setTimePeriod } from '../../store/filters.actions';
import { selectTimePeriod } from '../../store/filters.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // TODO [CONCEPT: NgRx Store — reading state with selectors]
  // store.select() returns an Observable of the selected state slice.
  // We use the $ suffix convention for Observables.
  timePeriod$!: Observable<string>;

  selectedPeriod = '7d';

  // Reactive stats that update based on selected period
  stats: Array<{ label: string; value: string | number }> = [];

  // TODO [CONCEPT: Injecting NgRx Store via DI]
  constructor(private store: Store) {}

  ngOnInit(): void {
    // TODO [CONCEPT: Using selectors to reactively update stats]
    // Select the time period from store and map it to stats
    // Use the async pipe to automatically handle subscriptions
    this.timePeriod$ = this.store.select(selectTimePeriod);
    
    // Subscribe to period changes and update stats
    // Selector will emit the current store value immediately on subscribe
    this.timePeriod$.subscribe(period => {
      this.selectedPeriod = period;
      this.stats = this.getStatsByPeriod(period);
    });
  }

  // Helper method to return different stats based on time period
  private getStatsByPeriod(period: string): Array<{ label: string; value: string | number }> {
    const statsByPeriod: { [key: string]: Array<{ label: string; value: string | number }> } = {
      '7d': [
        { label: 'Total Users', value: 1240 },
        { label: 'Active Today', value: 312 },
        { label: 'New This Year', value: 5640 },
        { label: 'Revenue', value: '$12,400' },
      ],
      '30d': [
        { label: 'Total Users', value: 3150 },
        { label: 'Active Today', value: 312 },
        { label: 'New This Year', value: 5640 },
        { label: 'Revenue', value: '$48,600' },
      ],
      '90d': [
        { label: 'Total Users', value: 8420 },
        { label: 'Active Today', value: 312 },
        { label: 'New This Year', value: 5640 },
        { label: 'Revenue', value: '$127,850' },
      ],
      '1y': [
        { label: 'Total Users', value: 24500 },
        { label: 'Active Today', value: 312 },
        { label: 'New This Year', value: 5640 },
        { label: 'Revenue', value: '$482,300' },
      ],
    };

    return statsByPeriod[period] || statsByPeriod['7d'];
  }

  // TODO [CONCEPT: Dispatching NgRx Actions]
  // When user changes dropdown, dispatch an action to update the store.
  // The subscription in ngOnInit will react to the store change automatically.
  onPeriodChange(event: Event): void {
    const period = (event.target as HTMLSelectElement).value;
    this.store.dispatch(setTimePeriod({ period }));
  }
}
