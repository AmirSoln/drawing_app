import { UserInfo } from 'src/app/Shared/Dto/user-info';

export class LoginRequest {
    constructor(public loginDto:UserInfo){}
}
