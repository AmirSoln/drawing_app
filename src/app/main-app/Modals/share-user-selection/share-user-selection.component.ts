import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { SharingUserInfo } from '../../Dto/sharing-user-info';
import { SharedDocumentService } from '../../Service/shared-document.service';

@Component({
  selector: 'app-share-user-selection',
  templateUrl: './share-user-selection.component.html',
  styleUrls: ['./share-user-selection.component.css'],
  providers:[SharedDocumentService]
})
export class ShareUserSelectionComponent implements OnInit {
  users:Array<SharingUserInfo>
  @Input() docId:string
  @Input() userId:string

  constructor(public activeModal: NgbActiveModal,
    private notificationService:NotificationService,
    private sharingService:SharedDocumentService) { }

  ngOnInit(): void {
    this.sharingService.getAllUsersForShare(this.docId)
    this.sharingService.onGetAllUsersResponseOk().subscribe(
      result=>{
        this.users = Array.of(...result).filter(user=>user.email!=this.userId)
      }
    )
    this.sharingService.onShareDocumentResponseOk().subscribe(
      result=>{
        this.notificationService.showSuccess("Document shared successfully","Success")
      }
    )
  }

  onShareClicked(event:any,userId:string):void{
    console.log(event)
    event.target.disabled = true
    event.target.innerText = "Shared!"
    this.sharingService.shareDocument(userId,this.docId)
  }

}
