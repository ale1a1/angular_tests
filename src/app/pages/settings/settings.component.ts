import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// TODO [CONCEPT: Reactive Forms (Typed Forms)]
// ReactiveFormsModule provides FormBuilder, FormGroup, FormControl, Validators.
// This is the recommended approach over Template-driven forms.
// FormBuilder.group() creates a typed form with validation rules.

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // TODO [CONCEPT: FormGroup — collection of FormControls with shared state]
  // It tracks value, dirty, valid, errors, touched, pristine state.
  settingsForm!: FormGroup;

  submitted = false;
  successMessage = '';

  // TODO [CONCEPT: Dependency Injection]
  // FormBuilder is Angular's factory for creating reactive forms
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserSettings();
  }

  // TODO [CONCEPT: FormBuilder.group() — creates FormGroup with validation]
  // First param: field definitions { fieldName: [initialValue, validators] }
  // Validators.required, Validators.minLength, Validators.pattern, etc.
  private initializeForm(): void {
    this.settingsForm = this.formBuilder.group({
      displayName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      phone: ['', [
        Validators.pattern(/^[\d\-\+\s\(\)]+$|^$/) // Allow digits, +, -, (), spaces, or empty
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  // Load user data from localStorage into form
  private loadUserSettings(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.settingsForm.patchValue({
        displayName: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    }
  }

  // TODO [CONCEPT: Form Submission]
  // Check if form is valid before submitting
  // Mark form as submitted to show validation errors
  onSubmit(): void {
    this.submitted = true;

    // TODO [CONCEPT: FormGroup.valid — checks all validators]
    if (this.settingsForm.valid) {
      // TODO [CONCEPT: FormGroup.value — gets all form values]
      const formData = this.settingsForm.value;
      
      // Save to localStorage (in real app, would call API service)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...user,
        username: formData.displayName,
        email: formData.email,
        phone: formData.phone
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      this.successMessage = 'Settings updated successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

      // TODO [CONCEPT: FormGroup.reset() — clears form and marks pristine]
      this.settingsForm.markAsPristine();
      this.submitted = false;
    }
  }

  // TODO [CONCEPT: Form Control Access]
  // get() retrieves a FormControl by name for use in template
  get displayName() {
    return this.settingsForm.get('displayName');
  }

  get phone() {
    return this.settingsForm.get('phone');
  }

  get email() {
    return this.settingsForm.get('email');
  }

  // TODO [CONCEPT: Form State Helpers]
  // Common form properties to check in template
  isFormDirty(): boolean {
    return this.settingsForm.dirty;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.settingsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }
}
