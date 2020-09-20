import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../Dto/register-request';
import { RegisterService } from '../Service/register.service';
import { UserInfo } from 'src/app/Shared/Dto/user-info';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      InAppUsername: new FormControl('', [Validators.required, Validators.minLength(5)]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
    })


    this.registerService.SignUpResponseOk.subscribe(
      result => {
        this.router.navigate(["/login"])
      }
    )
  }

  onSubmit(): void {
    let convertToRegisterRequest =
      () => {
        let userInfo = new UserInfo(this.registerForm.value["userEmail"],
          this.registerForm.value["InAppUsername"]);
        let request = new RegisterRequest(userInfo)
        // request.login.email = this.registerForm.value["userEmail"]
        // request.login.inAppUsername = this.registerForm.value["InAppUsername"]
        return request
      }

    console.log(this.registerForm.value)
    console.log(convertToRegisterRequest())
    this.registerService.register(convertToRegisterRequest())
  }

}
