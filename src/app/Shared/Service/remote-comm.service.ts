import { Injectable } from '@angular/core';
import { CommService } from './comm.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { CreateMarkerRequest } from 'src/app/main-app/Dto/create-marker-request';
import { DeleteUserRequest } from 'src/app/authentication/Dto/delete-user-request';
import { RegisterRequest } from 'src/app/authentication/Dto/register-request';
import { environment } from 'src/environments/environment';

@Injectable()
export class RemoteCommService implements CommService {
  

  constructor(private httpClient: HttpClient) { }

  getAllDocuments(owner: String): Observable<any> {
    let url = environment.documentApi + 'GetAllDocuments/'+owner
    return this.httpClient.get(url)
  }

  getDocumentById(documentId: String): Observable<any> {
    let url = environment.documentApi + 'GetDocumentById/'+documentId
    return this.httpClient.get(url)
  }

  getAllMarkers(documentId: string): Observable<any> {
    let url = environment.markersApi + 'getMarkers/' + documentId
    return this.httpClient.get(url)
  }

  createMarker(request: CreateMarkerRequest): Observable<any> {
    return this.httpClient.post(environment.markersApi + 'CreateMarker', request)
  }

  removeUser(request: DeleteUserRequest): Observable<any> {
    return this.httpClient.post(environment.removeUserApi + 'RemoveUser', request);
  }

  upload(formData: FormData): Observable<any> {
    return this.httpClient.post(environment.documentApi + 'Upload', formData);
  }

  login(request: any): Observable<any> {
    return this.httpClient.post(environment.signInApi + 'SignIn', request);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.httpClient.post(environment.signUpApi+'SignUp', request);
  }
}
