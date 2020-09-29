import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CommService } from './Shared/Service/comm.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationModule } from './authentication/authentication.module';
import { MainAppModule } from './main-app/main-app.module';
import { SharedModule } from './shared/shared.module';
import { RemoteCommService } from './shared/Service/remote-comm.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    MainAppModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    SharedModule
  ],
  providers: [{provide:CommService,useClass:RemoteCommService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
