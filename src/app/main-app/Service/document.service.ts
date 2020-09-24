import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommService } from 'src/app/Shared/Service/comm.service';

@Injectable()
export class DocumentService {

  responseSubjects: { [responseID: string]: Subject<any> } = {
    'GetAllDocumentsResponseOk': new Subject<any>(),
    'AppResponseError': new Subject<any>(),
    'GetDocumentResponseOk':new Subject<any>()
  }

  constructor(private commService: CommService) { }

  onGetDocumentsResponseOk(): Observable<any> {
    return this.responseSubjects.GetAllDocumentsResponseOk
  }

  onAppResponseError(): Observable<any> {
    return this.responseSubjects.AppResponseError
  }

  onGetDocumentResponseOk(): Observable<any> {
    return this.responseSubjects.GetDocumentResponseOk
  }

  getAllDocuments(owner: string): void {
    this.commService.getAllDocuments(owner).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        console.log(data.documents)
        subject.next(data.documents)
      },
      err => console.log(err)
    )
  }

  getDocumentById(docId: string): void {
    this.commService.getDocumentById(docId).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        console.log(data)
        let imageData = 'data:image/png;base64,' + data.image;
        subject.next(imageData)
      }
    )
  }
}
