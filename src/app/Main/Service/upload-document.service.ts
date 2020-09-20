import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/Auth/Service/login.service';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs';

@Injectable()
export class UploadDocumentService {

  responseSubjects: { [responseID: string]: Subject<any> } = {
    UploadDocumentResponseOk: new Subject<any>(),
    AppResponseError: new Subject<any>()
  }

  onUploadDocumentResponseOk():Observable<any> {
    return this.responseSubjects.UploadDocumentResponseOk
  }

  onAppResponseError():Observable<any>{
    return this.responseSubjects.AppResponseError
  }

  constructor(private commService: CommService, private loginService: LoginService) { }

  uploadDocument(docName: string, doc: File) {
    let formData = new FormData()
    formData.append("Image", doc, doc.name)
    formData.append("Name", docName)
    formData.append("UserId", this.loginService.getLoggedInUser())

    this.commService.upload(formData).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data)
      },
      err => console.log(err)
    )
  }
}
