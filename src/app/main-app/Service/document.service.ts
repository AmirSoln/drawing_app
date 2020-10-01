import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { ServiceBase } from 'src/app/shared/Service/service-base';
import { DeleteDocumentRequest } from '../Dto/delete-document-request';

@Injectable()
export class DocumentService extends ServiceBase {

  constructor(private commService: CommService) {
    super('GetAllDocumentsResponseOk',
    'GetDocumentResponseOk','DeleteDocumentResponseOk','GetDocumentResponseInvalidId');
  }

  onGetDocumentsResponseOk(): Observable<any> {
    return this.responseSubjects.GetAllDocumentsResponseOk
  }

  onGetDocumentResponseOk(): Observable<any> {
    return this.responseSubjects.GetDocumentResponseOk
  }

  onDeleteDocumentResponseOk():Observable<any>{
    return this.responseSubjects.DeleteDocumentResponseOk
  }

  onGetDocumentResponseInvalidId():Observable<any>{
    return this.responseSubjects.GetDocumentResponseInvalidId
  }

  getAllDocuments(owner: string): void {
    let subscribeFunction = ([data,subject])=>subject.next(data.documents)
    this.executeObservable({observable:this.commService.getAllDocuments(owner),subscriptionFunc:subscribeFunction})
  }

  getDocumentById(docId: string): void {
    this.executeObservable({observable:this.commService.getDocumentById(docId)})
  }

  deleteDocument(docId: string) {
    let request = new DeleteDocumentRequest()
    request.docId = docId

    this.executeObservable({observable:this.commService.deleteDocument(request)})
  }
}
