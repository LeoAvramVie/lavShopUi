import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {User, UsersService} from "@lav/users";
import {Subject, takeUntil} from "rxjs";

declare const require;

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  countries = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private usersService: UsersService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.endSubs$.complete();
    }

  ngOnInit(): void {
    this.getUsers();
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).pipe(takeUntil(this.endSubs$)).subscribe(
          () => {
            this.getUsers();
            this.messageService.add(
              {
                severity: 'success',
                summary: 'Success',
                detail: 'User successful deleted'
              });
          },
          (() => {
            this.messageService.add(
              {
                severity: 'error',
                summary: 'Error',
                detail: 'User is not deleted'
              }
            );
          }));
      }
    });
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`).then();
  }
  getCountryName(countryKey: string) {
    if (countryKey) return this.usersService.getCountry(countryKey);
  }

  private getUsers() {
    this.usersService.getUser().pipe(takeUntil(this.endSubs$)).subscribe(users => {
      this.users = users
    });
  }
}
