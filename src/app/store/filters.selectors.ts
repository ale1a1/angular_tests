import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FiltersState } from './filters.reducer';

// TODO [CONCEPT: NgRx Selectors]
// Selectors are pure functions that extract slices of state from the store.
// createFeatureSelector() grabs a top-level state slice.
// createSelector() composes selectors and is memoized (cached for performance).
export const selectFilters = createFeatureSelector<FiltersState>('filters');

export const selectTimePeriod = createSelector(
  selectFilters,
  (state) => state.timePeriod
);
