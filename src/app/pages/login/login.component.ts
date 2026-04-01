import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// TODO [CONCEPT: Component]
// A component = @Component decorator + class.
// selector: the HTML tag name to use this component
// standalone: true means no NgModule needed (modern Angular)
// imports: what this component needs (other modules/components)
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  // TODO [CONCEPT: Dependency Injection in components]
  // FormBuilder, Router, AuthService are all injected by Angular's DI
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // TODO [CONCEPT: Reactive Forms]
    // FormBuilder creates form controls with validators.
    // Validators.required = built-in validation.
    // Validators.minLength(3) = minimum length validation.
    // Reactive forms are defined in TS (not template) = more control & testability.
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // TODO [CONCEPT: Event Binding — called from template via (ngSubmit)]
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (this.authService.login(username, password)) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid credentials. Try admin/admin';
      }
    }
  }
}
