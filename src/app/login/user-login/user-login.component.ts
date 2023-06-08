import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginObj: any = {
    userLogin: '',
    password: ''
  };

  constructor(private accService: AccountService, private router: Router) { }

  ngOnInit(): void {
    // Initialization code if needed
  }

  onLogin() {
    this.accService.login(this.loginObj).subscribe(
      (res: any) => {
        console.log('res', res);
        debugger
        sessionStorage.setItem('token', res.accessToken);
        this.router.navigateByUrl('/dashboard?token=${res.token}');
      },
      (error: any) => {

        console.error('Login error:', error);
      }
    );
  }
}
