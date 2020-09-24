import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainAppRoutingModule } from './main-app-routing.module';
import { ActionsComponent } from './actions/actions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { DocumentListComponent } from './document-list/document-list.component';


@NgModule({
  declarations: [
    ActionsComponent,
    UploadDocumentComponent,
    EditDocumentComponent,
    DocumentListComponent
  ],
  imports: [
    CommonModule,
    MainAppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class MainAppModule { }
