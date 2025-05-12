import { UserProfile } from '@bsaffer/common/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async registerUser(user: { profile: UserProfile }) {
    const createdUser = await this.prisma.user.upsert({
      update: {
        email: user.profile.email.toLowerCase(),
        name: user.profile.name,
      },
      where: {
        providerId: user.profile.sub,
      },
      create: {
        providerId: user.profile.sub,
        email: user.profile.email.toLowerCase(),
        name: user.profile.name,
        admin: false,
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
        user: true,
      },
    });

    return projects;
  }

  // Dit is een helper functie die je kan gebruiken om alle users van een project op te halen
  public async getAllProjectUsers(projectId: number) {
    const projectUsers = await this.prisma.projectUser.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });

    return projectUsers;
  }

  // Dit is een helper functie die je kan gebruiken om een user toe te voegen aan een project
  public async addUserToProject(projectId: number, userEmail: string) {
    console.log(userEmail);
    // Zoek de user op met de gegeven email
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    console.log('User:', user);

    if (!user) {
      throw new Error('User not found');
    }

    // Controleer of de user al is toegevoegd aan het project
    const existingProjectUser = await this.prisma.projectUser.findFirst({
      where: {
        projectId: projectId,
        userId: user.id,
      },
    });

    if (existingProjectUser) {
      throw new Error('User is already added to the project');
    }

    // Voeg de user toe als projectUser
    const projectUser = await this.prisma.projectUser.create({
      data: {
        projectId,
        userId: user.id,
        admin: false,
      },
    });

    return projectUser;
  }

  // Dit is een helper functie die je kan gebruiken om een user te verwijderen van een project
  public async removeUserFromProject(projectId: number, userId: string) {
    const projectUser = await this.prisma.projectUser.deleteMany({
      where: {
        projectId,
        userId: Number(userId),
      },
    });

    return projectUser;
  }

  // Dit is een helper functie die je kan gebruiken om de admin status van een user te updaten in een project
  public async updateAdminStatus(
    projectId: number,
    userId: string,
    admin: boolean,
  ) {
    const projectUser = await this.prisma.projectUser.updateMany({
      where: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
      data: {
        admin,
      },
    });

    return projectUser;
  }
}
