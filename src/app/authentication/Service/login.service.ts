import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { map, take } from 'rxjs/operators';
import { LoginRequest } from '../Dto/login-request';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable({ providedIn: 'root' })
export class LoginService extends ServiceBase {
  userEmail: string

  constructor(private commService: CommService) {
    super('SignInResponseOK', 'SignInResponseInvalidUserNameOrEmail');
  }

  onSignInResponseOK(): Observable<any> {
    return this.responseSubjects.SignInResponseOK.pipe(take(1))
  }

  onSignInResponseInvalidUserNameOrEmail(): Observable<any> {
    return this.responseSubjects.SignInResponseInvalidUserNameOrEmail
  }

  login(request: LoginRequest): void {
    let subFunc = ([data, subject]) => {
      if (subject == this.responseSubjects.SignInResponseOK) {
        this.userEmail = data["request"].loginDto["email"]
      }
      subject.next(data)
    }

    this.executeObservable({
      observable: this.commService.login(request),
      subscriptionFunc: subFunc
    })

    // this.commService.login(request).pipe(
    //   map(data => [data, this.responseSubjects[data.responseType]])
    // ).subscribe(
    //   ([data, subject]) => {
    //     if (subject == this.responseSubjects.SignInResponseOK) {
    //       this.userEmail = data["request"].loginDto["email"]
    //     }
    //     subject.next(data)
    //   },
    //   error => {
    //     this.notification.showError("Something went wrong! Try again later", "Error")
    //     console.log(error)
    //   }
    // )
  }

  getLoggedInUser(): string {
    return this.userEmail
  }

  logOut() {
    this.userEmail = null
  }
}