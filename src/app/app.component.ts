import { Component } from '@angular/core';
import { OAuthService, NullValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'deap-front-end';

  constructor(private oauthService: OAuthService) {
      this.configure();
  }

  authConfig: AuthConfig = {
      issuer: 'http://localhost:8080/auth/realms/heroes',
      redirectUri: window.location.origin + "/",
      clientId: 'spa-heroes',
      responseType: 'code',
      // at_hash is not present in JWT token
      disableAtHashCheck: true,
      showDebugInformation: true
    }

    public login() {
      this.oauthService.initLoginFlow();
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
