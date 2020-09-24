import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { Document } from '../Dto/document';
import { DocumentService } from '../Service/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers:[DocumentService]
})
export class DocumentListComponent implements OnInit {
  documents:Array<Document>
  headElements:Array<string> = ["Document Name"]
  constructor(private documentService:DocumentService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.documentService.getAllDocuments(this.loginService.getLoggedInUser())

    this.documentService.onGetDocumentsResponseOk().subscribe(
      result=>this.documents = result
    )
  }

}
