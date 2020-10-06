import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ServiceBase } from 'src/app/shared/Service/service-base';

@Injectable()
export class SocketService extends ServiceBase {

  shareSocket: WebSocket
  rxShareSocket: WebSocketSubject<any>

  constructor() {
    super('Connected', 'Disconnected', 'GetUsers','Notification');
  }

  onConnected():Observable<any>{
    return this.responseSubjects.Connected
  }

  onDisconnected():Observable<any>{
    return this.responseSubjects.Disconnected
  }

  onGetUsers():Observable<any>{
    return this.responseSubjects.GetUsers
  }

  onNotification():Observable<any>{
    return this.responseSubjects.Notification
  }

  ConnectSocket(userId: string, documentId: string) {
    let socketUrl = 'wss://localhost:5001/ws?userId=' + userId + '&docId=' + documentId
    this.rxShareSocket = webSocket(socketUrl)
    
    let dataFunc = (evt: any, index: number): Array<any> => {
      console.log('evt = ',evt)
      let newData = evt
      console.log('newData = ',newData)
      return [evt, newData, this.responseSubjects[newData.DtoType]]
    }
    
    let subFunc = ([evt, newData, subject]): void => {
      subject.next(newData)
    }
    
    this.executeObservable({
      observable: this.rxShareSocket,
      paramDataFunc: dataFunc, subscriptionFunc: subFunc
    })
  }

  closeSocket(): void {
    this.rxShareSocket.unsubscribe()
    this.rxShareSocket.complete()
  }

  sendMarkerNotification(msg: string) {
    // if (this.shareSocket.readyState === WebSocket.OPEN) {
      // this.shareSocket.send(msg)
      this.rxShareSocket.next(msg)
    // }
  }
}



///CODE FOR SOCKET LIKE WE LEARNED IN CLASS
// this.shareSocket = new WebSocket("wss://localhost:5001/ws?userId=" + userId + "&docId=" + documentId)
    // var self = this
    // this.shareSocket.onopen = function (evt) {
    //   console.log("socket open" + JSON.stringify(evt))
    // }
    // self.shareSocket.onmessage = (evt => {
    //   console.log(evt)
    //   let obj = JSON.parse(evt.data)
    //   if (obj.DtoType == "Connected") {
    //     let user = obj.Data as UserInfo
    //     this.sharedWithUsers.push(user)
    //   } else if (obj.DtoType == "Disconnected") {
    //     let user = obj.Data as UserInfo
    //     this.sharedWithUsers = this.sharedWithUsers.filter(us => us.email != user.email)
    //   } else if (obj.DtoType == "GetUsers") {
    //     let users = obj.Data.Users
    //     users.map(us => this.sharedWithUsers.push(us as UserInfo))
    //   } else {
    //     this.markerSerivce.getMarkers(documentId)
    //   }
    //   return false
    // }
    // )
    // self.shareSocket.onerror = (evt => { console.log('error ', evt) })
    // self.shareSocket.onclose = ((evt) => {
    //   console.log("close socket");
    //   console.log(evt)
    // }
    // )
