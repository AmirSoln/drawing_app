import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '../Shared/Guards/login.guard';
import { ActionsComponent } from './actions/actions.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';

const routes: Routes = [
  { path: '', component: ActionsComponent, canActivate: [LoginGuard] },
  { path: 'uploadDocument', component: UploadDocumentComponent, canActivate: [LoginGuard] },
  { path: 'editDocument', component: EditDocumentComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainAppRoutingModule { }
