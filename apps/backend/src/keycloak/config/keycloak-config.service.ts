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
      secret: 'secret', //secret for this app
      logLevels: ['verbose'],
      useNestLogger: false,
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}
