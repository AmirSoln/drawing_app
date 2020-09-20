import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RemoveUserService } from '../Service/remove-user.service';
import { DeleteUserRequest } from '../Dto/delete-user-request';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
  providers:[RemoveUserService]
})
export class DeleteAccountComponent implements OnInit {

  deleteAccountForm:FormGroup

  constructor(private removeUserService:RemoveUserService ,private router: Router) { }

  ngOnInit(): void {
    this.deleteAccountForm = new FormGroup({
      userEmail:new FormControl('',[Validators.email,Validators.required]),
      deleteValidator:new FormControl('',[Validators.requiredTrue])
    })

    this.removeUserService.onRemoveUserResponseOk().subscribe(
      result=>{
        this.router.navigate(["/login"])
      }
    )
  }

  onSubmit():void{
    // let user = new UserInfo(this.deleteAccountForm.value["userEmail"],"")
    // let request = new LoginRequest(user)
    
    // this.service.login(request)
    let user = this.deleteAccountForm.value["userEmail"]
    let request = new DeleteUserRequest()
    request.userId = user

    this.removeUserService.removeUser(request)
  }

}
