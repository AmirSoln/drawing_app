import { Injectable } from '@angular/core';
import { CommService } from './comm.service';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http'
import { RegisterRequest } from 'src/app/Auth/Dto/register-request';
import { DeleteUserRequest } from 'src/app/Auth/Dto/delete-user-request';
import { CreateMarkerRequest } from 'src/app/Main/Dto/create-marker-request';

@Injectable()
export class RemoteCommService implements CommService {
  

  constructor(private httpClient:HttpClient) { }

  getAllMarkers(documentId: string): Observable<any> {
    return this.httpClient.get("api/Markers/getMarkers/"+documentId)
  }

  createMarker(request: CreateMarkerRequest): Observable<any> {
    return this.httpClient.post("api/Markers/CreateMarker",request)
  }

  removeUser(request: DeleteUserRequest): Observable<any> {
    return this.httpClient.post("api/RemoveUser/RemoveUser",request);
  }

  upload(formData: FormData): Observable<any> {
    return this.httpClient.post("api/Documents/Upload",formData);
  }

  login(request: any): Observable<any> {
    return this.httpClient.post("api/SignIn/SignIn",request);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.httpClient.post("api/SignUp/SignUp",request);
  }
}
