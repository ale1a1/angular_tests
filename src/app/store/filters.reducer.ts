import { createReducer, on } from '@ngrx/store';
import { setTimePeriod } from './filters.actions';

// TODO [CONCEPT: NgRx Reducer]
// Reducers define HOW state changes in response to actions.
// State is immutable — we always return a NEW state object.
// createReducer() uses on() to listen for specific actions.
export interface FiltersState {
  timePeriod: string;
}

export const initialState: FiltersState = {
  timePeriod: '7d'
};

export const filtersReducer = createReducer(
  initialState,
  on(setTimePeriod, (state, { period }) => ({
    ...state,           // spread existing state (immutability)
    timePeriod: period   // update only what changed
  }))
);
