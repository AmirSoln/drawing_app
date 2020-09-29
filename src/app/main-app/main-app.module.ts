import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';
import { ActionsComponent } from './actions/actions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DeleteApprovalComponent } from './Modals/delete-approval/delete-approval.component';
import { ShareUserSelectionComponent } from './Modals/share-user-selection/share-user-selection.component';


@NgModule({
  declarations: [
    ActionsComponent,
    UploadDocumentComponent,
    EditDocumentComponent,
    DocumentListComponent,
    DeleteApprovalComponent,
    ShareUserSelectionComponent
  ],
  imports: [
    CommonModule,
    MainAppRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class MainAppModule { }
