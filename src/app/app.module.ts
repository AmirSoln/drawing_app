import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommService } from './Shared/Service/comm.service';
import { RemoteCommService } from "./Shared/Service/RemoteCommService";
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationModule } from './authentication/authentication.module';
import { MainAppModule } from './main-app/main-app.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    MainAppModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    BrowserModule,
    // BrowserAnimationsModule,
    // ToastrModule.forRoot({
    //   timeOut:3000,
    //   positionClass: 'toast-bottom-right'
    // }),
    SharedModule
  ],
  providers: [{provide:CommService,useClass:RemoteCommService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
