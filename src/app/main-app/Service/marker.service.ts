import { MarkerType } from './../../Shared/Dto/marker-type.enum';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { Injectable } from '@angular/core';
import { PosInfo } from '../Dto/pos-info';
import { Subject, Observable } from 'rxjs';
import { CreateMarkerRequest } from '../Dto/create-marker-request';
import { Marker } from '../Dto/marker';
import { map } from 'rxjs/operators';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { DeleteMarkerRequest } from '../Dto/delete-marker-request';

@Injectable()
export class MarkerService {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    'CreateMarkerResponseOk': new Subject<any>(),
    'AppResponseError': new Subject<any>(),
    'GetMarkersResponseOk': new Subject<any>(),
    'DeleteMarkerResponseOk': new Subject<any>()
  }

  constructor(private loginService: LoginService, private commService: CommService) { }

  onCreateMarkerResponseOk(): Observable<any> {
    return this.responseSubjects.CreateMarkerResponseOk
  }

  onAppResponseError(): Observable<any> {
    return this.responseSubjects.AppResponseError
  }

  onGetMarkersResponseOk(): Observable<any> {
    return this.responseSubjects.GetMarkersResponseOk
  }

  onDeleteMarkerResponseOk(): Observable<any> {
    return this.responseSubjects.DeleteMarkerResponseOk
  }
  deleteMarker(markerId: string) {
    let request = new DeleteMarkerRequest()
    request.markerId = markerId

    this.executeObservable(this.commService.deleteMarker(request))
  }

  createMarker(pos: PosInfo, docId: string, markType: MarkerType, color: string): void {
    let request = new CreateMarkerRequest()
    request.marker = new Marker(docId, JSON.stringify(pos), this.loginService.getLoggedInUser(), markType, color)

    this.executeObservable(this.commService.createMarker(request))
  }

  getMarkers(documentId: string): void {
    this.executeObservable(this.commService.getAllMarkers(documentId))
  }

  executeObservable(observable: Observable<any>): void {
    observable.pipe(
      map(data => [data, this.responseSubjects[data.responseType]])
    ).subscribe(
      ([data, subject]) => {
        subject.next(data)
      },
      err => console.log(err)
    )
  }
}
