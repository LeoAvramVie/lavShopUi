import {Injectable} from '@angular/core';
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import * as countriesLib from 'i18n-iso-countries';
import {UsersFacade} from "../state/users.facade";

declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrlUsers = environment.apiUrl + 'users';

  constructor(private httpClient: HttpClient,
              private usersFacade: UsersFacade) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
  }

  getUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrlUsers)
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrlUsers, user)
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrlUsers}/${user.id}`, user)
  }

  deleteUser(userID: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.apiUrlUsers}/${userID}`)
  }

  getUserById(userID: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrlUsers}/${userID}`)
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en');
  }

  initAppSession(){
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser(){
    return this.usersFacade.currentUser$;
  }

  isCurrentUserAuth(){
    return this.usersFacade.isAuth$;
  }
}
