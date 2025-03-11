import { Injectable } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    return {
      authServerUrl: process.env.KEYCLOAK_URL!, //your URL Keycloak server
      realm: process.env.KEYCLOAK_REALM!, //realms that used for this app
      clientId: process.env.KEYCLOAK_CLIENTID!, //client id for this app
      secret: process.env.KEYCLOAK_SECRET!, //secret for this app
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
      cookieKey: 'KEYCLOAK_IDENTITY',
    };
  }
}
