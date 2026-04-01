import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// TODO [CONCEPT: Root Component]
// This is the entry point of the app. It just holds <router-outlet>
// which renders whatever route matches the current URL.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class App {}
