import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersService, User } from '../../services/users.service';
import { of, throwError } from 'rxjs';
import { provideStore } from '@ngrx/store';
import { filtersReducer } from '../../store/filters.reducer';

/**
 * Mock of UsersService — replaces the real HTTP service with a Jest spy
 * so we can control what getUsers() returns in each test.
 */
const mockUsersService = {
  getUsers: jest.fn(),
};

/** Fake user data returned by the mock service. */
const MOCK_USERS: User[] = [
  { name: 'John Doe', email: 'john@test.com', phone: '123', nationality: 'US', picture: 'pic.jpg' },
  { name: 'Jane Smith', email: 'jane@test.com', phone: '456', nationality: 'UK', picture: 'pic2.jpg' },
];

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  /**
   * beforeEach — runs before every single test.
   * 1. Resets the mock so previous test calls don't leak into the next test.
   * 2. Sets the default mock return value to a successful response (of(MOCK_USERS)).
   * 3. Configures TestBed with:
   *    - UsersComponent as a standalone import
   *    - The mock UsersService instead of the real one
   *    - An NgRx store with the filtersReducer (component injects Store)
   * 4. Creates the component instance but does NOT call detectChanges()
   *    so each test can set up its own scenario first.
   */
  beforeEach(async () => {
    mockUsersService.getUsers.mockReset();
    mockUsersService.getUsers.mockReturnValue(of(MOCK_USERS));

    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        provideStore({ filters: filtersReducer }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  /**
   * TEST 1 — Smoke test
   * Simply checks the component was created without errors.
   * If this fails, the TestBed setup itself is broken.
   */
  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * TEST 2 — Happy path: users load on init
   * detectChanges() triggers ngOnInit(), which calls loadUsers().
   * We verify:
   *  - getUsers was called with 8 (default count for '7d' period)
   *  - component.users is populated with MOCK_USERS
   *  - loading flag is set back to false after the response
   */
  test('should load users on init', () => {
    fixture.detectChanges();

    expect(mockUsersService.getUsers).toHaveBeenCalledWith(8);
    expect(component.users).toEqual(MOCK_USERS);
    expect(component.loading).toBe(false);
  });

  /**
   * TEST 3 — Error path: API failure
   * Overrides the mock to return an observable error before triggering init.
   * We spy on console.error to silence the expected log from the component.
   * We verify:
   *  - component.error is set to the user-friendly message
   *  - loading is false (spinner should stop)
   *  - users stays empty (no stale data)
   */
  test('should handle API error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUsersService.getUsers.mockReturnValue(throwError(() => new Error('API down')));

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load users');
    expect(component.loading).toBe(false);
    expect(component.users).toEqual([]);
    consoleSpy.mockRestore();
  });

  /**
   * TEST 4 — Cleanup: unsubscribe on destroy
   * After init, we spy on the subscription's unsubscribe method,
   * then manually call ngOnDestroy().
   * We verify unsubscribe was called — this prevents memory leaks
   * from lingering HTTP subscriptions when the component is removed.
   */
  test('should unsubscribe on destroy to prevent memory leaks', () => {
    fixture.detectChanges();

    const spy = jest.spyOn(component['usersSub']!, 'unsubscribe');
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
