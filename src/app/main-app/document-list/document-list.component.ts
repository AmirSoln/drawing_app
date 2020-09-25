import { NgbModalOptions, ModalDismissReasons,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { Document } from '../Dto/document';
import { DocumentService } from '../Service/document.service';
import { DeleteApprovalComponent } from '../Modals/delete-approval/delete-approval.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentService]
})
export class DocumentListComponent implements OnInit {

  documents: Array<Document>
  headElements: Array<string> = ["Document Name"]

  constructor(private documentService: DocumentService,
    private loginService: LoginService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.documentService.getAllDocuments(this.loginService.getLoggedInUser())

    this.documentService.onGetDocumentsResponseOk().subscribe(
      result => this.documents = result
    )

    this.documentService.onDeleteDocumentResponseOk().subscribe(
      result=>{
        this.documents = this.documents.filter(obj=>obj.docId!=result.request.docId)
      }
    )
  }

  open(docId:string,docName:string): void {
    const modalRef = this.modalService.open(DeleteApprovalComponent)
    modalRef.componentInstance.docId = docId
    modalRef.componentInstance.docName = docName
    modalRef.componentInstance.documentService = this.documentService
  }

}
