import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteUserRequest } from 'src/app/authentication/Dto/delete-user-request';
import { LoginRequest } from 'src/app/authentication/Dto/login-request';
import { RegisterRequest } from 'src/app/authentication/Dto/register-request';
import { CreateMarkerRequest } from 'src/app/main-app/Dto/create-marker-request';
import { DeleteDocumentRequest } from 'src/app/main-app/Dto/delete-document-request';
import { DeleteMarkerRequest } from 'src/app/main-app/Dto/delete-marker-request';
import { GetAllUsersForSharingRequest } from 'src/app/main-app/Dto/get-all-users-for-sharing-request';
import { GetSharedDocumentsRequest } from 'src/app/main-app/Dto/get-shared-documents-request';
import { ShareDocumentRequest } from 'src/app/main-app/Dto/share-document-request';

@Injectable()
export abstract class CommService {
  constructor() { }

  //User related
  abstract login(request: LoginRequest): Observable<any>
  abstract register(request: RegisterRequest): Observable<any>
  abstract removeUser(request: DeleteUserRequest): Observable<any>

  //Document related
  abstract upload(formData: FormData): Observable<any>
  abstract getDocumentById(documentId: String): Observable<any>
  abstract getAllDocuments(owner: String): Observable<any>
  abstract deleteDocument(request: DeleteDocumentRequest): Observable<any>

  //Marker related
  abstract createMarker(request: CreateMarkerRequest): Observable<any>
  abstract getAllMarkers(documentId: string): Observable<any>
  abstract deleteMarker(request: DeleteMarkerRequest): Observable<any>
  abstract editMarker(request: any): Observable<any>


  //share related
  abstract getSharedDocuments(request: GetSharedDocumentsRequest): Observable<any>
  abstract shareDocument(request: ShareDocumentRequest): Observable<any>
  abstract getAllUserForShare(request:GetAllUsersForSharingRequest):Observable<any>

}
