import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Service/login.service';
import { LoginRequest } from '../Dto/login-request';
import { UserInfo } from 'src/app/Shared/Dto/user-info';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup
  onInvalidCredentials:Subscription
  onSignInOk:Subscription

  constructor(private service: LoginService, private router: Router, private notification: NotificationService) { }

  ngOnDestroy(): void {
    this.onInvalidCredentials.unsubscribe()
    this.onSignInOk.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userEmail: new FormControl('', [Validators.email, Validators.required]),
    })

    this.onSignInOk = this.service.onSignInResponseOK().subscribe(
      result => {
        this.notification.showSuccess("Login Successfull", "Success")
        this.router.navigate(["/actions"])
      }
    )

    this.onInvalidCredentials = this.service.onSignInResponseInvalidUserNameOrEmail().subscribe(
      result => {
        this.notification.showWarning("Wrong Credentials", "Warrning")
      }
    )

  }

  onSubmit(): void {
    let user = new UserInfo(this.loginForm.value["userEmail"], "")
    let request = new LoginRequest(user)

    this.service.login(request)
  }

}
