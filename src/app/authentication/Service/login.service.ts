import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { map, take } from 'rxjs/operators';
import { LoginRequest } from '../Dto/login-request';

@Injectable({providedIn:'root'})
export class LoginService {
  userEmail: string

  responseSubjects: { [responseID: string]: Subject<any> } = {
    'SignInResponseOK': new Subject<any>(),
    'SignInResponseInvalidUserNameOrEmail': new Subject<any>()
  }

  constructor(private commService: CommService, private notification: NotificationService) { }

  onSignInResponseOK(): Observable<any> {
    return this.responseSubjects.SignInResponseOK.pipe(take(1))
  }

  onSignInResponseInvalidUserNameOrEmail(): Observable<any> {
    return this.responseSubjects.SignInResponseInvalidUserNameOrEmail
  }

  onResponseError(): Observable<any> {
    return new Subject<any>().pipe(take(1))
  }

  login(request: LoginRequest): void {
    this.commService.login(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        if (subject == this.responseSubjects.SignInResponseOK) {
          this.userEmail = data["request"].loginDto["email"]
        }
        subject.next(data)
      },
      error => this.notification.showError(error, "Error")
    )
  }

  getLoggedInUser(): string {
    return this.userEmail
  }
}