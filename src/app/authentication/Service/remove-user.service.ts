import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { map, take } from 'rxjs/operators';
import { DeleteUserRequest } from '../Dto/delete-user-request';

@Injectable()
export class RemoveUserService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    'RemoveUserResponseOk': new Subject<any>(),
    'RemoveUserNoUserFoundResponse': new Subject<any>(),
    'AppResponseError': new Subject<any>()
  }

  constructor(private commService: CommService, private notification: NotificationService) { }

  onRemoveUserResponseOk(): Observable<any> {
    return this.responseSubjects.RemoveUserResponseOk.pipe(take(1))
  }

  onRemoveUserNoUserFoundResponse(): Observable<any> {
    return this.responseSubjects.RemoveUserNoUserFoundResponse
  }

  onRemoveAppResponseError(): Observable<any> {
    return this.responseSubjects.AppResponseError
  }

  removeUser(request: DeleteUserRequest): void {
    this.commService.removeUser(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) =>
        subject.next(data),
      error => this.notification.showError(error, "Error"),
    )
  }
}
