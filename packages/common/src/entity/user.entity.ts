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

export class User {
    public user!: { profile: UserProfile };
    public internalUser!: InternalUser;

    public static fromJson(json: any): User {
        const user = new User();
        user.user = { profile: UserProfile.fromJson(json.user.profile) }; // Assuming the user has a `profile` object
        user.internalUser = InternalUser.fromJson(json.internalUser);
        return user;
    }
}
