import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadDocumentService } from '../Service/upload-document.service';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css'],
  providers:[UploadDocumentService]
})
export class UploadDocumentComponent implements OnInit {
  selectedFile:File = null;
  uploadDocument: FormGroup

  constructor(private uploadService:UploadDocumentService,
    private notifications:NotificationService,
    private router:Router) { }

  ngOnInit(): void {
    this.uploadDocument = new FormGroup(
      {
        Name: new FormControl('', [Validators.required, Validators.minLength(1)]),
        Photo: new FormControl('')
      }
    )

    this.uploadService.onUploadDocumentResponseOk().subscribe(
      result=>{
        this.router.navigate(["/actions"])
      }
    )

    this.uploadService.onAppResponseError().subscribe(
      result=>this.notifications.showError(result,"Error")
    )
  }

  onFileSelected(files:FileList){
    this.selectedFile = files.item(0) 
  }

  onSubmit() {
    console.log(this.selectedFile)
    this.uploadService.uploadDocument(this.uploadDocument.value["Name"],this.selectedFile)
  }
}
