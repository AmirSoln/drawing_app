import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { RegisterRequest } from '../Dto/register-request';
import { take } from 'rxjs/operators';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable()
export class RegisterService extends ServiceBase {

  constructor(private commService: CommService) {
    super('SignUpResponseOk','SignUpResponseInvalidCredentials');
  }

  onSignUpResponseOk():Observable<any> {
    return this.responseSubjects.SignUpResponseOk.pipe(take(1))
  }

  onSignUpResponseInvalidCredentials():Observable<any> {
    return this.responseSubjects.SignUpResponseInvalidCredentials
  }

  register(request: RegisterRequest): void {
    let subFunc = ([data, subject]) => {
      subject.next(data)
      subject.complete()
    }

    this.executeObservable({observable:this.commService.register(request),
    subscriptionFunc:subFunc})
  }
}
