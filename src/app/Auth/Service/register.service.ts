import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { RegisterRequest } from '../Dto/register-request';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    SignUpResponseOk: new Subject<any>(),
    SignUpResponseInvalidCredentials: new Subject<any>()
  }
  constructor(private commService: CommService, private notifications: NotificationService) { }

  get SignUpResponseOk() {
    return this.responseSubjects.SignUpResponseOk
  }

  get SignUpResponseInvalidCredentials() {
    return this.responseSubjects.SignUpResponseInvalidCredentials
  }
  get onResponseError() {
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
