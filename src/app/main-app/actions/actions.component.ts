import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/authentication/Service/login.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  isLoading:boolean
  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
    this.isLoading = true
  }

  onLogOut():void{
    this.loginService.logOut()
  }

  handleLoadingSceen(emittedLoading:boolean):void{
    this.isLoading = emittedLoading
  }

}
