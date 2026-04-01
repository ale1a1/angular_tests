import { createAction, props } from '@ngrx/store';

// TODO [CONCEPT: NgRx Actions]
// Actions describe WHAT happened. They are dispatched from components.
// createAction() creates a typed action with optional payload (props).
export const setTimePeriod = createAction(
  '[Filters] Set Time Period',
  props<{ period: string }>()
);
