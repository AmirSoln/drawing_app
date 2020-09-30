import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { Document } from '../Dto/document';
import { DocumentService } from '../Service/document.service';
import { DeleteApprovalComponent } from '../Modals/delete-approval/delete-approval.component';
import { SharedDocumentService } from '../Service/shared-document.service';
import { ShareUserSelectionComponent } from '../Modals/share-user-selection/share-user-selection.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentService,SharedDocumentService]
})
export class DocumentListComponent implements OnInit {

  documents: Array<Document>
  headElements: Array<string> = ["Document Name","Owner"]
  isSharedMode:boolean
  isLoading:boolean
  @Output() loadingStatusEmmitter:EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(private documentService: DocumentService,
    private sharedDocumentService:SharedDocumentService,
    private loginService: LoginService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    console.log('here')
    this.documentService.getAllDocuments(this.loginService.getLoggedInUser())

    this.documentService.onGetDocumentsResponseOk().subscribe(
      result => {
        this.documents = result
        this.loadingStatusEmmitter.emit(false)
      }
    )

    this.sharedDocumentService.onGetSharedDocumentsResponseOk().subscribe(
      result => {
        this.documents = result
        this.loadingStatusEmmitter.emit(false)
      }
    )

    this.documentService.onDeleteDocumentResponseOk().subscribe(
      result=>{
        this.documents = this.documents.filter(obj=>obj.docId!=result.request.docId)
      }
    )
  }

  openDeleteModal(docId:string,docName:string): void {
    const modalRef = this.modalService.open(DeleteApprovalComponent)
    modalRef.componentInstance.docId = docId
    modalRef.componentInstance.docName = docName
    modalRef.componentInstance.documentService = this.documentService
  }

  openShareModal(docId:string):void{
    const modalRef = this.modalService.open(ShareUserSelectionComponent)
    modalRef.componentInstance.docId = docId
    modalRef.componentInstance.userId = this.loginService.getLoggedInUser()
  }

  onToggleListClicked():void{
    this.loadingStatusEmmitter.emit(true)
    this.isSharedMode?this.documentService.getAllDocuments(this.loginService.getLoggedInUser()):
    this.sharedDocumentService.getSharedDocuments(this.loginService.getLoggedInUser())

    this.isSharedMode = !this.isSharedMode
  }

}
