import { Project } from "./project.entity";

export class ProjectUser {
  id!: number;
  projectId!: number;
  userId!: number;
  admin!: boolean;
  user!: InternalUser;

  public static fromJson(json: any): ProjectUser {
    const projectUser = new ProjectUser();
    projectUser.id = json.id;
    projectUser.projectId = json.projectId;
    projectUser.userId = json.userId;
    projectUser.admin = json.admin;
    projectUser.user = InternalUser.fromJson(json.user);
    return projectUser;
  }
}

export class UserProfile {
  public sub!: string;
  public emailVerified!: boolean;
  public name!: string;
  public groups!: string[];
  public preferredUsername!: string;
  public givenName!: string;
  public familyName!: string;
  public email!: string;

  public static fromJson(json: any): UserProfile {
    const profile = new UserProfile();
    profile.sub = json.sub;
    profile.emailVerified = json.email_verified;
    profile.name = json.name;
    profile.groups = json.groups || [];
    profile.preferredUsername = json.preferred_username;
    profile.givenName = json.given_name;
    profile.familyName = json.family_name;
    profile.email = json.email;
    return profile;
  }
}

export class InternalUser {
  public id!: number;
  public providerId!: string;
  public email!: string;
  public name!: string;
  public admin!: boolean;

  public static fromJson(json: any): InternalUser {
    const internalUser = new InternalUser();
    internalUser.id = json.id;
    internalUser.providerId = json.provider_id;
    internalUser.email = json.email;
    internalUser.name = json.name;
    internalUser.admin = json.admin;
    return internalUser;
  }
}

export class UserProjects {
  public id!: number;
  public projectId!: number;
  public userId!: number;
  public admin!: boolean;
  public project!: Project;

  public static fromJson(json: any): UserProjects {
    const userProjects = new UserProjects();
    userProjects.id = json.id;
    userProjects.projectId = json.projectId;
    userProjects.userId = json.userId;
    userProjects.admin = json.admin;
    if (json.project !== undefined) {
      userProjects.project = Project.fromJson(json.project);
    }
    return userProjects;
  }
}

export class User {
  public user!: { profile: UserProfile; refreshToken: string };
  public internalUser!: InternalUser;
  public projects!: UserProjects[];

  public static fromJson(json: any): User {
    const user = new User();
    user.user = {
      profile: UserProfile.fromJson(json.user.profile),
      refreshToken: json.user.refreshToken,
    }; // Assuming the user has a `profile` object
    user.internalUser = InternalUser.fromJson(json.internalUser);
    user.projects = json.projects.map((project: any) =>
      UserProjects.fromJson(project)
    );
    return user;
  }
}
