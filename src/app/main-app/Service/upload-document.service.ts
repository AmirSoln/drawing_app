import { Injectable } from '@angular/core';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable()
export class UploadDocumentService extends ServiceBase {

  constructor(private commService: CommService, private loginService: LoginService) {
    super('UploadDocumentResponseOk');
  }

  onUploadDocumentResponseOk():Observable<any> {
    return this.responseSubjects.UploadDocumentResponseOk
  }

  uploadDocument(docName: string, doc: File) {
    let formData = new FormData()
    formData.append("Image", doc, doc.name)
    formData.append("Name", docName)
    formData.append("UserId", this.loginService.getLoggedInUser())

    this.executeObservable({observable:this.commService.upload(formData)})
  }
}
