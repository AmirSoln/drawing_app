import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../../Service/document.service';

@Component({
  selector: 'app-delete-approval',
  templateUrl: './delete-approval.component.html',
  styleUrls: ['./delete-approval.component.css'],
  providers: [DocumentService]
})
export class DeleteApprovalComponent implements OnInit {
  docId: string
  docName: string
  documentService: DocumentService

  onDeleteSubscription: Subscription

  constructor(public activeModal: NgbActiveModal,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.onDeleteSubscription = this.documentService.onDeleteDocumentResponseOk().subscribe(
      _ => {
        console.log('document deleted successfully')
        this.notificationService.showSuccess('document deleted successfully', 'Success')
        this.activeModal.close("Delete file approved")
      }
    )

    this.documentService.onAppResponseError().subscribe(
      result => {
        this.notificationService.showError(result, "Error")
      }
    )
  }

  onDeleteClick(): void {
    this.documentService.deleteDocument(this.docId)
  }

  ngOnDestroy(): void {
    this.onDeleteSubscription.unsubscribe()
  }

}