import { MarkerType } from './../../Shared/Dto/marker-type.enum';
import { CommService } from 'src/app/Shared/Service/comm.service';
import { Injectable } from '@angular/core';
import { PosInfo } from '../Dto/pos-info';
import { Observable } from 'rxjs';
import { CreateMarkerRequest } from '../Dto/create-marker-request';
import { Marker } from '../Dto/marker';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { DeleteMarkerRequest } from '../Dto/delete-marker-request';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable()
export class MarkerService extends ServiceBase {
  
  constructor(private loginService: LoginService, private commService: CommService) {
    super('CreateMarkerResponseOk','GetMarkersResponseOk','DeleteMarkerResponseOk');
  }

  onCreateMarkerResponseOk(): Observable<any> {
    return this.responseSubjects.CreateMarkerResponseOk
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

    this.executeObservable({observable:this.commService.deleteMarker(request)})
  }

  createMarker(pos: PosInfo, docId: string, markType: MarkerType, color: string): void {
    let request = new CreateMarkerRequest()
    request.marker = new Marker(docId, JSON.stringify(pos), this.loginService.getLoggedInUser(), markType, color)

    this.executeObservable({observable:this.commService.createMarker(request)})
  }

  getMarkers(documentId: string): void {
    this.executeObservable({observable:this.commService.getAllMarkers(documentId)})
  }

}
