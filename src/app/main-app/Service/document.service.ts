import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { DeleteDocumentRequest } from '../Dto/delete-document-request';

@Injectable()
export class DocumentService {

  responseSubjects: { [responseID: string]: Subject<any> } = {
    'GetAllDocumentsResponseOk': new Subject<any>(),
    'AppResponseError': new Subject<any>(),
    'GetDocumentResponseOk':new Subject<any>(),
    'DeleteDocumentResponseOk':new Subject<any>()
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

  onDeleteDocumentResponseOk():Observable<any>{
    return this.responseSubjects.DeleteDocumentResponseOk
  }

  getAllDocuments(owner: string): void {
    this.commService.getAllDocuments(owner).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
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
        data.image = 'data:image/png;base64,' + data.image
        subject.next(data)
      }
    )
  }

  deleteDocument(docId: string) {
    let request = new DeleteDocumentRequest()
    request.docId = docId

    this.commService.deleteDocument(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data)
      }
    )
  }
}
