import { Component } from '@angular/core';
import { OAuthService, NullValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import { environment } from '../environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { Employee } from './shared/employee.model'
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'deap-front-end';

  constructor(private http: HttpClient, private oauthService: OAuthService, private router: Router) {
      this.configure();
  }

  currentApplicationVersion = environment.appVersion;
  logedIn = true;
  logoutURL = "https://frontendkeycloak.herokuapp.com/"

   onShowName(){
      this.http.get<Employee[]>('https://springbootkeycloak.herokuapp.com/employee/name',
      ).subscribe(responseData => {
        this.employeeJson = JSON.stringify(responseData);
        this.loginName = responseData[0].firstName;
      });
  }

    employee : Employee[] = [];
    loginName: String;
    employeeJson: any;
    isLoading: boolean = false;


    ngOnInit(): void {
      this.onShowName();
      var Json = JSON.parse(this.employeeJson);
    }

  authConfig: AuthConfig = {
      issuer: 'https://keycloakkeycloak.herokuapp.com/auth/realms/SpringBootKeycloak',
      redirectUri: window.location.origin + "/admin",
      postLogoutRedirectUri: this.logoutURL,
      clientId: 'spa-employee',
      responseType: 'code',
      disableAtHashCheck: true,
      showDebugInformation: true
    }

    userName: any;

    public login() {
      this.isLoading = true;
      this.oauthService.initLoginFlow();

      this.userName = this.oauthService.loadUserProfile().then((profile) => {
        return JSON.parse(JSON.stringify(profile.preferred_username));
      })
      this.isLoading = false;
    }

    public logoff() {
      this.isLoading = true;
      this.oauthService.logOut();
      this.isLoading = false;
    }

    private configure() {
      this.oauthService.configure(this.authConfig);
      this.oauthService.tokenValidationHandler = new  NullValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
}
