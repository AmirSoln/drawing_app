import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { RegisterRequest } from '../Dto/register-request';
import { map, take } from 'rxjs/operators';

@Injectable()
export class RegisterService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    'SignUpResponseOk': new Subject<any>(),
    'SignUpResponseInvalidCredentials': new Subject<any>()
  }
  constructor(private commService: CommService, private notifications: NotificationService) { }

  onSignUpResponseOk():Observable<any> {
    return this.responseSubjects.SignUpResponseOk.pipe(take(1))
  }

  onSignUpResponseInvalidCredentials():Observable<any> {
    return this.responseSubjects.SignUpResponseInvalidCredentials
  }
  onResponseError():Observable<any> {
    return new Subject<any>()
  }

  register(request: RegisterRequest): void {
    this.commService.register(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data)
        subject.complete()
      },
      error => this.notifications.showError(error, "Error")
    )
  }
}
