import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Service/login.service';
import { LoginRequest } from '../Dto/login-request';
import { UserInfo } from 'src/app/Shared/Dto/user-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //providers:[LoginService]//Not singleton (similar to transaient)
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup

  constructor(private service:LoginService,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userEmail:new FormControl('',[Validators.email,Validators.required]),
    })

    this.service.onSignInResponseOK().subscribe(
      result=>{
        this.router.navigate(["/actions"])
      }
    )
  }

  onSubmit():void{
    let user = new UserInfo(this.loginForm.value["userEmail"],"")
    let request = new LoginRequest(user)
    
    this.service.login(request)
  }

}
