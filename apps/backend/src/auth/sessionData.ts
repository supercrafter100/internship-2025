import { User } from '@bsaffer/common/entity/user.entity';
import { User as dbUser } from '@prisma/client';
import { Request } from 'express';

export type SessionRequest = Request & {
  session: {
    user: User;
    internalUser: dbUser;
  };
};
