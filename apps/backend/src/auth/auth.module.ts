//Oauth2 implementeren? https://arnab-k.medium.com/integrating-oauth2-with-nestjs-for-authentication-bf797a1d29eb

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './oauth.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  providers: [AuthService, OAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
