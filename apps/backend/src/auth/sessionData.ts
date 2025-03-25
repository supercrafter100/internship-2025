import { User } from '@bsaffer/common/entity/user.entity';
import { User as dbUser, Role } from '@prisma/client';
import { Request } from 'express';

export type SessionRequest = Request & {
  session: {
    user: User;
    internalUser: dbUser;
    projects: ({
      project: {
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        shortDescription: string;
        public: boolean;
        imgKey: string;
      };
    } & {
      id: number;
      projectId: number;
      userId: number;
      role: Role;
    })[];
  };
};
