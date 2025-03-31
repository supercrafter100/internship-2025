//Oauth2 implementeren? https://arnab-k.medium.com/integrating-oauth2-with-nestjs-for-authentication-bf797a1d29eb

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { OAuthStrategy } from './oauth.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [PassportModule],
  providers: [AuthService, OAuthStrategy, PrismaService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
