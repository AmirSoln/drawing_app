import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { LoginGuard } from './Shared/Guards/login.guard';
import { UploadDocumentComponent } from './Main/upload-document/upload-document.component';
import { ActionsComponent } from './Main/actions/actions.component';
import { DeleteAccountComponent } from './Auth/delete-account/delete-account.component';
import { EditDocumentComponent } from './Main/edit-document/edit-document.component';



const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/login" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "deleteAccount", component: DeleteAccountComponent },
  { path: "actions", component: ActionsComponent, canActivate: [LoginGuard] },
  { path: "uploadDocument", component: UploadDocumentComponent, canActivate: [LoginGuard] },
  { path: "editDocument", component: EditDocumentComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
