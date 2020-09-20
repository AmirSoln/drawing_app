import { MarkerType } from './../../Shared/Dto/marker-type.enum';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { LoginService } from './../../Auth/Service/login.service';
import { Injectable } from '@angular/core';
import { PosInfo } from '../Dto/pos-info';
import { Subject, Observable } from 'rxjs';
import { CreateMarkerRequest } from '../Dto/create-marker-request';
import { Marker } from '../Dto/marker';
import { map } from 'rxjs/operators';

@Injectable()
export class MarkerService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    CreateMarkerResponseOk: new Subject<any>(),
    AppResponseError: new Subject<any>(),
    GetMarkersResponseOk:new Subject<any>()
  }

  constructor(private loginService: LoginService, private commService: CommService) { }

  onCreateMarkerResponseOk(): Observable<any> {
    return this.responseSubjects.CreateMarkerResponseOk
  }

  onAppResponseError(): Observable<any> {
    return this.responseSubjects.AppResponseError
  }

  onGetMarkersResponseOk():Observable<any>{
    return this.responseSubjects.GetMarkersResponseOk
  }

  createMarker(pos: PosInfo, docId: string, markType: MarkerType):void {
    let request = new CreateMarkerRequest()
    request.marker = new Marker(docId, JSON.stringify(pos), this.loginService.getLoggedInUser(), markType, "Black")

    this.commService.createMarker(request).pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data)
      },
      err => console.log(err)
    )
  }

  getMarkers(documentId:string):void{
      this.commService.getAllMarkers(documentId).pipe(
        map(data => [data, this.responseSubjects[data.responseType]])
      ).subscribe(
        ([data, subject]) => {
          subject.next(data)
        },
        err => console.log(err)
      )
  }
}
