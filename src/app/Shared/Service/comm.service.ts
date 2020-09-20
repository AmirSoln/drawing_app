import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequest } from 'src/app/Auth/Dto/register-request';
import { LoginRequest } from 'src/app/Auth/Dto/login-request';
import { DeleteUserRequest } from 'src/app/Auth/Dto/delete-user-request';
import { CreateMarkerRequest } from 'src/app/Main/Dto/create-marker-request';

@Injectable()
export abstract class CommService {
  
  constructor() { }

  //User related
  abstract login(request:LoginRequest): Observable<any>
  abstract register(request: RegisterRequest): Observable<any>
  abstract removeUser(request: DeleteUserRequest): Observable<any>

  //Document related
  abstract upload(formData: FormData):Observable<any>

  //Marker related
  abstract createMarker(request: CreateMarkerRequest):Observable<any>
  abstract getAllMarkers(documentId: string):Observable<any>
  
  //share related

}
