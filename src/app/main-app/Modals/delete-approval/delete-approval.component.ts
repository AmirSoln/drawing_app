import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../../Service/document.service';

@Component({
  selector: 'app-delete-approval',
  templateUrl: './delete-approval.component.html',
  styleUrls: ['./delete-approval.component.css'],
  providers:[DocumentService]
})
export class DeleteApprovalComponent implements OnInit {
  @Input() docId:string
  @Input() docName:string
  @Input() documentService:DocumentService

  constructor(public activeModal: NgbActiveModal,
    private notificationService:NotificationService) { }

  ngOnInit(): void {
    // console.log(this.docId)

    this.documentService.onDeleteDocumentResponseOk().subscribe(
      result=>{
        console.log('document deleted successfully')
        this.notificationService.showSuccess('document deleted successfully','Success')
        this.activeModal.close("Delete file approved")
      }
    )

    this.documentService.onAppResponseError().subscribe(
      result=>{
        this.notificationService.showError(result,"Error")
      }
    )
  }

  onDeleteClick():void{
    this.documentService.deleteDocument(this.docId)
  }

}