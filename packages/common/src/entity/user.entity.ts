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

export class User {
  public profile!: UserProfile;

  public static fromJson(json: any): User {
    const user = new User();
    user.profile = UserProfile.fromJson(json.profile); // Assuming the user has a `profile` object
    return user;
  }
}
