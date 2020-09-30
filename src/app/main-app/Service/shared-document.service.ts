import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { GetAllUsersForSharingRequest } from '../Dto/get-all-users-for-sharing-request';
import { GetSharedDocumentsRequest } from '../Dto/get-shared-documents-request';
import { ShareDocumentRequest } from '../Dto/share-document-request';

@Injectable()
export class SharedDocumentService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    'GetSharedDocumentsResponseOk': new Subject<any>(),
    'ShareDocumentResponseOk':new Subject<any>(),
    'GetAllUsersForSharingResponseOk': new Subject<any>(),
    'AppResponseError': new Subject<any>()
  }

  constructor(private commService: CommService) { }

  onShareDocumentResponseOk(): Observable<any> {
    return this.responseSubjects.ShareDocumentResponseOk
  }

  onGetSharedDocumentsResponseOk(): Observable<any> {
    return this.responseSubjects.GetSharedDocumentsResponseOk
  }

  onAppResponseError(): Observable<any> {
    return this.responseSubjects.GetSharedDocumentsResponseOk
  }

  onGetAllUsersResponseOk(): Observable<any> {
    return this.responseSubjects.GetAllUsersForSharingResponseOk
  }

  getSharedDocuments(userId: string) {
    let request = new GetSharedDocumentsRequest()
    request.userId = userId

    this.commService.getSharedDocuments(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data.documents)
      },
      err => console.log(err)
    )
  }

  shareDocument(userId: string, docId: string) {
    let request = new ShareDocumentRequest()
    request.userId = userId
    request.docId = docId

    this.commService.shareDocument(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data.documents)
      },
      err => console.log(err)
    )
  }

  getAllUsersForShare(docId:string): void {
    let request = new GetAllUsersForSharingRequest()
    request.docId = docId

    this.commService.getAllUserForShare(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        // console.log(data)
        subject.next(data.users)
      },
      err => console.log(err)
    )
  }
}