import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { ServiceBase } from 'src/app/shared/Service/service-base';
import { GetAllUsersForSharingRequest } from '../Dto/get-all-users-for-sharing-request';
import { GetSharedDocumentsRequest } from '../Dto/get-shared-documents-request';
import { ShareDocumentRequest } from '../Dto/share-document-request';

@Injectable()
export class SharedDocumentService extends ServiceBase {

  constructor(private commService: CommService) {
    super('GetSharedDocumentsResponseOk', 'ShareDocumentResponseOk', 'GetAllUsersForSharingResponseOk');
  }

  onShareDocumentResponseOk(): Observable<any> {
    return this.responseSubjects.ShareDocumentResponseOk
  }

  onGetSharedDocumentsResponseOk(): Observable<any> {
    return this.responseSubjects.GetSharedDocumentsResponseOk
  }

  onGetAllUsersResponseOk(): Observable<any> {
    return this.responseSubjects.GetAllUsersForSharingResponseOk
  }

  getSharedDocuments(userId: string) {
    let request = new GetSharedDocumentsRequest()
    request.userId = userId

    this.executeObservable({
      observable: this.commService.getSharedDocuments(request),
      subscriptionFunc: ([data, subject]) => subject.next(data.documents)
    })
  }

  shareDocument(userId: string, docId: string) {
    let request = new ShareDocumentRequest()
    request.userId = userId
    request.docId = docId

    this.executeObservable({
      observable: this.commService.shareDocument(request),
      subscriptionFunc: ([data, subject]) => subject.next(data.documents)
    })
  }

  getAllUsersForShare(docId: string): void {
    let request = new GetAllUsersForSharingRequest()
    request.docId = docId

    this.executeObservable({
      observable: this.commService.getAllUserForShare(request)
      , subscriptionFunc: ([data, subject]) => subject.next(data.users)
    })
  }
}