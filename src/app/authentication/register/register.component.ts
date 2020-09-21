import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../Dto/register-request';
import { RegisterService } from '../Service/register.service';
import { UserInfo } from 'src/app/Shared/Dto/user-info';
import { NotificationService } from 'src/app/Shared/Service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup

  constructor(private registerService: RegisterService,
    private router: Router,
    private notifications: NotificationService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      InAppUsername: new FormControl('', [Validators.required, Validators.minLength(5)]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
    })


    this.registerService.onSignUpResponseOk().subscribe(
      result => {
        this.notifications.showSuccess("Register successfull", "Success")
        this.router.navigate(["/login"])
      }
    )

    this.registerService.onSignUpResponseInvalidCredentials().subscribe(
      result => {
        this.notifications.showWarning("Somthing went wrong", "warning")
      }
    )
  }

  onSubmit(): void {
    let convertToRegisterRequest =
      () => {
        let userInfo = new UserInfo(this.registerForm.value["userEmail"],
          this.registerForm.value["InAppUsername"]);
        let request = new RegisterRequest(userInfo)
        return request
      }

    this.registerService.register(convertToRegisterRequest())
  }

}
