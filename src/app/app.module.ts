import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Auth/register/register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './Auth/login/login.component';
import { CommService } from './Shared/Service/comm.service';
import { RemoteCommService } from "./Shared/Service/RemoteCommService";
import { HttpClientModule } from '@angular/common/http';
import { DocumentListComponent } from './Main/document-list/document-list.component';
import { EditDocumentComponent } from './Main/edit-document/edit-document.component';
import { UploadDocumentComponent } from './Main/upload-document/upload-document.component';
import { ActionsComponent } from './Main/actions/actions.component';
import { DeleteAccountComponent } from './Auth/delete-account/delete-account.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DocumentListComponent,
    EditDocumentComponent,
    UploadDocumentComponent,
    ActionsComponent,
    DeleteAccountComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut:3000,
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [{provide:CommService,useClass:RemoteCommService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
