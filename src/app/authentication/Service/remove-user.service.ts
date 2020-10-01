import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { map, take } from 'rxjs/operators';
import { DeleteUserRequest } from '../Dto/delete-user-request';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable()
export class RemoveUserService extends ServiceBase {

  constructor(private commService: CommService, private notification: NotificationService) {
    super('RemoveUserResponseOk','RemoveUserNoUserFoundResponse');
  }

  onRemoveUserResponseOk(): Observable<any> {
    return this.responseSubjects.RemoveUserResponseOk.pipe(take(1))
  }

  onRemoveUserNoUserFoundResponse(): Observable<any> {
    return this.responseSubjects.RemoveUserNoUserFoundResponse
  }

  removeUser(request: DeleteUserRequest): void {
    this.executeObservable({observable:this.commService.removeUser(request)})
  }
}
