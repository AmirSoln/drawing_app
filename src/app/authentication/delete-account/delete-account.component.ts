import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RemoveUserService } from '../Service/remove-user.service';
import { DeleteUserRequest } from '../Dto/delete-user-request';
import { NotificationService } from 'src/app/Shared/Service/notification.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
  providers: [RemoveUserService]
})
export class DeleteAccountComponent implements OnInit {

  deleteAccountForm: FormGroup

  constructor(private removeUserService: RemoveUserService,
    private router: Router,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.deleteAccountForm = new FormGroup({
      userEmail: new FormControl('', [Validators.email, Validators.required]),
      deleteValidator: new FormControl('', [Validators.requiredTrue])
    })

    this.removeUserService.onRemoveUserResponseOk().subscribe(
      result => {
        this.notification.showSuccess("Delete Successfull", "Success")
        this.router.navigate(["/login"])
      }
    )

    this.removeUserService.onRemoveUserNoUserFoundResponse().subscribe(
      result=>this.notification.showWarning("Something went wrong", "Warrning")
    )

    this.removeUserService.onAppResponseError().subscribe(
      result=>this.notification.showError("An error has occured","Error")
    )
  }

  onSubmit(): void {
    let user = this.deleteAccountForm.value["userEmail"]
    let request = new DeleteUserRequest()
    request.userId = user

    this.removeUserService.removeUser(request)
  }

}
