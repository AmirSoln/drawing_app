import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';
import { ActionsComponent } from './actions/actions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DocumentListComponent } from './document-list/document-list.component';
import { DeleteApprovalComponent } from './Modals/delete-approval/delete-approval.component';


@NgModule({
  declarations: [
    ActionsComponent,
    UploadDocumentComponent,
    EditDocumentComponent,
    DocumentListComponent,
    DeleteApprovalComponent
  ],
  imports: [
    CommonModule,
    MainAppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule
  ]
})
export class MainAppModule { }