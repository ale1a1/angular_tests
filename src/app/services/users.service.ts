import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// TODO [CONCEPT: HttpClient & Observables]
// HttpClient is Angular's built-in module for making HTTP requests.
// It returns Observables (from RxJS) — you subscribe to get the data.
// Observable = lazy stream of data. Nothing happens until you subscribe.

export interface User {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {

  // TODO [CONCEPT: Dependency Injection]
  // HttpClient is injected here by Angular's DI system
  constructor(private http: HttpClient) {}

  // TODO [CONCEPT: HTTP GET + RxJS pipe/map]
  // We call a real public API (randomuser.me) and transform the response
  // pipe() chains RxJS operators. map() transforms the data.
  getUsers(count: number = 10): Observable<User[]> {
    return this.http
      .get<any>(`https://randomuser.me/api/?results=${count}`)
      .pipe(
        map(response =>
          response.results.map((u: any) => ({
            name: `${u.name.first} ${u.name.last}`,
            email: u.email,
            phone: u.phone,
            nationality: u.nat,
            picture: u.picture.thumbnail
          }))
        )
      );
  }
}
