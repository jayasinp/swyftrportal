import {Component} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(
    private authService: AuthService
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
  }

}
