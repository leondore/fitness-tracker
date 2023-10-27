import type { User } from '@supabase/supabase-js';

export enum Role {
  Visitor = 0,
  Member = 1,
  Admin = 2,
}

export interface AuthUser extends User {
  app_metadata: {
    role: Role;
  };
}
