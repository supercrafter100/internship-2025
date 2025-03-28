/* eslint-disable @typescript-eslint/no-unsafe-return */
import { User, UserProfile } from '@bsaffer/common/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async registerUser(user: { profile: UserProfile }) {
    const createdUser = await this.prisma.user.upsert({
      update: {
        email: user.profile.email,
        name: user.profile.name,
      },
      where: {
        providerId: user.profile.sub,
      },
      create: {
        providerId: user.profile.sub,
        email: user.profile.email,
        name: user.profile.name,
        admin: true,
      },
    });

    return createdUser;
  }

  public async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        providerId: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  public async getUserProjects(userId: number) {
    const projects = await this.prisma.projectUser.findMany({
      where: {
        userId,
      },
      include: {
        project: true,
      },
    });

    return projects;
  }
}
