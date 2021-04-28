import { Component } from '@angular/core';
import { OAuthService, NullValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import { environment } from '../environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deap-front-end';

  constructor(private oauthService: OAuthService, private router: Router) {
      this.configure();
  }

  currentApplicationVersion = environment.appVersion;
  logedIn = true;
  logoutURL = "http://localhost:4200"


  authConfig: AuthConfig = {
      issuer: 'http://localhost:8080/auth/realms/SpringBootKeycloak',
      redirectUri: window.location.origin + "/admin",
      postLogoutRedirectUri: this.logoutURL,
      clientId: 'spa-employee',
      responseType: 'code',
      disableAtHashCheck: true,
      showDebugInformation: true
    }

    public login() {
      this.oauthService.initLoginFlow();
      this.oauthService.loadUserProfile().then(function(profile) {
        alert(JSON.stringify(profile, null, "  "));
    })
    }

    public logoff() {
      this.oauthService.logOut();
    }

    private configure() {
      this.oauthService.configure(this.authConfig);
      this.oauthService.tokenValidationHandler = new  NullValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
}
